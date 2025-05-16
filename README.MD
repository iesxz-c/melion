# Melion — AI-Powered Web Scraper & Q&A System Using LangChain & Gemini

Melion is a full-stack project that scrapes website content, processes and embeds it using LangChain, and enables natural language question answering powered by Gemini AI.

---

## Key Features

### Backend (Node.js + LangChain)

- Website scraping and text extraction
- Content chunking and vector embedding creation using LangChain utilities
- Builds a LangChain-based QA chain leveraging Gemini as the LLM
- REST API exposing `/debug` (scraped content & chunks) and `/ask` (QA)
- Efficient retrieval & question answering using vector stores and LangChain’s pipeline

### Frontend (React)

- Displays scraped raw content and chunked data with collapsible UI
- Accepts user questions and queries backend QA chain
- Shows AI-generated answers with loading and error states

---

## Tech Stack

- **Backend:** Node.js, Express, LangChain, Gemini, TypeScript
- **Frontend:** React (JSX), Axios
- **Middleware:** CORS for cross-origin requests

---

## Setup & Run

1. **Backend**

```bash
cd backend
npm install
npm start
````

2. **Frontend**

```bash
cd frontend
npm install
npm start
```

3. Visit the React app in your browser and interact with Melion’s QA system.

4. To start the backend server.ts 
```bash
npx ts-node src/server.ts
```
5. To start the frontend app
```
npm run dev
```
---