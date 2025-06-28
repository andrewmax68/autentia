
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '@/services/authService';
import { businessService } from '@/services/businessService';
import { Business } from '@/types/business';

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
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('useBusinessAuth - Auth state changed:', event, session?.user?.email);
        console.log('useBusinessAuth - Full session object:', session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer business data fetching with setTimeout
        if (session?.user && event === 'SIGNED_IN') {
          console.log('useBusinessAuth - User signed in, loading business data...');
          setTimeout(async () => {
            await loadBusinessData(session.user.id, session.user.user_metadata, session.user.email);
          }, 0);
        } else {
          console.log('useBusinessAuth - No user or not signed in, clearing business data');
          setBusiness(null);
        }
        
        setIsInitializing(false);
      }
    );

    // THEN check for existing session
    authService.getSession().then((session) => {
      console.log('useBusinessAuth - Initial session check:', session?.user?.email);
      console.log('useBusinessAuth - Initial session full object:', session);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('useBusinessAuth - Found existing session, loading business data...');
        setTimeout(async () => {
          await loadBusinessData(session.user.id, session.user.user_metadata, session.user.email);
        }, 0);
      } else {
        console.log('useBusinessAuth - No existing session found');
      }
      
      setIsInitializing(false);
    });

    return () => {
      console.log('useBusinessAuth - Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const loadBusinessData = async (userId: string, userMetadata: any, userEmail: string | undefined) => {
    try {
      console.log('useBusinessAuth - Loading business data for user:', userId);
      console.log('useBusinessAuth - User metadata:', userMetadata);
      console.log('useBusinessAuth - User email:', userEmail);
      
      let businessData = await businessService.getBusinessByUserId(userId);
      console.log('useBusinessAuth - Business data from database:', businessData);
      
      if (!businessData && userMetadata && userEmail) {
        console.log('useBusinessAuth - No business found, creating from metadata');
        businessData = await businessService.createBusinessFromMetadata(userId, userMetadata, userEmail);
        console.log('useBusinessAuth - Created business from metadata:', businessData);
      }

      if (businessData) {
        console.log('useBusinessAuth - Business data loaded successfully:');
        console.log('- Business name:', businessData.business_name);
        console.log('- Primary brand:', businessData.primary_brand);
        console.log('- Secondary brands:', businessData.secondary_brands);
        console.log('- User ID match:', businessData.user_id === userId);
        setBusiness(businessData);
      } else {
        console.error('useBusinessAuth - No business data found after all attempts');
        setBusiness(null);
      }
    } catch (error) {
      console.error('useBusinessAuth - Error loading business data:', error);
      console.error('useBusinessAuth - Error details:', JSON.stringify(error, null, 2));
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
      
      if (result.user && !result.user.email_confirmed_at) {
        console.log('useBusinessAuth - Email not confirmed');
        return { 
          success: false, 
          error: { message: 'Per favore conferma la tua email prima di accedere' }
        };
      }

      console.log('useBusinessAuth - Login successful');
      return { success: true };
      
    } catch (error: any) {
      console.error('useBusinessAuth - Login error:', error);
      return { success: false, error };
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
