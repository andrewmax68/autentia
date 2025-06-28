
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export interface Business {
  id: string;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  category: string;
  region: string;
  description: string;
  website: string;
  logo_url: string | null;
  primary_brand: string;
  secondary_brands: string[];
  is_verified: boolean;
}

export const useBusinessAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  console.log('useBusinessAuth - Hook initialized');

  // Check if user is logged in and get business data
  useEffect(() => {
    console.log('useBusinessAuth - Effect running');
    const checkAuth = async () => {
      try {
        console.log('useBusinessAuth - Checking session...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('useBusinessAuth - Session:', session);
        
        if (session?.user) {
          console.log('useBusinessAuth - User found, fetching business data');
          
          // Fetch real business data from database
          const { data: businessData, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (error) {
            console.error('useBusinessAuth - Error fetching business:', error);
            // User exists but no business registered yet
            setIsAuthenticated(true);
            setBusiness(null);
          } else {
            console.log('useBusinessAuth - Business found:', businessData);
            setBusiness(businessData);
            setIsAuthenticated(true);
          }
        } else {
          console.log('useBusinessAuth - No user session');
          setIsAuthenticated(false);
          setBusiness(null);
        }
      } catch (error) {
        console.error('useBusinessAuth - Error checking auth:', error);
        setIsAuthenticated(false);
        setBusiness(null);
      } finally {
        setIsLoading(false);
        console.log('useBusinessAuth - Loading finished');
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('useBusinessAuth - Auth state changed:', event, session);
        if (session?.user) {
          setIsAuthenticated(true);
          // Refetch business data when auth state changes
          checkAuth();
        } else {
          setIsAuthenticated(false);
          setBusiness(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (formData: BusinessFormData) => {
    setIsLoading(true);
    
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/business-dashboard`
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Upload logo if provided
        let logoUrl = null;
        if (formData.logo) {
          const fileExt = formData.logo.name.split('.').pop();
          const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('business-logos')
            .upload(fileName, formData.logo);

          if (uploadError) {
            console.error('Logo upload error:', uploadError);
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('business-logos')
              .getPublicUrl(fileName);
            logoUrl = publicUrl;
          }
        }

        // Create business profile
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .insert({
            user_id: authData.user.id,
            business_name: formData.businessName,
            owner_name: formData.ownerName,
            email: formData.email,
            phone: formData.phone,
            category: formData.category,
            region: formData.region,
            description: formData.description,
            website: formData.website,
            logo_url: logoUrl,
            primary_brand: formData.primaryBrand,
            secondary_brands: formData.secondaryBrands,
          })
          .select()
          .single();

        if (businessError) throw businessError;

        toast({
          title: "Registrazione completata!",
          description: "Controlla la tua email per verificare l'account.",
        });

        return { success: true };
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Errore durante la registrazione",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch business data after login
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (businessError) {
          console.error('Error fetching business after login:', businessError);
          // User exists but no business - redirect to complete registration
          setIsAuthenticated(true);
          setBusiness(null);
        } else {
          setBusiness(businessData);
          setIsAuthenticated(true);
        }
      }

      toast({
        title: "Login effettuato!",
        description: "Benvenuto nella tua dashboard.",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Errore di login",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setBusiness(null);
    setIsAuthenticated(false);
  };

  return { 
    signUp, 
    login, 
    logout, 
    business, 
    isAuthenticated, 
    isLoading 
  };
};
