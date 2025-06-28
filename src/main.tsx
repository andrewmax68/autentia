
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx is loading');

const container = document.getElementById("root");
if (container) {
  console.log('Container found, creating root');
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Container not found!');
}
