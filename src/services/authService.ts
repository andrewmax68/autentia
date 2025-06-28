
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
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('authService - Login error:', error);
      throw error;
    }

    console.log('authService - Login successful:', data);
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

  async resendConfirmation(email: string) {
    console.log('authService - Resending confirmation email for:', email);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/business-dashboard`
      }
    });

    if (error) {
      console.error('authService - Resend confirmation error:', error);
      throw error;
    }

    console.log('authService - Confirmation email resent successfully');
  },

  async confirmUser(token: string, email: string) {
    console.log('authService - Confirming user manually');
    
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });

    if (error) {
      console.error('authService - Confirmation error:', error);
      throw error;
    }

    console.log('authService - User confirmed successfully:', data);
    return data;
  }
};
