
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
      return null;
    }

    if (businessData) {
      console.log('businessService - Business found by user_id:', businessData);
      return businessData;
    }

    console.log('businessService - No business found by user_id, trying by email...');
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
      return null;
    }

    if (businessData) {
      console.log('businessService - Business found by email:', businessData);
      return businessData;
    }

    console.log('businessService - No business found by email');
    return null;
  },

  async createBusinessFromMetadata(userId: string, userMetadata: any, userEmail: string): Promise<Business | null> {
    console.log('businessService - Creating business profile from metadata');
    
    const { data: newBusiness, error: createError } = await supabase
      .from('businesses')
      .insert({
        user_id: userId,
        business_name: userMetadata.business_name,
        owner_name: userMetadata.owner_name,
        email: userEmail,
        phone: userMetadata.phone,
        category: userMetadata.category,
        region: userMetadata.region,
        description: userMetadata.description,
        website: userMetadata.website,
        primary_brand: userMetadata.primary_brand,
        secondary_brands: userMetadata.secondary_brands || [],
        is_verified: false
      })
      .select()
      .single();

    if (createError) {
      console.error('businessService - Error creating business:', createError);
      return null;
    }

    console.log('businessService - Business created:', newBusiness);
    return newBusiness;
  }
};
