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
          createdAt: string
          description: string
          id: number
          name: string
          points: number
        }
        Insert: {
          createdAt?: string
          description?: string
          id?: number
          name: string
          points?: number
        }
        Update: {
          createdAt?: string
          description?: string
          id?: number
          name?: string
          points?: number
        }
        Relationships: []
      }
      consumers: {
        Row: {
          createdAt: string
          email: string
          id: string
          interests: string[] | null
          name: string
          pointsBalance: number
          pointsTotal: number
          purchased: boolean
          rank: number
          referralCode: string
          referrerCode: string | null
        }
        Insert: {
          createdAt?: string
          email: string
          id: string
          interests?: string[] | null
          name: string
          pointsBalance?: number
          pointsTotal?: number
          purchased?: boolean
          rank?: number
          referralCode: string
          referrerCode?: string | null
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          interests?: string[] | null
          name?: string
          pointsBalance?: number
          pointsTotal?: number
          purchased?: boolean
          rank?: number
          referralCode?: string
          referrerCode?: string | null
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
          createdAt: string
          description: string
          id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["coupon_category"]
          createdAt?: string
          description?: string
          id?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["coupon_category"]
          createdAt?: string
          description?: string
          id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          accentColor: Database["public"]["Enums"]["color"]
          allowLimitedPurchase: boolean
          allowPointsPurchase: boolean
          allowRepeatPurchase: boolean
          category: Database["public"]["Enums"]["coupon_category"]
          createdAt: string
          description: string
          embedding: string | null
          id: string
          image: string
          isDeactivated: boolean
          merchantId: string
          pointsAmount: number | null
          price: number
          quantity: number
          rankAvailability: number
          text_search: unknown | null
          title: string
          validFrom: string
          validTo: string
        }
        Insert: {
          accentColor?: Database["public"]["Enums"]["color"]
          allowLimitedPurchase?: boolean
          allowPointsPurchase?: boolean
          allowRepeatPurchase?: boolean
          category?: Database["public"]["Enums"]["coupon_category"]
          createdAt?: string
          description: string
          embedding?: string | null
          id?: string
          image: string
          isDeactivated?: boolean
          merchantId: string
          pointsAmount?: number | null
          price: number
          quantity: number
          rankAvailability?: number
          text_search?: unknown | null
          title?: string
          validFrom?: string
          validTo: string
        }
        Update: {
          accentColor?: Database["public"]["Enums"]["color"]
          allowLimitedPurchase?: boolean
          allowPointsPurchase?: boolean
          allowRepeatPurchase?: boolean
          category?: Database["public"]["Enums"]["coupon_category"]
          createdAt?: string
          description?: string
          embedding?: string | null
          id?: string
          image?: string
          isDeactivated?: boolean
          merchantId?: string
          pointsAmount?: number | null
          price?: number
          quantity?: number
          rankAvailability?: number
          text_search?: unknown | null
          title?: string
          validFrom?: string
          validTo?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupons_merchantId_fkey"
            columns: ["merchantId"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_rankAvailability_fkey"
            columns: ["rankAvailability"]
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
          createdAt: string
          email: string
          embedding: string | null
          id: string
          logo: string
          name: string
          text_search: unknown | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          createdAt?: string
          email: string
          embedding?: string | null
          id: string
          logo: string
          name: string
          text_search?: unknown | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          createdAt?: string
          email?: string
          embedding?: string | null
          id?: string
          logo?: string
          name?: string
          text_search?: unknown | null
        }
        Relationships: []
      }
      ranks: {
        Row: {
          createdAt: string
          icon: string
          id: number
          maxPoints: number
          primaryColor: string
          rank: Database["public"]["Enums"]["rank"]
          secondaryColor: string
        }
        Insert: {
          createdAt?: string
          icon?: string
          id?: number
          maxPoints: number
          primaryColor?: string
          rank?: Database["public"]["Enums"]["rank"]
          secondaryColor?: string
        }
        Update: {
          createdAt?: string
          icon?: string
          id?: number
          maxPoints?: number
          primaryColor?: string
          rank?: Database["public"]["Enums"]["rank"]
          secondaryColor?: string
        }
        Relationships: []
      }
      search_documents: {
        Row: {
          content: string | null
          created_at: string | null
          embedding: string | null
          id: string
          reference_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          reference_id: string
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          reference_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_coupons: {
        Row: {
          consumerId: string
          couponId: string
          createdAt: string
          id: number
        }
        Insert: {
          consumerId: string
          couponId: string
          createdAt?: string
          id?: number
        }
        Update: {
          consumerId?: string
          couponId?: string
          createdAt?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_coupons_consumerId_fkey"
            columns: ["consumerId"]
            isOneToOne: false
            referencedRelation: "consumers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_coupons_couponId_fkey"
            columns: ["couponId"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deactivate_expired_coupons: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      hybrid_search: {
        Args: {
          query_text: string
          query_embedding: string
          match_threshold: number
        }
        Returns: {
          id: string
          type: string
          title: string
          description: string
          similarity: number
          rank: number
        }[]
      }
      search_similar_documents: {
        Args: {
          query_embedding: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          type: string
          reference_id: string
          content: string
          similarity: number
        }[]
      }
      semantic_search: {
        Args: { query_embedding: string; match_threshold: number }
        Returns: {
          id: string
          type: string
          title: string
          description: string
          name: string
          bio: string
          address: string
          similarity: number
        }[]
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
