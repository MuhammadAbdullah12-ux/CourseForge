import { Card } from './Card';
import { Counter } from './Counter';
import { CourseList } from './CourseList';
import './App.css';

function App() {
  return (
    <main style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: '#f8fafc', marginBottom: '24px', fontFamily: 'system-ui, sans-serif' }}>
        CourseForge Sandbox
      </h1>
      
      {/* 1. Component Props (Static) */}
      <Card title="Introduction to React">
        <p>React is a library for building user interfaces. It is component-based and state-driven!</p>
        <strong>Need for it:</strong> Enables us to create modular, reusable UI pieces.
      </Card>

      {/* 2. Component State (Interactive) */}
      <Counter />

      {/* 3. Component Lists (Dynamic mapping) */}
      <CourseList />
    </main>
  );
}

export default App;
