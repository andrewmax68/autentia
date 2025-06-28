
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BusinessSignup from "./pages/BusinessSignup";
import BusinessLogin from "./pages/BusinessLogin";
import BusinessDashboard from "./pages/BusinessDashboard";
import ProducerMapPage from "./pages/ProducerMapPage";
import ProducerWidget from "./pages/ProducerWidget";
import Map from "./pages/Map";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStores from "./pages/AdminStores";
import BrandSearch from "./pages/BrandSearch";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/business-signup" element={<BusinessSignup />} />
        <Route path="/business-login" element={<BusinessLogin />} />
        <Route path="/business-dashboard" element={<BusinessDashboard />} />
        <Route path="/produttore/:slug" element={<ProducerMapPage />} />
        <Route path="/widget/:slug" element={<ProducerWidget />} />
        <Route path="/map" element={<Map />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/stores" element={<AdminStores />} />
        <Route path="/cerca-brand" element={<BrandSearch />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
