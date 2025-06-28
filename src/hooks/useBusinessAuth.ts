
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

export interface BusinessFormData {
  businessName: string;
  ownerName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  category: string;
  region: string;
  description: string;
  website: string;
  primaryBrand: string;
  secondaryBrands: string[];
  logo: File | null;
  acceptTerms: boolean;
}

export const useBusinessAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Forza autenticazione per test

  useEffect(() => {
    // Crea un business di test con UUID valido per permettere l'accesso alla dashboard
    const testBusiness: Business = {
      id: '550e8400-e29b-41d4-a716-446655440000', // UUID valido per test
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Per ora forza il login senza chiamare il servizio
      console.log('Login forzato per test:', email);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (formData: BusinessFormData) => {
    setIsLoading(true);
    try {
      // Per ora forza la registrazione senza chiamare il servizio
      console.log('SignUp forzato per test:', formData.email);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('SignUp error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

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
    login,
    signUp,
    logout
  };
};
