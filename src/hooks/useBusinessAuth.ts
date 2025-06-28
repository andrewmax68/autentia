
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
  company_name: string;
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
  slug: string;
}

export const useBusinessAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check if user is logged in and get business data
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Mock business data for now
        const mockBusiness: Business = {
          id: session.user.id,
          company_name: "Pastificio del Borgo",
          owner_name: "Mario Rossi",
          email: session.user.email || "",
          phone: "+39 333 123 4567",
          category: "Alimentari",
          region: "Toscana",
          description: "Produzione artigianale di pasta fresca",
          website: "https://pastificiobargo.it",
          logo_url: null,
          primary_brand: "Pasta del Borgo",
          secondary_brands: ["Bio Pasta", "Pasta Premium"],
          slug: "pastificio-del-borgo"
        };
        setBusiness(mockBusiness);
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  const signUp = async (formData: BusinessFormData) => {
    setIsLoading(true);
    
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
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
        const { error: businessError } = await supabase
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
          });

        if (businessError) throw businessError;

        toast({
          title: "Registrazione completata!",
          description: "Controlla la tua email per verificare l'account.",
        });

        return { success: true };
      }
    } catch (error: any) {
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
        const mockBusiness: Business = {
          id: data.user.id,
          company_name: "Pastificio del Borgo",
          owner_name: "Mario Rossi",
          email: data.user.email || "",
          phone: "+39 333 123 4567",
          category: "Alimentari",
          region: "Toscana",
          description: "Produzione artigianale di pasta fresca",
          website: "https://pastificiobargo.it",
          logo_url: null,
          primary_brand: "Pasta del Borgo",
          secondary_brands: ["Bio Pasta", "Pasta Premium"],
          slug: "pastificio-del-borgo"
        };
        setBusiness(mockBusiness);
        setIsAuthenticated(true);
      }

      return { success: true };
    } catch (error: any) {
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
