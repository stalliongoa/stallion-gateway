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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          published: boolean | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cctv_quotation_items: {
        Row: {
          category_type: string
          created_at: string
          display_order: number | null
          id: string
          notes: string | null
          product_id: string | null
          product_name: string
          product_sku: string | null
          quantity: number
          quotation_id: string
          specifications: Json | null
          total_price: number
          unit_price: number
        }
        Insert: {
          category_type: string
          created_at?: string
          display_order?: number | null
          id?: string
          notes?: string | null
          product_id?: string | null
          product_name: string
          product_sku?: string | null
          quantity?: number
          quotation_id: string
          specifications?: Json | null
          total_price: number
          unit_price: number
        }
        Update: {
          category_type?: string
          created_at?: string
          display_order?: number | null
          id?: string
          notes?: string | null
          product_id?: string | null
          product_name?: string
          product_sku?: string | null
          quantity?: number
          quotation_id?: string
          specifications?: Json | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "cctv_quotation_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cctv_quotation_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "cctv_quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      cctv_quotations: {
        Row: {
          approved_at: string | null
          cctv_system_type: string
          city: string
          created_at: string
          customer_email: string | null
          customer_mobile: string
          customer_name: string
          discount_amount: number | null
          discount_percentage: number | null
          engineer_id: string
          gst_number: string | null
          id: string
          installation_address: string
          notes: string | null
          quotation_number: string
          sent_at: string | null
          status: Database["public"]["Enums"]["quotation_status"]
          subtotal: number
          tax_amount: number | null
          terms_conditions: string | null
          total_amount: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          approved_at?: string | null
          cctv_system_type: string
          city: string
          created_at?: string
          customer_email?: string | null
          customer_mobile: string
          customer_name: string
          discount_amount?: number | null
          discount_percentage?: number | null
          engineer_id: string
          gst_number?: string | null
          id?: string
          installation_address: string
          notes?: string | null
          quotation_number: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["quotation_status"]
          subtotal?: number
          tax_amount?: number | null
          terms_conditions?: string | null
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          approved_at?: string | null
          cctv_system_type?: string
          city?: string
          created_at?: string
          customer_email?: string | null
          customer_mobile?: string
          customer_name?: string
          discount_amount?: number | null
          discount_percentage?: number | null
          engineer_id?: string
          gst_number?: string | null
          id?: string
          installation_address?: string
          notes?: string | null
          quotation_number?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["quotation_status"]
          subtotal?: number
          tax_amount?: number | null
          terms_conditions?: string | null
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      cctv_spec_definitions: {
        Row: {
          category_type: string
          created_at: string
          display_order: number | null
          field_type: string
          id: string
          is_filterable: boolean | null
          is_required: boolean | null
          options: Json | null
          spec_key: string
          spec_label: string
        }
        Insert: {
          category_type: string
          created_at?: string
          display_order?: number | null
          field_type?: string
          id?: string
          is_filterable?: boolean | null
          is_required?: boolean | null
          options?: Json | null
          spec_key: string
          spec_label: string
        }
        Update: {
          category_type?: string
          created_at?: string
          display_order?: number | null
          field_type?: string
          id?: string
          is_filterable?: boolean | null
          is_required?: boolean | null
          options?: Json | null
          spec_key?: string
          spec_label?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          company: string | null
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string | null
          name: string
          rating: number | null
          testimonial: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name: string
          rating?: number | null
          testimonial?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name?: string
          rating?: number | null
          testimonial?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          cover_letter: string | null
          created_at: string
          email: string
          id: string
          job_id: string | null
          name: string
          phone: string | null
          resume_url: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string
          email: string
          id?: string
          job_id?: string | null
          name: string
          phone?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          cover_letter?: string | null
          created_at?: string
          email?: string
          id?: string
          job_id?: string | null
          name?: string
          phone?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_openings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_openings: {
        Row: {
          created_at: string
          department: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          location: string | null
          requirements: string | null
          responsibilities: string | null
          salary_range: string | null
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          requirements?: string | null
          responsibilities?: string | null
          salary_range?: string | null
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          requirements?: string | null
          responsibilities?: string | null
          salary_range?: string | null
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      low_stock_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string
          current_stock: number
          id: string
          is_acknowledged: boolean | null
          minimum_level: number
          product_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string
          current_stock: number
          id?: string
          is_acknowledged?: boolean | null
          minimum_level: number
          product_id: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string
          current_stock?: number
          id?: string
          is_acknowledged?: boolean | null
          minimum_level?: number
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "low_stock_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
        ]
      }
      page_sections: {
        Row: {
          content: string | null
          created_at: string
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          metadata: Json | null
          page_name: string
          section_key: string
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          page_name: string
          section_key: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          page_name?: string
          section_key?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quotation_reservations: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          quotation_id: string
          released_at: string | null
          reserved_at: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          quotation_id: string
          released_at?: string | null
          reserved_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          quotation_id?: string
          released_at?: string | null
          reserved_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotation_reservations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_reservations_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "cctv_quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_brands: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      shop_cart: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          filter_config: Json | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          filter_config?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          filter_config?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "shop_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_customers: {
        Row: {
          billing_address: Json | null
          company_name: string | null
          created_at: string
          customer_type: string | null
          gst_number: string | null
          id: string
          notes: string | null
          phone: string | null
          shipping_address: Json | null
          status: Database["public"]["Enums"]["customer_status"] | null
          total_orders: number | null
          total_spent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address?: Json | null
          company_name?: string | null
          created_at?: string
          customer_type?: string | null
          gst_number?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["customer_status"] | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address?: Json | null
          company_name?: string | null
          created_at?: string
          customer_type?: string | null
          gst_number?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["customer_status"] | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shop_order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_sku: string | null
          quantity: number
          tax_amount: number | null
          tax_rate: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_sku?: string | null
          quantity: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_sku?: string | null
          quantity?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "shop_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "shop_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_orders: {
        Row: {
          admin_notes: string | null
          billing_address: Json | null
          created_at: string
          currency: string | null
          customer_id: string | null
          delivered_at: string | null
          discount_amount: number | null
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          payment_status: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          shipped_at: string | null
          shipping_address: Json | null
          shipping_amount: number | null
          status: string | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          billing_address?: Json | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          shipped_at?: string | null
          shipping_address?: Json | null
          shipping_amount?: number | null
          status?: string | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          billing_address?: Json | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          shipped_at?: string | null
          shipping_address?: Json | null
          shipping_amount?: number | null
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "shop_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_products: {
        Row: {
          barcode: string | null
          brand_id: string | null
          category_id: string | null
          cost_price: number | null
          created_at: string
          datasheet_url: string | null
          deleted_at: string | null
          description: string | null
          dimensions_cm: string | null
          hsn_code: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          last_purchase_price: number | null
          low_stock_threshold: number | null
          meta_description: string | null
          meta_title: string | null
          minimum_stock_level: number | null
          model_number: string | null
          mrp: number | null
          name: string
          purchase_price: number | null
          reorder_quantity: number | null
          reserved_stock: number | null
          selling_price: number | null
          shopify_product_id: string | null
          shopify_sync_enabled: boolean | null
          shopify_variant_id: string | null
          short_description: string | null
          sku: string | null
          slug: string
          specifications: Json | null
          stock_quantity: number | null
          tags: string[] | null
          tax_rate: number | null
          updated_at: string
          vendor_id: string | null
          warranty_months: number | null
          weight_kg: number | null
        }
        Insert: {
          barcode?: string | null
          brand_id?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          datasheet_url?: string | null
          deleted_at?: string | null
          description?: string | null
          dimensions_cm?: string | null
          hsn_code?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          last_purchase_price?: number | null
          low_stock_threshold?: number | null
          meta_description?: string | null
          meta_title?: string | null
          minimum_stock_level?: number | null
          model_number?: string | null
          mrp?: number | null
          name: string
          purchase_price?: number | null
          reorder_quantity?: number | null
          reserved_stock?: number | null
          selling_price?: number | null
          shopify_product_id?: string | null
          shopify_sync_enabled?: boolean | null
          shopify_variant_id?: string | null
          short_description?: string | null
          sku?: string | null
          slug: string
          specifications?: Json | null
          stock_quantity?: number | null
          tags?: string[] | null
          tax_rate?: number | null
          updated_at?: string
          vendor_id?: string | null
          warranty_months?: number | null
          weight_kg?: number | null
        }
        Update: {
          barcode?: string | null
          brand_id?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          datasheet_url?: string | null
          deleted_at?: string | null
          description?: string | null
          dimensions_cm?: string | null
          hsn_code?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          last_purchase_price?: number | null
          low_stock_threshold?: number | null
          meta_description?: string | null
          meta_title?: string | null
          minimum_stock_level?: number | null
          model_number?: string | null
          mrp?: number | null
          name?: string
          purchase_price?: number | null
          reorder_quantity?: number | null
          reserved_stock?: number | null
          selling_price?: number | null
          shopify_product_id?: string | null
          shopify_sync_enabled?: boolean | null
          shopify_variant_id?: string | null
          short_description?: string | null
          sku?: string | null
          slug?: string
          specifications?: Json | null
          stock_quantity?: number | null
          tags?: string[] | null
          tax_rate?: number | null
          updated_at?: string
          vendor_id?: string | null
          warranty_months?: number | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "shop_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "shop_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "shop_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_purchases: {
        Row: {
          created_at: string
          created_by: string | null
          gst_amount: number | null
          gst_rate: number | null
          id: string
          invoice_date: string | null
          invoice_number: string | null
          invoice_url: string | null
          notes: string | null
          payment_status: string | null
          product_id: string | null
          purchase_date: string | null
          purchase_number: string
          quantity: number
          total_cost: number
          unit_cost: number
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          gst_amount?: number | null
          gst_rate?: number | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          invoice_url?: string | null
          notes?: string | null
          payment_status?: string | null
          product_id?: string | null
          purchase_date?: string | null
          purchase_number: string
          quantity: number
          total_cost: number
          unit_cost: number
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          gst_amount?: number | null
          gst_rate?: number | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          invoice_url?: string | null
          notes?: string | null
          payment_status?: string | null
          product_id?: string | null
          purchase_date?: string | null
          purchase_number?: string
          quantity?: number
          total_cost?: number
          unit_cost?: number
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_purchases_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "shop_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_spec_definitions: {
        Row: {
          category_id: string | null
          created_at: string
          display_order: number | null
          field_type: string | null
          id: string
          is_filterable: boolean | null
          key: string
          label: string
          options: Json | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          display_order?: number | null
          field_type?: string | null
          id?: string
          is_filterable?: boolean | null
          key: string
          label: string
          options?: Json | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          display_order?: number | null
          field_type?: string | null
          id?: string
          is_filterable?: boolean | null
          key?: string
          label?: string
          options?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_spec_definitions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "shop_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_vendors: {
        Row: {
          address: string | null
          city: string | null
          contact_person: string | null
          country: string | null
          created_at: string
          email: string | null
          gst_number: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      shop_wishlist: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      stock_adjustments: {
        Row: {
          adjusted_by: string | null
          adjustment_type: string
          attachment_url: string | null
          created_at: string
          id: string
          notes: string | null
          product_id: string
          quantity: number
          reason: string
          warehouse_id: string | null
        }
        Insert: {
          adjusted_by?: string | null
          adjustment_type: string
          attachment_url?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          product_id: string
          quantity: number
          reason: string
          warehouse_id?: string | null
        }
        Update: {
          adjusted_by?: string | null
          adjustment_type?: string
          attachment_url?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          reason?: string
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_adjustments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_adjustments_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          action_type: string
          attachment_url: string | null
          created_at: string
          id: string
          notes: string | null
          product_id: string
          quantity_after: number
          quantity_before: number
          quantity_change: number
          reason: string | null
          reference_id: string | null
          reference_type: string | null
          user_id: string | null
          warehouse_id: string | null
        }
        Insert: {
          action_type: string
          attachment_url?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          product_id: string
          quantity_after: number
          quantity_before: number
          quantity_change: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          user_id?: string | null
          warehouse_id?: string | null
        }
        Update: {
          action_type?: string
          attachment_url?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          product_id?: string
          quantity_after?: number
          quantity_before?: number
          quantity_change?: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          user_id?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string | null
          display_order: number | null
          email: string | null
          id: string
          image_url: string | null
          name: string
          phone: string | null
          position: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          id?: string
          image_url?: string | null
          name: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          id?: string
          image_url?: string | null
          name?: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      warehouse_stock: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          reserved_quantity: number
          updated_at: string
          warehouse_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          reserved_quantity?: number
          updated_at?: string
          warehouse_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          reserved_quantity?: number
          updated_at?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_stock_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_stock_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          address: string | null
          city: string | null
          code: string
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          code: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          code?: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: { Args: never; Returns: string }
      generate_purchase_number: { Args: never; Returns: string }
      generate_quotation_number: { Args: never; Returns: string }
      generate_sku: {
        Args: { brand_slug: string; category_slug: string }
        Returns: string
      }
      get_public_team_members: {
        Args: never
        Returns: {
          bio: string
          created_at: string
          display_order: number
          id: string
          image_url: string
          member_name: string
          member_position: string
          updated_at: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_cctv_engineer: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user" | "cctv_engineer" | "inventory_manager"
      customer_status: "pending" | "approved" | "blocked"
      quotation_status: "draft" | "sent" | "approved" | "rejected" | "converted"
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
      app_role: ["admin", "user", "cctv_engineer", "inventory_manager"],
      customer_status: ["pending", "approved", "blocked"],
      quotation_status: ["draft", "sent", "approved", "rejected", "converted"],
    },
  },
} as const
