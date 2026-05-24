export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          timezone: string;
          couple_id: string | null;
          xp: number;
          coins: number;
          level: number;
          active_theme: string;
          onboarding_complete: boolean;
          push_subscription: Json | null;
          character_data: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          avatar_url?: string | null;
          timezone?: string;
          couple_id?: string | null;
          xp?: number;
          coins?: number;
          level?: number;
          active_theme?: string;
          onboarding_complete?: boolean;
          push_subscription?: Json | null;
          character_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          timezone?: string;
          couple_id?: string | null;
          xp?: number;
          coins?: number;
          level?: number;
          active_theme?: string;
          onboarding_complete?: boolean;
          push_subscription?: Json | null;
          character_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      couple_links: {
        Row: {
          id: string;
          user_a_id: string;
          user_b_id: string | null;
          invite_code: string;
          status: "pending" | "active" | "dissolved";
          couple_xp: number;
          couple_level: number;
          couple_streak: number;
          streak_last_date: string | null;
          created_at: string;
          linked_at: string | null;
        };
        Insert: {
          id?: string;
          user_a_id: string;
          user_b_id?: string | null;
          invite_code: string;
          status?: "pending" | "active" | "dissolved";
          couple_xp?: number;
          couple_level?: number;
          couple_streak?: number;
          streak_last_date?: string | null;
          created_at?: string;
          linked_at?: string | null;
        };
        Update: {
          id?: string;
          user_a_id?: string;
          user_b_id?: string | null;
          invite_code?: string;
          status?: "pending" | "active" | "dissolved";
          couple_xp?: number;
          couple_level?: number;
          couple_streak?: number;
          streak_last_date?: string | null;
          created_at?: string;
          linked_at?: string | null;
        };
        Relationships: [];
      };
      habits: {
        Row: {
          id: string;
          owner_id: string;
          couple_id: string | null;
          title: string;
          description: string | null;
          icon: string | null;
          color: string;
          frequency: "daily" | "weekdays" | "custom";
          frequency_days: number[] | null;
          is_shared: boolean;
          target_count: number;
          xp_reward: number;
          coin_reward: number;
          archived: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          couple_id?: string | null;
          title: string;
          description?: string | null;
          icon?: string | null;
          color?: string;
          frequency?: "daily" | "weekdays" | "custom";
          frequency_days?: number[] | null;
          is_shared?: boolean;
          target_count?: number;
          xp_reward?: number;
          coin_reward?: number;
          archived?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          couple_id?: string | null;
          title?: string;
          description?: string | null;
          icon?: string | null;
          color?: string;
          frequency?: "daily" | "weekdays" | "custom";
          frequency_days?: number[] | null;
          is_shared?: boolean;
          target_count?: number;
          xp_reward?: number;
          coin_reward?: number;
          archived?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      habit_completions: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          completed_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          completed_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          user_id?: string;
          completed_date?: string;
          completed_at?: string;
        };
        Relationships: [];
      };
      habit_streaks: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_completed: string | null;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_completed?: string | null;
        };
        Update: {
          id?: string;
          habit_id?: string;
          user_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_completed?: string | null;
        };
        Relationships: [];
      };
      focus_sessions: {
        Row: {
          id: string;
          user_id: string;
          couple_id: string | null;
          duration_mins: number;
          actual_mins: number | null;
          mode: "pomodoro" | "freeform";
          status: "active" | "completed" | "abandoned";
          plant_stage: number;
          xp_earned: number;
          coins_earned: number;
          started_at: string;
          ended_at: string | null;
          couple_session_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          couple_id?: string | null;
          duration_mins: number;
          actual_mins?: number | null;
          mode?: "pomodoro" | "freeform";
          status?: "active" | "completed" | "abandoned";
          plant_stage?: number;
          xp_earned?: number;
          coins_earned?: number;
          started_at?: string;
          ended_at?: string | null;
          couple_session_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          couple_id?: string | null;
          duration_mins?: number;
          actual_mins?: number | null;
          mode?: "pomodoro" | "freeform";
          status?: "active" | "completed" | "abandoned";
          plant_stage?: number;
          xp_earned?: number;
          coins_earned?: number;
          started_at?: string;
          ended_at?: string | null;
          couple_session_id?: string | null;
        };
        Relationships: [];
      };
      couple_focus_sessions: {
        Row: {
          id: string;
          couple_id: string;
          initiated_by: string;
          duration_mins: number;
          status: "waiting" | "active" | "completed";
          started_at: string | null;
          ended_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          initiated_by: string;
          duration_mins: number;
          status?: "waiting" | "active" | "completed";
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          couple_id?: string;
          initiated_by?: string;
          duration_mins?: number;
          status?: "waiting" | "active" | "completed";
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          couple_id: string;
          created_by: string;
          title: string;
          description: string | null;
          emoji: string | null;
          starts_at: string;
          ends_at: string | null;
          all_day: boolean;
          is_recurring: boolean;
          recurrence_rule: string | null;
          color: string;
          location: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          created_by: string;
          title: string;
          description?: string | null;
          emoji?: string | null;
          starts_at: string;
          ends_at?: string | null;
          all_day?: boolean;
          is_recurring?: boolean;
          recurrence_rule?: string | null;
          color?: string;
          location?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          couple_id?: string;
          created_by?: string;
          title?: string;
          description?: string | null;
          emoji?: string | null;
          starts_at?: string;
          ends_at?: string | null;
          all_day?: boolean;
          is_recurring?: boolean;
          recurrence_rule?: string | null;
          color?: string;
          location?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          event_id: string;
          remind_at: string;
          target_user_ids: string[];
          sent: boolean;
          sent_at: string | null;
        };
        Insert: {
          id?: string;
          event_id: string;
          remind_at: string;
          target_user_ids: string[];
          sent?: boolean;
          sent_at?: string | null;
        };
        Update: {
          id?: string;
          event_id?: string;
          remind_at?: string;
          target_user_ids?: string[];
          sent?: boolean;
          sent_at?: string | null;
        };
        Relationships: [];
      };
      xp_ledger: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          reason: string;
          source_id: string | null;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      coin_ledger: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          reason: string;
          source_id: string | null;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      unlockables: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          category: "theme" | "plant_skin" | "badge" | "reaction" | "couple_frame" | "sound" | "furniture";
          preview_url: string | null;
          coin_cost: number | null;
          xp_required: number;
          level_required: number;
          couple_only: boolean;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          category: "theme" | "plant_skin" | "badge" | "reaction" | "couple_frame" | "sound" | "furniture";
          preview_url?: string | null;
          coin_cost?: number | null;
          xp_required?: number;
          level_required?: number;
          couple_only?: boolean;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          category?: "theme" | "plant_skin" | "badge" | "reaction" | "couple_frame" | "sound";
          preview_url?: string | null;
          coin_cost?: number | null;
          xp_required?: number;
          level_required?: number;
          couple_only?: boolean;
          is_active?: boolean;
        };
        Relationships: [];
      };
      user_unlockables: {
        Row: {
          id: string;
          user_id: string;
          unlockable_id: string;
          unlocked_at: string;
          equipped: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          unlockable_id: string;
          unlocked_at?: string;
          equipped?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          unlockable_id?: string;
          unlocked_at?: string;
          equipped?: boolean;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          endpoint?: string;
          p256dh?: string;
          auth?: string;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          category: string;
          condition_value: number;
          xp_reward: number;
          coin_reward: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          category?: string;
          condition_value?: number;
          xp_reward?: number;
          coin_reward?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: { id?: string; slug?: string; name?: string; description?: string | null; category?: string; condition_value?: number; xp_reward?: number; coin_reward?: number; is_active?: boolean; };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: { id?: string; user_id: string; achievement_id: string; unlocked_at?: string; };
        Update: { id?: string; user_id?: string; achievement_id?: string; unlocked_at?: string; };
        Relationships: [];
      };
      daily_rewards: {
        Row: {
          id: string;
          user_id: string;
          reward_date: string;
          streak_day: number;
          xp_earned: number;
          coins_earned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reward_date: string;
          streak_day?: number;
          xp_earned?: number;
          coins_earned?: number;
          created_at?: string;
        };
        Update: { id?: string; user_id?: string; reward_date?: string; streak_day?: number; xp_earned?: number; coins_earned?: number; };
        Relationships: [];
      };
      couple_homes: {
        Row: {
          id: string;
          couple_id: string;
          background: string;
          created_at: string;
          updated_at: string;
        };
        Insert: { id?: string; couple_id: string; background?: string; created_at?: string; updated_at?: string; };
        Update: { id?: string; couple_id?: string; background?: string; updated_at?: string; };
        Relationships: [];
      };
      home_placements: {
        Row: {
          id: string;
          couple_id: string;
          item_slug: string;
          item_emoji: string;
          item_label: string;
          placed_by: string | null;
          grid_x: number;
          grid_y: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          item_slug: string;
          item_emoji: string;
          item_label: string;
          placed_by?: string | null;
          grid_x: number;
          grid_y: number;
          created_at?: string;
        };
        Update: { id?: string; couple_id?: string; item_slug?: string; item_emoji?: string; item_label?: string; placed_by?: string | null; grid_x?: number; grid_y?: number; };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      purchase_unlockable: {
        Args: { p_unlockable_id: string };
        Returns: Json;
      };
      award_xp_and_coins: {
        Args: { p_user_id: string; p_xp: number; p_coins: number; p_reason: string; p_source_id?: string };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
  };
}
