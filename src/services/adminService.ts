import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

export const adminService = {
  async login(email: string, password: string) {
    console.log('Admin login attempt for:', email);
    
    // Verifica le credenziali admin
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      throw new Error('Credenziali non valide');
    }

    // Per semplicità, controlliamo solo se la password è "admin123"
    if (password !== 'admin123') {
      throw new Error('Credenziali non valide');
    }

    // Aggiorna ultimo login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.id);

    // Salva in localStorage
    localStorage.setItem('admin_user', JSON.stringify(data));
    
    return data;
  },

  async logout() {
    localStorage.removeItem('admin_user');
  },

  getCurrentAdmin(): AdminUser | null {
    const adminData = localStorage.getItem('admin_user');
    return adminData ? JSON.parse(adminData) : null;
  },

  async getDashboardStats() {
    // Query dirette per contare i record
    const [businessesQuery, storesQuery] = await Promise.all([
      supabase.from('businesses').select('id', { count: 'exact', head: true }),
      supabase.from('stores').select('id', { count: 'exact', head: true })
    ]);

    return {
      totalBrands: businessesQuery.count || 0,
      totalStores: storesQuery.count || 0
    };
  },

  async getBusinesses() {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching businesses:', error);
      throw error;
    }
    return data || [];
  },

  async getStores(businessId?: string) {
    let query = supabase
      .from('stores')
      .select(`
        *,
        businesses!inner(business_name, primary_brand)
      `)
      .order('created_at', { ascending: false });

    if (businessId) {
      query = query.eq('business_id', businessId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
    return data || [];
  },

  async toggleBusinessStatus(businessId: string, isVerified: boolean) {
    const { error } = await supabase
      .from('businesses')
      .update({ is_verified: isVerified })
      .eq('id', businessId);

    if (error) throw error;
  },

  async exportStoresCSV(stores: any[]) {
    const headers = ['Nome Negozio', 'Brand', 'Indirizzo', 'Città', 'Provincia', 'Telefono', 'Email'];
    const csvContent = [
      headers.join(','),
      ...stores.map(store => [
        store.store_name,
        store.businesses?.business_name || '',
        store.address,
        store.city,
        store.province,
        store.phone || '',
        store.email || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `punti-vendita-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
