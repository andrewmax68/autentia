
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';

export const businessService = {
  async getBusinessByUserId(userId: string): Promise<Business | null> {
    console.log('businessService - Fetching business for user ID:', userId);
    
    const { data: businessData, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('businessService - Error fetching business by user_id:', error);
    }

    if (businessData) {
      console.log('businessService - Business found by user_id:', businessData);
      return businessData;
    }

    console.log('businessService - No business found by user_id');
    return null;
  },

  async getBusinessByEmail(email: string): Promise<Business | null> {
    console.log('businessService - Fetching business for email:', email);
    
    const { data: businessData, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('businessService - Error fetching business by email:', error);
    }

    if (businessData) {
      console.log('businessService - Business found by email:', businessData);
      return businessData;
    }

    console.log('businessService - No business found by email');
    return null;
  },

  async linkBusinessToUser(businessId: string, userId: string): Promise<Business | null> {
    console.log('businessService - Linking business to user:', businessId, userId);
    
    const { data: updatedBusiness, error } = await supabase
      .from('businesses')
      .update({ user_id: userId })
      .eq('id', businessId)
      .select()
      .single();

    if (error) {
      console.error('businessService - Error linking business to user:', error);
      return null;
    }

    console.log('businessService - Business linked successfully:', updatedBusiness);
    return updatedBusiness;
  }
};
