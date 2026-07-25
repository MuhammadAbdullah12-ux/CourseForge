import { useState } from 'react';

export function Counter() {
  // 1. Declare state variable 'count' and state setter function 'setCount'.
  // Initial state is 0.
  const [count, setCount] = useState<number>(0);

  console.log(`[Counter] rendered. Current count: ${count}`);

  return (
    <div style={{
      border: '1px solid #475569',
      borderRadius: '12px',
      padding: '20px',
      margin: '16px 0',
      backgroundColor: '#1e293b',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
      fontFamily: 'system-ui, sans-serif',
      color: '#f1f5f9',
      textAlign: 'center'
    }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#10b981' }}>Interactive Counter</h3>
      
      <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        Count: <span style={{ color: '#34d399' }}>{count}</span>
      </p>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {/* Decrement Button */}
        <button 
          onClick={() => setCount(count - 1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          - Decrement
        </button>

        {/* Increment Button */}
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          + Increment
        </button>
      </div>
    </div>
  );
}
