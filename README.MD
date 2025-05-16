# Gemini QA Frontend

This is a React-based frontend for the Gemini QA system. It connects to a backend service that scrapes content from a website, processes it into chunks, and answers user questions using an AI-powered QA chain.

## Features

- Displays scraped content fetched from the backend
- Shows content chunks used by the QA system
- Allows users to ask questions and get AI-generated answers
- Collapsible sections for better UI organization
- Loading states and error handling

## Requirements

- Node.js (v16+ recommended)
- The Gemini QA backend server running (default on `http://localhost:3000`)

## Installation

1. Clone this repository:

   ```bash
   git clone <repo-url>
   cd <repo-folder>
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) (or the port React uses) in your browser.

## Configuration

Make sure your backend server is running and accessible at `http://localhost:3000`. The frontend fetches data from these backend endpoints:

* `GET /debug` — returns scraped raw content and chunks
* `POST /ask` — accepts a JSON body `{ question: "your question" }` and returns an answer

If your backend runs on a different URL or port, update the API URLs in `App.jsx` accordingly.

## Usage

* View the **Scraped Content** and **Chunks** sections to see the data fetched from the backend.
* Use the **Ask a Question** section to submit questions and receive answers.
* Click on each section header to collapse or expand the content.

## Technologies

* React (JSX)
* Axios for HTTP requests
* Functional components with hooks

## License

MIT License

---

Feel free to customize or extend this frontend to fit your needs!

```

If you want, I can also help generate a README for your backend server.
```