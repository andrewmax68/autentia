
import { useState } from "react";

console.log("=== INDEX FILE LOADED ===");

const Index = () => {
  console.log("=== INDEX COMPONENT RENDERING ===");
  
  try {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "red", 
        padding: "20px",
        color: "white",
        fontSize: "24px"
      }}>
        <h1>TEST - Se vedi questo, React funziona!</h1>
        <p>Pagina di test - sfondo rosso per debug</p>
      </div>
    );
  } catch (error) {
    console.error("Errore nel render:", error);
    return <div>ERRORE NEL COMPONENTE</div>;
  }
};

console.log("=== INDEX COMPONENT DEFINED ===");

export default Index;
