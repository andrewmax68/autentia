
export interface Business {
  id: string;
  user_id: string;
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
