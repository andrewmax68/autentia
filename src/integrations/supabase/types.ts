export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login: string | null
          name: string
          password_hash: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name: string
          password_hash: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          password_hash?: string
        }
        Relationships: []
      }
      businesses: {
        Row: {
          business_name: string
          category: string | null
          created_at: string | null
          description: string | null
          email: string
          id: string
          is_verified: boolean | null
          last_activity: string | null
          logo_url: string | null
          owner_name: string
          phone: string | null
          primary_brand: string
          region: string | null
          secondary_brands: string[] | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          business_name: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          is_verified?: boolean | null
          last_activity?: string | null
          logo_url?: string | null
          owner_name: string
          phone?: string | null
          primary_brand: string
          region?: string | null
          secondary_brands?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          business_name?: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          is_verified?: boolean | null
          last_activity?: string | null
          logo_url?: string | null
          owner_name?: string
          phone?: string | null
          primary_brand?: string
          region?: string | null
          secondary_brands?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      stores: {
        Row: {
          address: string
          brand: string
          business_id: string | null
          city: string
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          opening_hours: Json | null
          phone: string | null
          postal_code: string | null
          province: string
          services: string[] | null
          store_name: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address: string
          brand: string
          business_id?: string | null
          city: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          opening_hours?: Json | null
          phone?: string | null
          postal_code?: string | null
          province: string
          services?: string[] | null
          store_name: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          brand?: string
          business_id?: string | null
          city?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          opening_hours?: Json | null
          phone?: string | null
          postal_code?: string | null
          province?: string
          services?: string[] | null
          store_name?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "public_businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_businesses: {
        Row: {
          business_name: string | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string | null
          logo_url: string | null
          primary_brand: string | null
          region: string | null
          secondary_brands: string[] | null
          website: string | null
        }
        Insert: {
          business_name?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          logo_url?: string | null
          primary_brand?: string | null
          region?: string | null
          secondary_brands?: string[] | null
          website?: string | null
        }
        Update: {
          business_name?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          logo_url?: string | null
          primary_brand?: string | null
          region?: string | null
          secondary_brands?: string[] | null
          website?: string | null
        }
        Relationships: []
      }
      public_stores: {
        Row: {
          address: string | null
          brand: string | null
          business_name: string | null
          category: string | null
          city: string | null
          email: string | null
          id: string | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          opening_hours: Json | null
          phone: string | null
          province: string | null
          services: string[] | null
          store_name: string | null
          website: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
