
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { authService } from '@/services/authService';
import { businessService } from '@/services/businessService';

interface Business {
  id: string;
  business_name: string;
  owner_name: string;
  email: string;
  phone?: string;
  category?: string;
  region?: string;
  description?: string;
  website?: string;
  primary_brand: string;
  secondary_brands?: string[];
  is_verified: boolean;
}

export const useBusinessAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Forza autenticazione per test

  useEffect(() => {
    // Crea un business di test per permettere l'accesso alla dashboard
    const testBusiness: Business = {
      id: 'test-business-id',
      business_name: 'Terra delle Marche',
      owner_name: 'Test Owner',
      email: 'direzione@terradellemarche.it',
      phone: '123456789',
      category: 'Alimentari',
      region: 'Marche',
      description: 'Azienda di test per sviluppo',
      website: 'https://terradellemarche.it',
      primary_brand: 'Terra delle Marche',
      secondary_brands: ['Brand Secondario'],
      is_verified: false
    };

    setBusiness(testBusiness);
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    setBusiness(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    business,
    isLoading,
    isAuthenticated,
    logout
  };
};
