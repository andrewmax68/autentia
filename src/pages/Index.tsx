
import React from 'react';

console.log("Index page loading...");

const Index = () => {
  console.log("Index page rendering...");
  
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
          Dove Si Vende?
        </h1>
        <p className="text-xl text-center text-gray-600">
          La piattaforma funziona! Ora posso costruire il resto.
        </p>
      </div>
    </div>
  );
};

export default Index;
