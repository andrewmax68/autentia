
console.log("=== INDEX FILE LOADED ===");

const Index = () => {
  console.log("=== INDEX COMPONENT RENDERING ===");
  
  return (
    <div>
      <h1>TEST FUNZIONA!</h1>
      <p>Se vedi questo testo, React sta funzionando</p>
      <div style={{
        width: "200px",
        height: "200px",
        backgroundColor: "red",
        color: "white",
        padding: "20px",
        margin: "20px"
      }}>
        QUADRATO ROSSO DI TEST
      </div>
    </div>
  );
};

console.log("=== INDEX COMPONENT DEFINED ===");

export default Index;
