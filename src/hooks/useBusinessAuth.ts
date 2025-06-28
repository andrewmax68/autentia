import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '@/services/authService';
import { businessService } from '@/services/businessService';
import { Business } from '@/types/business';
import { supabase } from '@/integrations/supabase/client';

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

interface AuthResult {
  success: boolean;
  error?: any;
}

export const useBusinessAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);  
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    console.log('useBusinessAuth - Setting up auth listener');
    
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('useBusinessAuth - Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('useBusinessAuth - User signed in, loading business data...');
          setTimeout(async () => {
            await loadBusinessData(session.user);
          }, 0);
        } else {
          console.log('useBusinessAuth - No user, clearing business data');
          setBusiness(null);
        }
        
        setIsInitializing(false);
      }
    );

    authService.getSession().then((session) => {
      console.log('useBusinessAuth - Initial session check:', session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('useBusinessAuth - Found existing session, loading business data...');
        setTimeout(async () => {
          await loadBusinessData(session.user);
        }, 0);
      }
      
      setIsInitializing(false);
    });

    return () => {
      console.log('useBusinessAuth - Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const loadBusinessData = async (user: User) => {
    try {
      console.log('useBusinessAuth - Loading business data for user:', user.id, 'email:', user.email);
      
      // Prima cerca per user_id
      let businessData = await businessService.getBusinessByUserId(user.id);
      
      // Se non trova per user_id, cerca per email
      if (!businessData && user.email) {
        console.log('useBusinessAuth - Trying to find business by email:', user.email);
        businessData = await businessService.getBusinessByEmail(user.email);
        
        // Se trova per email, collega il business all'utente
        if (businessData) {
          console.log('useBusinessAuth - Found business by email, linking to user');
          businessData = await businessService.linkBusinessToUser(businessData.id, user.id);
        }
      }

      if (businessData) {
        console.log('useBusinessAuth - Business data loaded successfully:', businessData.business_name);
        setBusiness(businessData);
      } else {
        console.log('useBusinessAuth - No business found for user');
        setBusiness(null);
      }
    } catch (error) {
      console.error('useBusinessAuth - Error loading business data:', error);
      setBusiness(null);
    }
  };

  const signUp = async (formData: BusinessFormData): Promise<AuthResult> => {
    setIsLoading(true);
    
    try {
      console.log('useBusinessAuth - Starting signup for:', formData.email);
      
      const authResult = await authService.signUp(formData);
      
      if (authResult.user && !authResult.user.email_confirmed_at) {
        console.log('useBusinessAuth - Signup successful, email confirmation required');
        return { 
          success: true, 
          error: { message: 'Ti abbiamo inviato un\'email di conferma. Controlla la tua casella di posta.' }
        };
      }

      console.log('useBusinessAuth - Signup successful');
      return { success: true };
      
    } catch (error: any) {
      console.error('useBusinessAuth - Signup error:', error);
      
      let errorMessage = 'Errore durante la registrazione';
      if (error.message?.includes('already registered')) {
        errorMessage = 'Questa email è già registrata';
      } else if (error.message?.includes('Password should be')) {
        errorMessage = 'La password deve essere di almeno 6 caratteri';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    
    try {
      console.log('useBusinessAuth - Starting login for:', email);
      
      const result = await authService.login(email, password);
      
      console.log('useBusinessAuth - Login successful for:', email);
      return { success: true };
      
    } catch (error: any) {
      console.error('useBusinessAuth - Login error:', error);
      
      let errorMessage = 'Errore durante il login';
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email o password non corretti';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Per favore conferma la tua email prima di accedere';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    console.log('useBusinessAuth - Logging out');
    await authService.logout();
    setUser(null);
    setSession(null);
    setBusiness(null);
  };

  return {
    user,
    session,
    business,
    isLoading,
    isInitializing,
    signUp,
    login,
    logout
  };
};
