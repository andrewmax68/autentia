
import { supabase } from '@/integrations/supabase/client';
import { BusinessFormData } from '@/types/business';

export const authService = {
  async signUp(formData: BusinessFormData) {
    console.log('Starting signup process...');
    
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
    return authData;
  },

  async login(email: string, password: string) {
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
    return data;
  },

  async logout() {
    console.log('useBusinessAuth - Logging out');
    await supabase.auth.signOut();
  },

  async getSession() {
    console.log('useBusinessAuth - Checking session...');
    const { data: { session } } = await supabase.auth.getSession();
    console.log('useBusinessAuth - Session:', session);
    return session;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
