export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type DifficultyLevel = 'easy' | 'intermediate' | 'advanced' | 'drop'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          profile_pic: string | null
          join_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          profile_pic?: string | null
          join_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          profile_pic?: string | null
          join_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      tutorials: {
        Row: {
          id: string
          title: string
          video_url: string
          thumbnail_url: string | null
          difficulty: DifficultyLevel
          collection: string | null
          duration_minutes: number | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          video_url: string
          thumbnail_url?: string | null
          difficulty: DifficultyLevel
          collection?: string | null
          duration_minutes?: number | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          video_url?: string
          thumbnail_url?: string | null
          difficulty?: DifficultyLevel
          collection?: string | null
          duration_minutes?: number | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          content: string
          media_url: string | null
          media_type: 'image' | 'video' | null
          likes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          content: string
          media_url?: string | null
          media_type?: 'image' | 'video' | null
          likes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          content?: string
          media_url?: string | null
          media_type?: 'image' | 'video' | null
          likes?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string | null
          tutorial_id: string | null
          author_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id?: string | null
          tutorial_id?: string | null
          author_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string | null
          tutorial_id?: string | null
          author_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string
          total_minutes: number
          videos_completed: number
          days_practiced: number
          current_streak: number
          longest_streak: number
          total_points: number
          last_practice_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_minutes?: number
          videos_completed?: number
          days_practiced?: number
          current_streak?: number
          longest_streak?: number
          total_points?: number
          last_practice_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_minutes?: number
          videos_completed?: number
          days_practiced?: number
          current_streak?: number
          longest_streak?: number
          total_points?: number
          last_practice_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      progress_photos: {
        Row: {
          id: string
          user_id: string
          day_0: string | null
          month_1: string | null
          month_3: string | null
          month_6: string | null
          year_1: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          day_0?: string | null
          month_1?: string | null
          month_3?: string | null
          month_6?: string | null
          year_1?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          day_0?: string | null
          month_1?: string | null
          month_3?: string | null
          month_6?: string | null
          year_1?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          tutorial_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tutorial_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tutorial_id?: string
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          badge_name: string
          badge_description: string
          earned_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_name: string
          badge_description: string
          earned_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_name?: string
          badge_description?: string
          earned_at?: string
          created_at?: string
        }
      }
      daily_trick: {
        Row: {
          id: string
          tutorial_id: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          tutorial_id: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          tutorial_id?: string
          date?: string
          created_at?: string
        }
      }
      post_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}

