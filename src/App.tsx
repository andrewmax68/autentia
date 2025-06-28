
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BusinessSignup from "./pages/BusinessSignup";
import BusinessLogin from "./pages/BusinessLogin";
import BusinessDashboard from "./pages/BusinessDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/business-signup" element={<BusinessSignup />} />
        <Route path="/business-login" element={<BusinessLogin />} />
        <Route path="/business-dashboard" element={<BusinessDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
