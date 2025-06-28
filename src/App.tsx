
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BusinessDashboard from "./pages/BusinessDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/business-dashboard" element={<BusinessDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
