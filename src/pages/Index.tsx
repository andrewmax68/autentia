
import React from "react";

console.log('Index.tsx file loaded');

const Index = () => {
  console.log('Index component rendering');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'red', 
      padding: '20px',
      color: 'white',
      fontSize: '24px'
    }}>
      <h1>FUNZIONA! DOVE SI VENDE?</h1>
      <p>Se vedi questo, la pagina funziona!</p>
      <button 
        onClick={() => {
          console.log('Button clicked');
          alert('Il bottone funziona!');
        }}
        style={{
          backgroundColor: 'white',
          color: 'black',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        CLICCA QUI PER TEST
      </button>
    </div>
  );
};

console.log('Index component defined');

export default Index;
