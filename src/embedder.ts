import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";

// Takes raw text, splits into chunks, returns vector store
export async function createVectorStore(text: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const docs = await splitter.createDocuments([text]);

  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "embedding-001",
  });

  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

  return vectorStore;
}
