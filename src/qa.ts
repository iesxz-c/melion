import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// Creates a full Q&A chain using Gemini + vector store
export async function createQAChain(vectorStore: MemoryVectorStore) {
  const retriever = vectorStore.asRetriever();

  const prompt = ChatPromptTemplate.fromTemplate(`
You are a helpful assistant. Use the following context to answer the question:

<context>
{context}
</context>

Question: {input}
`);

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    maxOutputTokens: 2048,
  });

  const documentChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  const chain = await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever,
  });

  return chain;
}
