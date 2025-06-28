
import React from "react";

const Index = () => {
  console.log('Index component is rendering');
  
  const handleBusinessLogin = () => {
    console.log('Business login clicked');
    window.location.href = '/business-login';
  };

  const handleBusinessDashboard = () => {
    console.log('Business dashboard clicked');
    window.location.href = '/business-dashboard';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'white', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '32px', 
        fontWeight: 'bold', 
        color: 'black', 
        marginBottom: '20px' 
      }}>
        DOVE SI VENDE? - TEST
      </h1>
      
      <div style={{ 
        backgroundColor: '#fef3c7', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
          🚧 NAVIGAZIONE TEST:
        </p>
        <div>
          <button 
            onClick={handleBusinessLogin}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '10px 20px',
              marginRight: '10px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Vai al Login Business
          </button>
          <button 
            onClick={handleBusinessDashboard}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Vai al Dashboard Business
          </button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '20px', 
        borderRadius: '8px' 
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Stato del Progetto</h2>
        <p style={{ fontSize: '18px' }}>✅ Homepage semplificata</p>
        <p style={{ fontSize: '18px' }}>✅ Navigazione attiva</p>
        <p style={{ fontSize: '18px' }}>🔧 Debug in corso</p>
      </div>
    </div>
  );
};

export default Index;
