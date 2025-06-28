
console.log("=== APP FILE LOADED ===");

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

const App = () => {
  console.log("=== APP COMPONENT RENDERING ===");
  
  try {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </BrowserRouter>
    );
  } catch (error) {
    console.error("Errore in App:", error);
    return <div style={{ color: "red", fontSize: "20px" }}>ERRORE NELL'APP</div>;
  }
};

console.log("=== APP COMPONENT DEFINED ===");

export default App;
