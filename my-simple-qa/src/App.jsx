import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CollapsibleSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section style={{ marginBottom: 20 }}>
      <h2
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          backgroundColor: '#222',
          padding: '10px 15px',
          color: 'white',
          borderRadius: 4,
        }}
      >
        {title} {isOpen ? '▼' : '▶'}
      </h2>
      {isOpen && (
        <div
          style={{
            background: 'black',
            color: 'white',
            padding: 15,
            borderRadius: 4,
            maxHeight: '400px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {children}
        </div>
      )}
    </section>
  );
};

const App = () => {
  const [scrapedContent, setScrapedContent] = useState('');
  const [chunks, setChunks] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get('http://localhost:3000/debug');
        setScrapedContent(res.data.raw);
        setChunks(res.data.chunks);
      } catch (err) {
        console.error('Error fetching debug data', err);
      }
    };

    fetchContent();
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/ask', { question });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer('Error fetching answer.');
      console.error(err);
    }
    setLoading(false);
  };

  return ( 
    <div style={{ padding: 20, fontFamily: 'Arial' }}>   
    <div style={{marginLeft:333}}>
      <h1> MELION WEB SCRAPPER</h1>
    </div>
      <CollapsibleSection title="Scraped Content" defaultOpen={false}>
        {scrapedContent || 'Loading...'}
      </CollapsibleSection>

      <CollapsibleSection title="Chunks" defaultOpen={false}>
        {chunks.length > 0 ? (
          chunks.map((chunk, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <strong>Chunk {i + 1}:</strong>
              <div>{chunk}</div>
            </div>
          ))
        ) : (
          <p>Loading chunks...</p>
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Ask a Question" defaultOpen={true}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          style={{ width: '80%', padding: 8, fontSize: 16 }}
        />
        <button onClick={handleAsk} style={{ padding: 10, marginLeft: 10 }}>
          {loading ? 'Asking...' : 'Ask'}
        </button>

        {answer && (
          <div style={{ marginTop: 20, whiteSpace: 'pre-wrap' }}>
            <h3>Answer:</h3>
            <div>{answer}</div>
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
};

export default App;
