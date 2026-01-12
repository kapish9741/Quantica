export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          name: string
          game: string
          date: string
          status: 'upcoming' | 'ongoing' | 'completed'
          slug: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          game: string
          date: string
          status?: 'upcoming' | 'ongoing' | 'completed'
          slug: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          game?: string
          date?: string
          status?: 'upcoming' | 'ongoing' | 'completed'
          slug?: string
          created_at?: string | null
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          event_id: string
          total_points: number | null
          total_kills: number | null
          wins: number | null
          rank: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          event_id: string
          total_points?: number | null
          total_kills?: number | null
          wins?: number | null
          rank?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          event_id?: string
          total_points?: number | null
          total_kills?: number | null
          wins?: number | null
          rank?: number | null
          created_at?: string | null
        }
      }
      participants: {
        Row: {
          id: string
          name: string
          team_id: string
          role: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          team_id: string
          role?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          team_id?: string
          role?: string | null
          created_at?: string | null
        }
      }
      matches: {
        Row: {
          id: string
          event_id: string
          match_number: number
          status: 'scheduled' | 'live' | 'completed'
          scheduled_date: string
          created_at: string | null
        }
        Insert: {
          id?: string
          event_id: string
          match_number: number
          status?: 'scheduled' | 'live' | 'completed'
          scheduled_date: string
          created_at?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          match_number?: number
          status?: 'scheduled' | 'live' | 'completed'
          scheduled_date?: string
          created_at?: string | null
        }
      }
      match_scores: {
        Row: {
          id: string
          match_id: string
          team_id: string
          placement: number
          kills: number | null
          points: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          match_id: string
          team_id: string
          placement: number
          kills?: number | null
          points?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          match_id?: string
          team_id?: string
          placement?: number
          kills?: number | null
          points?: number | null
          created_at?: string | null
        }
      }
      points_schemes: {
        Row: {
          id: string
          event_id: string
          kill_points: number | null
          placement_points: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          event_id: string
          kill_points?: number | null
          placement_points?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          kill_points?: number | null
          placement_points?: Json | null
          created_at?: string | null
        }
      }
      roadmap_items: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          status: 'upcoming' | 'ongoing' | 'completed'
          event_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          status?: 'upcoming' | 'ongoing' | 'completed'
          event_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          status?: 'upcoming' | 'ongoing' | 'completed'
          event_id?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
