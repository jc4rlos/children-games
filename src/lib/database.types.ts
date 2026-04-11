export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      branch: {
        Row: {
          address: string
          created_at: string
          created_by: string
          deleted_at: string | null
          email: string | null
          id: number
          is_active: boolean
          name: string
          phone: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          email?: string | null
          id?: number
          is_active?: boolean
          name: string
          phone?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          email?: string | null
          id?: number
          is_active?: boolean
          name?: string
          phone?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      child: {
        Row: {
          avatar: string | null
          birth_date: string
          branch_id: number
          code: string
          created_at: string
          created_by: string
          deleted_at: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender"]
          guardian_id: number
          id: number
          is_active: boolean
          notes: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          avatar?: string | null
          birth_date: string
          branch_id: number
          code: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender"]
          guardian_id: number
          id?: number
          is_active?: boolean
          notes?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          avatar?: string | null
          birth_date?: string
          branch_id?: number
          code?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["gender"]
          guardian_id?: number
          id?: number
          is_active?: boolean
          notes?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "child_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardian"
            referencedColumns: ["id"]
          },
        ]
      }
      class_attendance: {
        Row: {
          attended: boolean
          class_date: string
          created_at: string
          enrollment_id: number
          id: number
          noted_by: number | null
        }
        Insert: {
          attended?: boolean
          class_date: string
          created_at?: string
          enrollment_id: number
          id?: number
          noted_by?: number | null
        }
        Update: {
          attended?: boolean
          class_date?: string
          created_at?: string
          enrollment_id?: number
          id?: number
          noted_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "class_attendance_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "class_enrollment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_attendance_noted_by_fkey"
            columns: ["noted_by"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["id"]
          },
        ]
      }
      class_enrollment: {
        Row: {
          child_id: number
          class_id: number
          enrolled_at: string
          enrolled_by: number | null
          id: number
          is_active: boolean
        }
        Insert: {
          child_id: number
          class_id: number
          enrolled_at?: string
          enrolled_by?: number | null
          id?: number
          is_active?: boolean
        }
        Update: {
          child_id?: number
          class_id?: number
          enrolled_at?: string
          enrolled_by?: number | null
          id?: number
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "class_enrollment_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_enrollment_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "stimulation_class"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_enrollment_enrolled_by_fkey"
            columns: ["enrolled_by"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon: {
        Row: {
          branch_id: number | null
          code: string
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          id: number
          is_active: boolean
          max_uses: number | null
          updated_at: string | null
          updated_by: string | null
          uses_count: number
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          branch_id?: number | null
          code: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description?: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          id?: number
          is_active?: boolean
          max_uses?: number | null
          updated_at?: string | null
          updated_by?: string | null
          uses_count?: number
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          branch_id?: number | null
          code?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          id?: number
          is_active?: boolean
          max_uses?: number | null
          updated_at?: string | null
          updated_by?: string | null
          uses_count?: number
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["id"]
          },
        ]
      }
      employee: {
        Row: {
          auth_user_id: string | null
          branch_id: number
          created_at: string
          created_by: string
          deleted_at: string | null
          document_number: string
          email: string | null
          first_name: string
          hire_date: string
          id: number
          is_active: boolean
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["employee_role"]
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          auth_user_id?: string | null
          branch_id: number
          created_at?: string
          created_by: string
          deleted_at?: string | null
          document_number: string
          email?: string | null
          first_name: string
          hire_date: string
          id?: number
          is_active?: boolean
          last_name: string
          phone?: string | null
          role: Database["public"]["Enums"]["employee_role"]
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          auth_user_id?: string | null
          branch_id?: number
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          document_number?: string
          email?: string | null
          first_name?: string
          hire_date?: string
          id?: number
          is_active?: boolean
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["employee_role"]
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["id"]
          },
        ]
      }
      guardian: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          document_number: string
          email: string | null
          full_name: string
          id: number
          phone: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          document_number: string
          email?: string | null
          full_name: string
          id?: number
          phone?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          document_number?: string
          email?: string | null
          full_name?: string
          id?: number
          phone?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      loyalty_card: {
        Row: {
          child_id: number
          free_sessions: number
          id: number
          stamps_count: number
          stamps_required: number
          total_earned: number
          updated_at: string | null
        }
        Insert: {
          child_id: number
          free_sessions?: number
          id?: number
          stamps_count?: number
          stamps_required?: number
          total_earned?: number
          updated_at?: string | null
        }
        Update: {
          child_id?: number
          free_sessions?: number
          id?: number
          stamps_count?: number
          stamps_required?: number
          total_earned?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_card_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: true
            referencedRelation: "child"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_stamp: {
        Row: {
          id: number
          loyalty_card_id: number
          note: string | null
          play_session_id: number | null
          stamped_at: string
        }
        Insert: {
          id?: number
          loyalty_card_id: number
          note?: string | null
          play_session_id?: number | null
          stamped_at?: string
        }
        Update: {
          id?: number
          loyalty_card_id?: number
          note?: string | null
          play_session_id?: number | null
          stamped_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_stamp_session"
            columns: ["play_session_id"]
            isOneToOne: false
            referencedRelation: "play_session"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_stamp_loyalty_card_id_fkey"
            columns: ["loyalty_card_id"]
            isOneToOne: false
            referencedRelation: "loyalty_card"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item: {
        Row: {
          created_at: string
          created_by: string
          icon: string | null
          id: number
          is_active: boolean
          label: string
          parent_id: number | null
          path: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          icon?: string | null
          id?: number
          is_active?: boolean
          label: string
          parent_id?: number | null
          path: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          icon?: string | null
          id?: number
          is_active?: boolean
          label?: string
          parent_id?: number | null
          path?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_item"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_role_permission: {
        Row: {
          enabled: boolean
          id: number
          menu_item_id: number
          role: Database["public"]["Enums"]["employee_role"]
        }
        Insert: {
          enabled?: boolean
          id?: number
          menu_item_id: number
          role: Database["public"]["Enums"]["employee_role"]
        }
        Update: {
          enabled?: boolean
          id?: number
          menu_item_id?: number
          role?: Database["public"]["Enums"]["employee_role"]
        }
        Relationships: [
          {
            foreignKeyName: "menu_role_permission_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_item"
            referencedColumns: ["id"]
          },
        ]
      }
      play_session: {
        Row: {
          branch_id: number
          check_in: string
          check_out: string | null
          child_id: number
          closed_by: number | null
          coupon_id: number | null
          created_at: string
          created_by: string
          deleted_at: string | null
          discount_amount: number | null
          id: number
          is_free_session: boolean
          minutes_played: number | null
          notes: string | null
          play_subtotal: number | null
          pricing_id: number
          products_subtotal: number | null
          registered_by: number
          scheduled_checkout: string | null
          status: Database["public"]["Enums"]["session_status"]
          total_amount: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          branch_id: number
          check_in?: string
          check_out?: string | null
          child_id: number
          closed_by?: number | null
          coupon_id?: number | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          discount_amount?: number | null
          id?: number
          is_free_session?: boolean
          minutes_played?: number | null
          notes?: string | null
          play_subtotal?: number | null
          pricing_id: number
          products_subtotal?: number | null
          registered_by: number
          scheduled_checkout?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          total_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          branch_id?: number
          check_in?: string
          check_out?: string | null
          child_id?: number
          closed_by?: number | null
          coupon_id?: number | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          discount_amount?: number | null
          id?: number
          is_free_session?: boolean
          minutes_played?: number | null
          notes?: string | null
          play_subtotal?: number | null
          pricing_id?: number
          products_subtotal?: number | null
          registered_by?: number
          scheduled_checkout?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          total_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "play_session_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "play_session_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "play_session_closed_by_fkey"
            columns: ["closed_by"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "play_session_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupon"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "play_session_pricing_id_fkey"
            columns: ["pricing_id"]
            isOneToOne: false
            referencedRelation: "pricing_config"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "play_session_registered_by_fkey"
            columns: ["registered_by"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_config: {
        Row: {
          branch_id: number
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string | null
          id: number
          minimum_charge: number
          price_per_hour: number
          updated_at: string | null
          updated_by: string | null
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          branch_id: number
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          minimum_charge?: number
          price_per_hour: number
          updated_at?: string | null
          updated_by?: string | null
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          branch_id?: number
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          minimum_charge?: number
          price_per_hour?: number
          updated_at?: string | null
          updated_by?: string | null
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_config_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["id"]
          },
        ]
      }
      product: {
        Row: {
          branch_id: number | null
          category_id: number
          created_at: string
          created_by: string
          id: number
          image_url: string | null
          is_active: boolean
          name: string
          price: number
          stock: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          branch_id?: number | null
          category_id: number
          created_at?: string
          created_by?: string
          id?: number
          image_url?: string | null
          is_active?: boolean
          name: string
          price: number
          stock?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          branch_id?: number | null
          category_id?: number
          created_at?: string
          created_by?: string
          id?: number
          image_url?: string | null
          is_active?: boolean
          name?: string
          price?: number
          stock?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_category"
            referencedColumns: ["id"]
          },
        ]
      }
      product_category: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          id: number
          is_active: boolean
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          id?: number
          is_active?: boolean
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          id?: number
          is_active?: boolean
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      session_consumption: {
        Row: {
          added_at: string
          added_by: number | null
          id: number
          play_session_id: number
          product_id: number
          quantity: number
          subtotal: number | null
          unit_price: number
        }
        Insert: {
          added_at?: string
          added_by?: number | null
          id?: number
          play_session_id: number
          product_id: number
          quantity?: number
          subtotal?: number | null
          unit_price: number
        }
        Update: {
          added_at?: string
          added_by?: number | null
          id?: number
          play_session_id?: number
          product_id?: number
          quantity?: number
          subtotal?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_consumption_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_consumption_play_session_id_fkey"
            columns: ["play_session_id"]
            isOneToOne: false
            referencedRelation: "play_session"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_consumption_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      stimulation_class: {
        Row: {
          age_max_months: number
          age_min_months: number
          branch_id: number
          capacity: number
          created_at: string
          created_by: string
          day_of_week: Database["public"]["Enums"]["class_day"][]
          deleted_at: string | null
          description: string | null
          end_time: string
          id: number
          is_active: boolean
          name: string
          price: number
          start_time: string
          teacher_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          age_max_months?: number
          age_min_months?: number
          branch_id: number
          capacity?: number
          created_at?: string
          created_by: string
          day_of_week: Database["public"]["Enums"]["class_day"][]
          deleted_at?: string | null
          description?: string | null
          end_time: string
          id?: number
          is_active?: boolean
          name: string
          price?: number
          start_time: string
          teacher_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          age_max_months?: number
          age_min_months?: number
          branch_id?: number
          capacity?: number
          created_at?: string
          created_by?: string
          day_of_week?: Database["public"]["Enums"]["class_day"][]
          deleted_at?: string | null
          description?: string | null
          end_time?: string
          id?: number
          is_active?: boolean
          name?: string
          price?: number
          start_time?: string
          teacher_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stimulation_class_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stimulation_class_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      class_day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"
      discount_type: "PERCENTAGE" | "FIXED_AMOUNT"
      employee_role: "ADMIN" | "SUPERVISOR" | "RECEPTIONIST" | "TEACHER"
      gender: "MALE" | "FEMALE"
      session_status: "ACTIVE" | "CLOSED" | "FREE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      class_day: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
      discount_type: ["PERCENTAGE", "FIXED_AMOUNT"],
      employee_role: ["ADMIN", "SUPERVISOR", "RECEPTIONIST", "TEACHER"],
      gender: ["MALE", "FEMALE"],
      session_status: ["ACTIVE", "CLOSED", "FREE"],
    },
  },
} as const
