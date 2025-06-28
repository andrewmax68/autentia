
import { supabase } from '@/integrations/supabase/client';
import { BusinessFormData } from '@/types/business';

export const authService = {
  async signUp(formData: BusinessFormData) {
    console.log('authService - Starting signup process...');
    
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
      console.error('authService - Auth signup error:', authError);
      throw authError;
    }

    console.log('authService - Auth signup successful:', authData);
    return authData;
  },

  async login(email: string, password: string) {
    console.log('authService - Starting login process for:', email);
    console.log('authService - Password length:', password.length);
    console.log('authService - Full login attempt details:', {
      email,
      passwordProvided: !!password,
      passwordLength: password.length,
      timestamp: new Date().toISOString()
    });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('authService - Login error:', error);
      console.error('authService - Error details:', {
        message: error.message,
        status: error.status,
        code: error.code || 'no_code',
        name: error.name || 'no_name'
      });
      
      // Tenta di ottenere più informazioni sull'errore
      if (error.message === 'Invalid login credentials') {
        console.log('authService - Checking if user exists in auth...');
        try {
          // Verifica se l'utente esiste controllando la tabella businesses
          const { data: businessData, error: businessError } = await supabase
            .from('businesses')
            .select('email, business_name, is_verified')
            .eq('email', email)
            .single();

          if (businessData) {
            console.log('authService - User exists in businesses table:', businessData);
          } else {
            console.log('authService - User not found in businesses table');
          }
          
          if (businessError) {
            console.log('authService - Business query error:', businessError);
          }
        } catch (debugError) {
          console.error('authService - Debug error:', debugError);
        }
      }
      
      throw error;
    }

    console.log('authService - Login successful:', data);
    console.log('authService - User details:', {
      id: data.user?.id,
      email: data.user?.email,
      email_confirmed_at: data.user?.email_confirmed_at,
      created_at: data.user?.created_at,
      last_sign_in_at: data.user?.last_sign_in_at
    });
    
    return data;
  },

  async logout() {
    console.log('authService - Logging out');
    await supabase.auth.signOut();
  },

  async getSession() {
    console.log('authService - Checking session...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('authService - Session error:', error);
    }
    
    console.log('authService - Session result:', session);
    return session;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Nuova funzione per debug
  async debugUserAccount(email: string) {
    console.log('authService - Debug account for:', email);
    
    try {
      // Controlla se l'utente esiste nella tabella businesses
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('email', email)
        .single();

      console.log('authService - Business data:', businessData);
      console.log('authService - Business error:', businessError);

      return {
        businessExists: !!businessData,
        businessData,
        businessError
      };
    } catch (error) {
      console.error('authService - Debug error:', error);
      return {
        businessExists: false,
        businessData: null,
        businessError: error
      };
    }
  }
};
