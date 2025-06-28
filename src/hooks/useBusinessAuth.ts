
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
          console.log('useBusinessAuth - User found, checking if email is confirmed');
          
          // Check if user email is confirmed
          if (!session.user.email_confirmed_at) {
            console.log('useBusinessAuth - Email not confirmed yet');
            setIsAuthenticated(false);
            setBusiness(null);
            setIsLoading(false);
            return;
          }
          
          console.log('useBusinessAuth - Email confirmed, fetching business data');
          
          // Fetch real business data from database
          const { data: businessData, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (error) {
            console.error('useBusinessAuth - Error fetching business:', error);
            
            // Check if business data exists in user metadata (from signup)
            const userData = session.user.user_metadata;
            if (userData && userData.business_name) {
              console.log('useBusinessAuth - Creating business profile from metadata');
              
              // Create business profile from signup data
              const { data: newBusiness, error: createError } = await supabase
                .from('businesses')
                .insert({
                  user_id: session.user.id,
                  business_name: userData.business_name,
                  owner_name: userData.owner_name,
                  email: session.user.email,
                  phone: userData.phone,
                  category: userData.category,
                  region: userData.region,
                  description: userData.description,
                  website: userData.website,
                  primary_brand: userData.primary_brand,
                  secondary_brands: userData.secondary_brands || [],
                  is_verified: false
                })
                .select()
                .single();

              if (createError) {
                console.error('useBusinessAuth - Error creating business:', createError);
                setIsAuthenticated(true);
                setBusiness(null);
              } else {
                console.log('useBusinessAuth - Business created:', newBusiness);
                setBusiness(newBusiness);
                setIsAuthenticated(true);
              }
            } else {
              // User exists but no business registered yet
              setIsAuthenticated(true);
              setBusiness(null);
            }
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
      console.log('Starting signup process...');
      
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/business-dashboard`,
          data: {
            business_name: formData.businessName,
            owner_name: formData.ownerName,
            phone: formData.phone,
            category: formData.category,
            region: formData.region,
            description: formData.description,
            website: formData.website,
            primary_brand: formData.primaryBrand,
            secondary_brands: formData.secondaryBrands,
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        throw authError;
      }

      console.log('Auth signup successful:', authData);

      if (authData.user) {
        // For new signups, we'll store the business data after email confirmation
        // For now, just show success message
        toast({
          title: "Registrazione completata!",
          description: "Controlla la tua email per verificare l'account. Una volta verificato, potrai accedere alla dashboard.",
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
      console.log('useBusinessAuth - Starting login process');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('useBusinessAuth - Login error:', error);
        throw error;
      }

      console.log('useBusinessAuth - Login successful:', data);

      if (data.user) {
        // Check if email is confirmed
        if (!data.user.email_confirmed_at) {
          console.log('useBusinessAuth - Email not confirmed');
          toast({
            title: "Email non confermata",
            description: "Controlla la tua email e clicca sul link di conferma prima di accedere.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          return { success: false, error: "Email non confermata" };
        }

        // Fetch business data after login
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (businessError) {
          console.error('Error fetching business after login:', businessError);
          
          // Check if we need to create business from metadata
          const userData = data.user.user_metadata;
          if (userData && userData.business_name) {
            console.log('useBusinessAuth - Creating business from metadata after login');
            
            const { data: newBusiness, error: createError } = await supabase
              .from('businesses')
              .insert({
                user_id: data.user.id,
                business_name: userData.business_name,
                owner_name: userData.owner_name,
                email: data.user.email,
                phone: userData.phone,
                category: userData.category,
                region: userData.region,
                description: userData.description,
                website: userData.website,
                primary_brand: userData.primary_brand,
                secondary_brands: userData.secondary_brands || [],
                is_verified: false
              })
              .select()
              .single();

            if (createError) {
              console.error('Error creating business after login:', createError);
              setIsAuthenticated(true);
              setBusiness(null);
            } else {
              setBusiness(newBusiness);
              setIsAuthenticated(true);
            }
          } else {
            // User exists but no business - redirect to complete registration
            setIsAuthenticated(true);
            setBusiness(null);
          }
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
    console.log('useBusinessAuth - Logging out');
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
