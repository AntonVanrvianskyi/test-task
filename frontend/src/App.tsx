import React, { useState, useRef } from 'react';


const App: React.FC = () => {
  const [concurrency, setConcurrency] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [responses, setResponses] = useState<number[]>([]);
  const intervalRef = useRef<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConcurrency(Number(e.target.value));
  };

  const handleStart = async () => {
    if (concurrency <= 0 || concurrency > 100) return;

    setIsStarted(true);
    let activeRequests = 0;
    let totalRequests = 0;
    let requestIndex = 1;

    intervalRef.current = setInterval(() => {
      if (totalRequests >= 1000) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      if (activeRequests < concurrency) {
        activeRequests++;
        totalRequests++;

        fetch(`http://localhost:3000/api`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ index: requestIndex }),
        })
          .then(response => response.json())
          .then(data => {
            setResponses(prevResponses => [...prevResponses, data.index]);
            activeRequests--;
          })
          .catch(() => {
            activeRequests--;
          });

        requestIndex++;
      }
    }, 1000 / concurrency); 
  };

  return (
    <div>
      <input 
        type="number" 
        min="0" 
        max="100" 
        value={concurrency} 
        onChange={handleChange} 
        required 
      />
      <button onClick={handleStart} disabled={isStarted}>
        Start
      </button>
      <ul>
        {responses.map((response, index) => (
          <li key={index}>{response}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
