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
      achievements: {
        Row: {
          created_at: string
          description: string
          id: number
          name: string
          points: number
        }
        Insert: {
          created_at?: string
          description?: string
          id?: number
          name: string
          points?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: string
          points?: number
        }
        Relationships: []
      }
      consumer_coupons: {
        Row: {
          consumer_id: string
          coupon_id: string
          created_at: string
          details: Json
          id: number
          is_redeemed: boolean
          merchant_id: string
          qr_token: string
        }
        Insert: {
          consumer_id: string
          coupon_id: string
          created_at?: string
          details?: Json
          id?: number
          is_redeemed?: boolean
          merchant_id: string
          qr_token: string
        }
        Update: {
          consumer_id?: string
          coupon_id?: string
          created_at?: string
          details?: Json
          id?: number
          is_redeemed?: boolean
          merchant_id?: string
          qr_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "consumer_coupons_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_coupons_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "consumers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_coupons_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      consumers: {
        Row: {
          created_at: string
          email: string
          has_purchased: boolean
          id: string
          interests: Database["public"]["Enums"]["coupon_category"][] | null
          name: string
          points_balance: number
          points_total: number
          rank: number
          referral_code: string
          referrer_code: string | null
        }
        Insert: {
          created_at?: string
          email: string
          has_purchased?: boolean
          id: string
          interests?: Database["public"]["Enums"]["coupon_category"][] | null
          name: string
          points_balance?: number
          points_total?: number
          rank?: number
          referral_code: string
          referrer_code?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          has_purchased?: boolean
          id?: string
          interests?: Database["public"]["Enums"]["coupon_category"][] | null
          name?: string
          points_balance?: number
          points_total?: number
          rank?: number
          referral_code?: string
          referrer_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consumers_rank_fkey"
            columns: ["rank"]
            isOneToOne: false
            referencedRelation: "ranks"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_categories: {
        Row: {
          category: Database["public"]["Enums"]["coupon_category"]
          created_at: string
          description: string
          id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["coupon_category"]
          created_at?: string
          description?: string
          id?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["coupon_category"]
          created_at?: string
          description?: string
          id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          accent_color: Database["public"]["Enums"]["color"]
          cash_amount: number
          category: Database["public"]["Enums"]["coupon_category"]
          created_at: string
          description: string
          discounted_price: number
          id: string
          image: string
          is_deactivated: boolean
          max_purchase_limit_per_consumer: number
          merchant_id: string
          original_price: number
          points_amount: number
          quantity: number
          rank_availability: number
          redemption_validity: number
          text_search: unknown | null
          title: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          accent_color?: Database["public"]["Enums"]["color"]
          cash_amount: number
          category?: Database["public"]["Enums"]["coupon_category"]
          created_at?: string
          description: string
          discounted_price?: number
          id?: string
          image: string
          is_deactivated?: boolean
          max_purchase_limit_per_consumer?: number
          merchant_id: string
          original_price: number
          points_amount?: number
          quantity: number
          rank_availability?: number
          redemption_validity: number
          text_search?: unknown | null
          title?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          accent_color?: Database["public"]["Enums"]["color"]
          cash_amount?: number
          category?: Database["public"]["Enums"]["coupon_category"]
          created_at?: string
          description?: string
          discounted_price?: number
          id?: string
          image?: string
          is_deactivated?: boolean
          max_purchase_limit_per_consumer?: number
          merchant_id?: string
          original_price?: number
          points_amount?: number
          quantity?: number
          rank_availability?: number
          redemption_validity?: number
          text_search?: unknown | null
          title?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_rank_availability_fkey"
            columns: ["rank_availability"]
            isOneToOne: false
            referencedRelation: "ranks"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          address: string | null
          bio: string | null
          created_at: string
          email: string
          id: string
          logo: string
          name: string
          text_search: unknown | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          created_at?: string
          email: string
          id: string
          logo: string
          name: string
          text_search?: unknown | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          id?: string
          logo?: string
          name?: string
          text_search?: unknown | null
        }
        Relationships: []
      }
      points_history: {
        Row: {
          consumer_id: string
          created_at: string
          id: number
          points_earned: number
          source: string
        }
        Insert: {
          consumer_id: string
          created_at?: string
          id?: number
          points_earned: number
          source: string
        }
        Update: {
          consumer_id?: string
          created_at?: string
          id?: number
          points_earned?: number
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_history_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "consumers"
            referencedColumns: ["id"]
          },
        ]
      }
      ranks: {
        Row: {
          created_at: string
          icon: string
          id: number
          max_points: number
          primary_color: string
          rank: Database["public"]["Enums"]["rank"]
          secondary_color: string
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: number
          max_points: number
          primary_color?: string
          rank?: Database["public"]["Enums"]["rank"]
          secondary_color?: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: number
          max_points?: number
          primary_color?: string
          rank?: Database["public"]["Enums"]["rank"]
          secondary_color?: string
        }
        Relationships: []
      }
      receipts: {
        Row: {
          amount_paid: number
          consumer_id: string
          created_at: string
          id: string | null
          merchant_id: string
          receipt_number: string
        }
        Insert: {
          amount_paid: number
          consumer_id: string
          created_at?: string
          id?: string | null
          merchant_id: string
          receipt_number: string
        }
        Update: {
          amount_paid?: number
          consumer_id?: string
          created_at?: string
          id?: string | null
          merchant_id?: string
          receipt_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipts_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "consumers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions_history: {
        Row: {
          consumer_id: string
          coupon_id: string
          created_at: string
          id: string
          merchant_id: string
          price: number | null
        }
        Insert: {
          consumer_id: string
          coupon_id: string
          created_at?: string
          id?: string
          merchant_id: string
          price?: number | null
        }
        Update: {
          consumer_id?: string
          coupon_id?: string
          created_at?: string
          id?: string
          merchant_id?: string
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_history_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "consumers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_history_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_history_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_unique_consumers: {
        Args: { p_merchant_id: string }
        Returns: number
      }
      deactivate_expired_coupons: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      full_text_search: {
        Args: { query_text: string }
        Returns: {
          id: string
          type: string
          title: string
          description: string
          rank: number
        }[]
      }
      get_highest_original_price: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      update_consumer_points: {
        Args: { consumer_id: string; points_to_add: number }
        Returns: Json
      }
    }
    Enums: {
      color:
        | "perx-blue"
        | "perx-canopy"
        | "perx-gold"
        | "perx-rust"
        | "perx-azalea"
        | "perx-navy"
        | "perx-black"
        | "perx-cloud"
        | "perx-crimson"
        | "perx-lime"
        | "perx-ocean"
        | "perx-orange"
        | "perx-orchid"
        | "perx-pink"
        | "perx-sunset"
        | "perx-yellow"
        | "perx-zen"
        | "perx-plum"
      coupon_category:
        | "Food & Beverage"
        | "Technology & Electronics"
        | "Fashion & Apparel"
        | "Health, Beauty, & Wellness"
        | "Home & Living"
        | "Automotive"
        | "Toys & Hobbies"
        | "Pets"
        | "Entertainment & Leisure"
        | "Travel & Tourism"
        | "Education & Learning"
        | "Professional Services"
        | "Transportation & Delivery"
        | "Events & Celebration"
        | "Sports & Fitness"
        | "Internet & Telecom"
        | "Subscription & Membership"
        | "Baby & Maternity"
        | "Office & Business"
        | "Hardware & Tools"
        | "Luxury Goods"
        | "Seasonal & Holiday Offers"
      rank:
        | "Bronze I"
        | "Bronze II"
        | "Bronze III"
        | "Silver I"
        | "Silver II"
        | "Silver III"
        | "Gold I"
        | "Gold II"
        | "Gold III"
        | "Platinum I"
        | "Platinum II"
        | "Platinum III"
        | "Diamond I"
        | "Diamond II"
        | "Diamond III"
      role: "consumer" | "merchant"
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
    Enums: {
      color: [
        "perx-blue",
        "perx-canopy",
        "perx-gold",
        "perx-rust",
        "perx-azalea",
        "perx-navy",
        "perx-black",
        "perx-cloud",
        "perx-crimson",
        "perx-lime",
        "perx-ocean",
        "perx-orange",
        "perx-orchid",
        "perx-pink",
        "perx-sunset",
        "perx-yellow",
        "perx-zen",
        "perx-plum",
      ],
      coupon_category: [
        "Food & Beverage",
        "Technology & Electronics",
        "Fashion & Apparel",
        "Health, Beauty, & Wellness",
        "Home & Living",
        "Automotive",
        "Toys & Hobbies",
        "Pets",
        "Entertainment & Leisure",
        "Travel & Tourism",
        "Education & Learning",
        "Professional Services",
        "Transportation & Delivery",
        "Events & Celebration",
        "Sports & Fitness",
        "Internet & Telecom",
        "Subscription & Membership",
        "Baby & Maternity",
        "Office & Business",
        "Hardware & Tools",
        "Luxury Goods",
        "Seasonal & Holiday Offers",
      ],
      rank: [
        "Bronze I",
        "Bronze II",
        "Bronze III",
        "Silver I",
        "Silver II",
        "Silver III",
        "Gold I",
        "Gold II",
        "Gold III",
        "Platinum I",
        "Platinum II",
        "Platinum III",
        "Diamond I",
        "Diamond II",
        "Diamond III",
      ],
      role: ["consumer", "merchant"],
    },
  },
} as const
