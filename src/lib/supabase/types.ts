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
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
