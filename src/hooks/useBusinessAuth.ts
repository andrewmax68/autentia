
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BusinessFormData, Business } from '@/types/business';
import { authService } from '@/services/authService';
import { businessService } from '@/services/businessService';

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
        const session = await authService.getSession();
        console.log('useBusinessAuth - Current session:', session);
        
        if (session?.user) {
          console.log('useBusinessAuth - User found');
          
          // Per ora, accettiamo anche utenti non confermati per testing
          // if (!session.user.email_confirmed_at) {
          //   console.log('useBusinessAuth - Email not confirmed yet');
          //   setIsAuthenticated(false);
          //   setBusiness(null);
          //   setIsLoading(false);
          //   return;
          // }
          
          // Fetch real business data from database
          let businessData = await businessService.getBusinessByUserId(session.user.id);
          console.log('useBusinessAuth - Business data from DB:', businessData);

          if (!businessData) {
            // Check if business data exists in user metadata (from signup)
            const userData = session.user.user_metadata;
            console.log('useBusinessAuth - User metadata:', userData);
            if (userData && userData.business_name) {
              businessData = await businessService.createBusinessFromMetadata(
                session.user.id,
                userData,
                session.user.email!
              );
            }
          }

          setBusiness(businessData);
          setIsAuthenticated(true);
          console.log('useBusinessAuth - Authentication successful, business:', businessData);
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
    const { data: { subscription } } = authService.onAuthStateChange(
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
      const authData = await authService.signUp(formData);

      if (authData.user) {
        toast({
          title: "Registrazione completata!",
          description: "Account creato con successo. Ora puoi effettuare il login.",
        });

        return { success: true };
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Se l'utente esiste già, non è un errore fatale
      if (error.message?.includes('User already registered')) {
        toast({
          title: "Account già esistente",
          description: "Questo account esiste già. Prova ad effettuare il login.",
        });
        return { success: true };
      }
      
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
    console.log('useBusinessAuth - Starting login for:', email);
    
    try {
      const data = await authService.login(email, password);
      console.log('useBusinessAuth - Login response:', data);

      if (data.user) {
        console.log('useBusinessAuth - User logged in:', data.user);
        
        // Per ora, accettiamo anche utenti non confermati per testing
        // if (!data.user.email_confirmed_at) {
        //   console.log('useBusinessAuth - Email not confirmed');
        //   toast({
        //     title: "Email non confermata",
        //     description: "Controlla la tua email e clicca sul link di conferma prima di accedere.",
        //     variant: "destructive",
        //   });
        //   await authService.logout();
        //   return { success: false, error: "Email non confermata" };
        // }

        // Fetch business data after login
        let businessData = await businessService.getBusinessByUserId(data.user.id);
        console.log('useBusinessAuth - Business data after login:', businessData);

        if (!businessData) {
          // Check if we need to create business from metadata
          const userData = data.user.user_metadata;
          console.log('useBusinessAuth - User metadata for business creation:', userData);
          if (userData && userData.business_name) {
            console.log('useBusinessAuth - Creating business from metadata after login');
            businessData = await businessService.createBusinessFromMetadata(
              data.user.id,
              userData,
              data.user.email!
            );
          }
        }

        setBusiness(businessData);
        setIsAuthenticated(true);
        
        toast({
          title: "Login effettuato!",
          description: "Benvenuto nella tua dashboard.",
        });

        return { success: true };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide more specific error messages
      let errorMessage = error.message;
      if (error.message === "Invalid login credentials") {
        errorMessage = "Email o password incorretti. Assicurati di aver registrato l'account prima.";
      }
      
      toast({
        title: "Errore di login",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
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

// Export the BusinessFormData type so it can be imported by other components
export type { BusinessFormData } from '@/types/business';
