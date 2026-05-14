export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          updated_at: string
          marketing_consent: boolean
          marketing_consent_at: string | null
          marketing_consent_source: string | null
          marketing_consent_text: string | null
          marketing_unsubscribed: boolean
          marketing_unsubscribed_at: string | null
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          created_at?: string
          updated_at?: string
          marketing_consent?: boolean
          marketing_consent_at?: string | null
          marketing_consent_source?: string | null
          marketing_consent_text?: string | null
          marketing_unsubscribed?: boolean
          marketing_unsubscribed_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          updated_at?: string
          marketing_consent?: boolean
          marketing_consent_at?: string | null
          marketing_consent_source?: string | null
          marketing_consent_text?: string | null
          marketing_unsubscribed?: boolean
          marketing_unsubscribed_at?: string | null
        }
        Relationships: []
      }
      quiz_sessions: {
        Row: {
          id: string
          user_id: string | null
          anon_token: string | null
          answers: Json
          result: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          anon_token?: string | null
          answers: Json
          result: Json
          created_at?: string
        }
        Update: {
          user_id?: string | null
          anon_token?: string | null
          answers?: Json
          result?: Json
        }
        Relationships: []
      }
      saved_zones: {
        Row: {
          id: string
          user_id: string
          zone_slug: string
          zone_kind: string
          zone_name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          zone_slug: string
          zone_kind: string
          zone_name: string
          created_at?: string
        }
        Update: {
          zone_slug?: string
          zone_kind?: string
          zone_name?: string
        }
        Relationships: []
      }
      user_quiz: {
        Row: {
          user_id:    string
          answers:    Json
          result:     Json
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id:     string
          answers:     Json
          result:      Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          answers?:    Json
          result?:     Json
          updated_at?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          email?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          owner_id: string
          title: string
          slug: string | null
          status: 'draft' | 'active' | 'reserved' | 'sold'
          location: string
          municipality: string
          zone_slug: string | null
          price: number
          price_per_sqm: number | null
          property_type: 'apartamento' | 'moradia' | 'terreno' | 'comercial' | 'garagem'
          typology: 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5+' | null
          sqm: number | null
          bedrooms: number
          bathrooms: number
          parking_spots: number
          floor: number | null
          total_floors: number | null
          year_built: number | null
          condition: 'novo' | 'usado' | 'para_recuperar' | 'em_construcao' | null
          energy_rating: 'A+' | 'A' | 'B' | 'B-' | 'C' | 'D' | 'E' | 'F' | 'Isento' | null
          has_elevator: boolean
          has_garden: boolean
          has_pool: boolean
          has_terrace: boolean
          has_storage: boolean
          orientation: 'norte' | 'sul' | 'este' | 'oeste' | 'nascente' | 'poente' | 'multiple' | null
          condominium_fee: number | null
          description: string | null
          highlights: string[]
          tags: string[]
          images: string[]
          is_featured: boolean
          latitude: number | null
          longitude: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          owner_id: string
          title: string
          slug?: string | null
          status?: 'draft' | 'active' | 'reserved' | 'sold'
          location: string
          municipality: string
          zone_slug?: string | null
          price: number
          price_per_sqm?: number | null
          property_type: 'apartamento' | 'moradia' | 'terreno' | 'comercial' | 'garagem'
          typology?: 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5+' | null
          sqm?: number | null
          bedrooms?: number
          bathrooms?: number
          parking_spots?: number
          floor?: number | null
          total_floors?: number | null
          year_built?: number | null
          condition?: 'novo' | 'usado' | 'para_recuperar' | 'em_construcao' | null
          energy_rating?: 'A+' | 'A' | 'B' | 'B-' | 'C' | 'D' | 'E' | 'F' | 'Isento' | null
          has_elevator?: boolean
          has_garden?: boolean
          has_pool?: boolean
          has_terrace?: boolean
          has_storage?: boolean
          orientation?: 'norte' | 'sul' | 'este' | 'oeste' | 'nascente' | 'poente' | 'multiple' | null
          condominium_fee?: number | null
          description?: string | null
          highlights?: string[]
          tags?: string[]
          images?: string[]
          is_featured?: boolean
          latitude?: number | null
          longitude?: number | null
        }
        Update: {
          updated_at?: string
          title?: string
          slug?: string | null
          status?: 'draft' | 'active' | 'reserved' | 'sold'
          location?: string
          municipality?: string
          zone_slug?: string | null
          price?: number
          price_per_sqm?: number | null
          property_type?: 'apartamento' | 'moradia' | 'terreno' | 'comercial' | 'garagem'
          typology?: 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5+' | null
          sqm?: number | null
          bedrooms?: number
          bathrooms?: number
          parking_spots?: number
          floor?: number | null
          total_floors?: number | null
          year_built?: number | null
          condition?: 'novo' | 'usado' | 'para_recuperar' | 'em_construcao' | null
          energy_rating?: 'A+' | 'A' | 'B' | 'B-' | 'C' | 'D' | 'E' | 'F' | 'Isento' | null
          has_elevator?: boolean
          has_garden?: boolean
          has_pool?: boolean
          has_terrace?: boolean
          has_storage?: boolean
          orientation?: 'norte' | 'sul' | 'este' | 'oeste' | 'nascente' | 'poente' | 'multiple' | null
          condominium_fee?: number | null
          description?: string | null
          highlights?: string[]
          tags?: string[]
          images?: string[]
          is_featured?: boolean
          latitude?: number | null
          longitude?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'properties_owner_id_fkey'
            columns: ['owner_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
