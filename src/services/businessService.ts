
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';

export const businessService = {
  async getBusinessByUserId(userId: string): Promise<Business | null> {
    console.log('useBusinessAuth - Email confirmed, fetching business data');
    
    const { data: businessData, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('useBusinessAuth - Error fetching business:', error);
      return null;
    }

    console.log('useBusinessAuth - Business found:', businessData);
    return businessData;
  },

  async createBusinessFromMetadata(userId: string, userMetadata: any, userEmail: string): Promise<Business | null> {
    console.log('useBusinessAuth - Creating business profile from metadata');
    
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
      console.error('useBusinessAuth - Error creating business:', createError);
      return null;
    }

    console.log('useBusinessAuth - Business created:', newBusiness);
    return newBusiness;
  }
};
