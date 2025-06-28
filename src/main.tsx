
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Main.tsx loading...");

const container = document.getElementById("root");
console.log("Container found:", container);

if (container) {
  const root = createRoot(container);
  console.log("Root created, rendering App...");
  root.render(<App />);
} else {
  console.error("Root container not found!");
}
