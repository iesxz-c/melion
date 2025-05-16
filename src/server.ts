import "dotenv/config";
import express from "express";
import cors from "cors";
import { scrapeWebsite } from "./scrapper";
import { createVectorStore } from "./embedder";
import { createQAChain } from "./qa";

// Define interfaces
interface ChainResponse {
  answer?: string;
  output?: string;
  text?: string;
}

// We need to match the MemoryVectorStore interface that your createQAChain expects
interface MemoryVectorStore {
  chunks?: string[];
  rawContent?: string;
  memoryVectors: any[];
  similarity: any;
  _vectorstoreType: string;
  FilterType: any;
  // Add other required properties based on your implementation
  [key: string]: any; // Allow for any additional properties
}

async function startServer(): Promise<void> {
  try {
    // Initialize Express
    const app = express();
    
    // Apply middleware
    app.use(cors());
    app.use(express.json());
    
    console.log("Scraping website...");
    const content = await scrapeWebsite("https://en.wikipedia.org/wiki/Akahori_Gedou_Hour_Rabuge");
    console.log("Website scraped successfully.");
    
    console.log("Creating vector store...");
    const vectorStore = await createVectorStore(content);
    console.log("Vector store created successfully.");
    
    console.log("Initializing Gemini QA chain...");
    const chain = await createQAChain(vectorStore);
    console.log("Gemini chain ready and available for queries.");
    
    // Store the raw content and chunks for debug access
    const rawContent = content;
    
    // Create safe chunks array using type assertion to bypass TypeScript errors
    let chunks: string[] = [];
    try {
      // Cast the entire vectorStore to any to bypass TypeScript property checks
      const anyVectorStore = vectorStore as any;
      
      // First try to get chunks directly if they exist
      if (Array.isArray(anyVectorStore.chunks)) {
        chunks = anyVectorStore.chunks;
      }
      // Then try to extract from memoryVectors if available
      else if (Array.isArray(anyVectorStore.memoryVectors)) {
        chunks = anyVectorStore.memoryVectors.map((vector: any) => {
          return vector.content || vector.text || vector.pageContent || JSON.stringify(vector);
        });
      }
      
      // Log the structure for debugging
      console.log("Vector store structure:", 
        Object.keys(anyVectorStore),
        "Has memoryVectors:", Array.isArray(anyVectorStore.memoryVectors)
      );
      
      console.log("Successfully extracted chunks for debug endpoint");
    } catch (error) {
      console.warn("Could not extract chunks from vectorStore:", error);
      // Provide empty array as fallback
      chunks = [];
    }
    
    // Define route handlers
    const healthCheckHandler = (_: any, res: any) => {
      res.status(200).json({ status: "ok" });
    };
    
    // New debug route to support frontend
    const debugHandler = (_: any, res: any) => {
      res.json({
        raw: rawContent,
        chunks: chunks
      });
    };
    
    const askHandler = async (req: any, res: any) => {
      try {
        const question = req.body.question;
        
        if (!question || typeof question !== "string") {
          return res.status(400).json({ 
            error: "Question is required and must be a string." 
          });
        }
        
        console.log("Received question:", question);
        
        const response = await chain.invoke({ input: question }) as ChainResponse;
        
        // Handle different response formats
        const answer = response.answer || response.output || response.text || "No answer available.";
        
        return res.json({ answer });
      } catch (error) {
        console.error("Error processing question:", error);
        return res.status(500).json({ 
          error: "Failed to process your question. Please try again later." 
        });
      }
    };
    
    // Register routes
    app.get("/health", healthCheckHandler);
    app.get("/debug", debugHandler);  // New debug route
    app.post("/ask", askHandler);
    
    const PORT = process.env.PORT || 3000;
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Frontend can connect to http://localhost:${PORT}/debug for content`);
      console.log(`Send POST requests to http://localhost:${PORT}/ask with JSON body {"question": "your question"}`);
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
}

// Start the server with proper error handling
startServer().catch((error) => {
  console.error("Critical error starting server:", error);
  process.exit(1);
});