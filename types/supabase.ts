export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      provinces: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      cities: {
        Row: {
          id: string
          name: string
          slug: string
          province_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          province_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          province_id?: string
          created_at?: string
        }
      }
    }
  }
}

