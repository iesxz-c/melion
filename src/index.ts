import "dotenv/config";
import { scrapeWebsite } from "./scrapper";
import { createVectorStore } from "./embedder";
import { createQAChain } from "./qa";
import readline from "readline";

async function main() {
  const content = await scrapeWebsite("https://en.wikipedia.org/wiki/Akahori_Gedou_Hour_Rabuge");
  console.log("✅ Website scraped");
  console.log("Scraped content:\n");
  console.log(content.slice(0, 1000));

  const vectorStore = await createVectorStore(content);
  console.log("✅ Vector store created with", vectorStore.memoryVectors.length, "chunks.");
  const chain = await createQAChain(vectorStore);
  console.log("✅ Gemini chain ready");


  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

rl.question("Ask your question: ", async (question) => {
  console.log("🕵️ Asking Gemini...");
  console.log("📨 Input question:", question); // ✅ Log the question being passed

  try {
    const response = await chain.invoke({ input: question });
    console.log("📤 Full response:", response); // ✅ Check if Gemini responded
    console.log("\n🧠 Answer:\n", response.answer || response.output || "(no answer field)");
  } catch (error) {
    console.error("❌ Error invoking Gemini:", error);
  }

  rl.close();
});


}

main();
