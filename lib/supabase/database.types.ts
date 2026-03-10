export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type PublicTable<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      announcements: PublicTable<
        {
          id: string;
          program_id: string | null;
          cohort_id: string | null;
          title: string;
          body: string;
          published_at: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          program_id?: string | null;
          cohort_id?: string | null;
          title: string;
          body: string;
          published_at?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          program_id?: string | null;
          cohort_id?: string | null;
          title?: string;
          body?: string;
          published_at?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        }
      >;
      cohort_memberships: PublicTable<
        {
          id: string;
          cohort_id: string;
          profile_id: string;
          member_program_id: string | null;
          joined_at: string;
          left_at: string | null;
        },
        {
          id?: string;
          cohort_id: string;
          profile_id: string;
          member_program_id?: string | null;
          joined_at?: string;
          left_at?: string | null;
        },
        {
          id?: string;
          cohort_id?: string;
          profile_id?: string;
          member_program_id?: string | null;
          joined_at?: string;
          left_at?: string | null;
        }
      >;
      cohorts: PublicTable<
        {
          id: string;
          program_id: string;
          name: string;
          slug: string;
          starts_on: string;
          ends_on: string | null;
          enrollment_opens_at: string | null;
          enrollment_closes_at: string | null;
          status: string;
          external_community_url: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          program_id: string;
          name: string;
          slug: string;
          starts_on: string;
          ends_on?: string | null;
          enrollment_opens_at?: string | null;
          enrollment_closes_at?: string | null;
          status?: string;
          external_community_url?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          program_id?: string;
          name?: string;
          slug?: string;
          starts_on?: string;
          ends_on?: string | null;
          enrollment_opens_at?: string | null;
          enrollment_closes_at?: string | null;
          status?: string;
          external_community_url?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      daily_checkins: PublicTable<
        {
          id: string;
          member_program_id: string;
          checkin_date: string;
          status: Database["public"]["Enums"]["review_status"];
          summary: string | null;
          wins: Json;
          misses: Json;
          lessons: Json;
          submitted_at: string | null;
          locked_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          member_program_id: string;
          checkin_date: string;
          status?: Database["public"]["Enums"]["review_status"];
          summary?: string | null;
          wins?: Json;
          misses?: Json;
          lessons?: Json;
          submitted_at?: string | null;
          locked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          member_program_id?: string;
          checkin_date?: string;
          status?: Database["public"]["Enums"]["review_status"];
          summary?: string | null;
          wins?: Json;
          misses?: Json;
          lessons?: Json;
          submitted_at?: string | null;
          locked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      daily_task_templates: PublicTable<
        {
          id: string;
          program_id: string;
          level_id: string;
          program_week_id: string | null;
          day_offset: number | null;
          title: string;
          description: string | null;
          sort_order: number;
          is_required: boolean;
          proof_required: boolean;
          proof_type_hint: Database["public"]["Enums"]["proof_type"] | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          program_id: string;
          level_id: string;
          program_week_id?: string | null;
          day_offset?: number | null;
          title: string;
          description?: string | null;
          sort_order?: number;
          is_required?: boolean;
          proof_required?: boolean;
          proof_type_hint?: Database["public"]["Enums"]["proof_type"] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          program_id?: string;
          level_id?: string;
          program_week_id?: string | null;
          day_offset?: number | null;
          title?: string;
          description?: string | null;
          sort_order?: number;
          is_required?: boolean;
          proof_required?: boolean;
          proof_type_hint?: Database["public"]["Enums"]["proof_type"] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      entitlements: PublicTable<
        {
          id: string;
          profile_id: string;
          member_program_id: string | null;
          source: string;
          access_granted: boolean;
          starts_at: string | null;
          ends_at: string | null;
          revoked_at: string | null;
          reason: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          profile_id: string;
          member_program_id?: string | null;
          source: string;
          access_granted?: boolean;
          starts_at?: string | null;
          ends_at?: string | null;
          revoked_at?: string | null;
          reason?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          profile_id?: string;
          member_program_id?: string | null;
          source?: string;
          access_granted?: boolean;
          starts_at?: string | null;
          ends_at?: string | null;
          revoked_at?: string | null;
          reason?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      founder_updates: PublicTable<
        {
          id: string;
          profile_id: string;
          title: string;
          summary: string | null;
          body: string;
          visibility: Database["public"]["Enums"]["proof_visibility"];
          x_post_url: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          profile_id: string;
          title: string;
          summary?: string | null;
          body: string;
          visibility?: Database["public"]["Enums"]["proof_visibility"];
          x_post_url?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          profile_id?: string;
          title?: string;
          summary?: string | null;
          body?: string;
          visibility?: Database["public"]["Enums"]["proof_visibility"];
          x_post_url?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      level_progress: PublicTable<
        {
          id: string;
          member_program_id: string;
          level_id: string;
          decision_source: Database["public"]["Enums"]["progress_decision_source"];
          eligible: boolean;
          evaluation_started_on: string;
          evaluation_ended_on: string;
          metrics_snapshot: Json;
          decision_reason: string | null;
          decided_by: string | null;
          unlocked_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          member_program_id: string;
          level_id: string;
          decision_source: Database["public"]["Enums"]["progress_decision_source"];
          eligible?: boolean;
          evaluation_started_on: string;
          evaluation_ended_on: string;
          metrics_snapshot?: Json;
          decision_reason?: string | null;
          decided_by?: string | null;
          unlocked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          member_program_id?: string;
          level_id?: string;
          decision_source?: Database["public"]["Enums"]["progress_decision_source"];
          eligible?: boolean;
          evaluation_started_on?: string;
          evaluation_ended_on?: string;
          metrics_snapshot?: Json;
          decision_reason?: string | null;
          decided_by?: string | null;
          unlocked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      level_unlock_rules: PublicTable<
        {
          id: string;
          level_id: string;
          minimum_completed_days: number;
          minimum_weekly_reviews_submitted: number;
          monthly_review_required: boolean;
          maximum_missed_days: number | null;
          minimum_proof_items: number;
          requires_founder_approval: boolean;
          grace_days: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          level_id: string;
          minimum_completed_days?: number;
          minimum_weekly_reviews_submitted?: number;
          monthly_review_required?: boolean;
          maximum_missed_days?: number | null;
          minimum_proof_items?: number;
          requires_founder_approval?: boolean;
          grace_days?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          level_id?: string;
          minimum_completed_days?: number;
          minimum_weekly_reviews_submitted?: number;
          monthly_review_required?: boolean;
          maximum_missed_days?: number | null;
          minimum_proof_items?: number;
          requires_founder_approval?: boolean;
          grace_days?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      levels: PublicTable<
        {
          id: string;
          program_id: string;
          position: number;
          slug: string;
          title: string;
          tagline: string | null;
          start_day: number;
          end_day: number;
          summary: string | null;
          is_final_level: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          program_id: string;
          position: number;
          slug: string;
          title: string;
          tagline?: string | null;
          start_day: number;
          end_day: number;
          summary?: string | null;
          is_final_level?: boolean;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          program_id?: string;
          position?: number;
          slug?: string;
          title?: string;
          tagline?: string | null;
          start_day?: number;
          end_day?: number;
          summary?: string | null;
          is_final_level?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      member_daily_tasks: PublicTable<
        {
          id: string;
          member_program_id: string;
          daily_task_template_id: string | null;
          level_id: string;
          program_week_id: string | null;
          due_date: string;
          title: string;
          description: string | null;
          status: Database["public"]["Enums"]["task_status"];
          completed_at: string | null;
          skipped_at: string | null;
          missed_at: string | null;
          proof_required: boolean;
          same_day_editable_until: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          member_program_id: string;
          daily_task_template_id?: string | null;
          level_id: string;
          program_week_id?: string | null;
          due_date: string;
          title: string;
          description?: string | null;
          status?: Database["public"]["Enums"]["task_status"];
          completed_at?: string | null;
          skipped_at?: string | null;
          missed_at?: string | null;
          proof_required?: boolean;
          same_day_editable_until?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          member_program_id?: string;
          daily_task_template_id?: string | null;
          level_id?: string;
          program_week_id?: string | null;
          due_date?: string;
          title?: string;
          description?: string | null;
          status?: Database["public"]["Enums"]["task_status"];
          completed_at?: string | null;
          skipped_at?: string | null;
          missed_at?: string | null;
          proof_required?: boolean;
          same_day_editable_until?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      member_notification_preferences: PublicTable<
        {
          id: string;
          profile_id: string;
          daily_reminder_enabled: boolean;
          daily_reminder_time: string | null;
          weekly_review_reminder_enabled: boolean;
          timezone: string;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          profile_id: string;
          daily_reminder_enabled?: boolean;
          daily_reminder_time?: string | null;
          weekly_review_reminder_enabled?: boolean;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          profile_id?: string;
          daily_reminder_enabled?: boolean;
          daily_reminder_time?: string | null;
          weekly_review_reminder_enabled?: boolean;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        }
      >;
      member_programs: PublicTable<
        {
          id: string;
          profile_id: string;
          program_id: string;
          active_cohort_id: string | null;
          account_state: Database["public"]["Enums"]["account_state"];
          enrollment_state: Database["public"]["Enums"]["enrollment_state"];
          start_date: string | null;
          activated_at: string | null;
          completed_at: string | null;
          current_day: number;
          current_level_id: string | null;
          primary_goal: string | null;
          secondary_goals: Json;
          rules_accepted_at: string | null;
          baseline_snapshot: Json;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          profile_id: string;
          program_id: string;
          active_cohort_id?: string | null;
          account_state?: Database["public"]["Enums"]["account_state"];
          enrollment_state?: Database["public"]["Enums"]["enrollment_state"];
          start_date?: string | null;
          activated_at?: string | null;
          completed_at?: string | null;
          current_day?: number;
          current_level_id?: string | null;
          primary_goal?: string | null;
          secondary_goals?: Json;
          rules_accepted_at?: string | null;
          baseline_snapshot?: Json;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          profile_id?: string;
          program_id?: string;
          active_cohort_id?: string | null;
          account_state?: Database["public"]["Enums"]["account_state"];
          enrollment_state?: Database["public"]["Enums"]["enrollment_state"];
          start_date?: string | null;
          activated_at?: string | null;
          completed_at?: string | null;
          current_day?: number;
          current_level_id?: string | null;
          primary_goal?: string | null;
          secondary_goals?: Json;
          rules_accepted_at?: string | null;
          baseline_snapshot?: Json;
          created_at?: string;
          updated_at?: string;
        }
      >;
      member_status_history: PublicTable<
        {
          id: string;
          profile_id: string;
          from_state: Database["public"]["Enums"]["account_state"] | null;
          to_state: Database["public"]["Enums"]["account_state"];
          reason: string | null;
          changed_by: string | null;
          changed_at: string;
        },
        {
          id?: string;
          profile_id: string;
          from_state?: Database["public"]["Enums"]["account_state"] | null;
          to_state: Database["public"]["Enums"]["account_state"];
          reason?: string | null;
          changed_by?: string | null;
          changed_at?: string;
        },
        {
          id?: string;
          profile_id?: string;
          from_state?: Database["public"]["Enums"]["account_state"] | null;
          to_state?: Database["public"]["Enums"]["account_state"];
          reason?: string | null;
          changed_by?: string | null;
          changed_at?: string;
        }
      >;
      monthly_reviews: PublicTable<
        {
          id: string;
          member_program_id: string;
          level_id: string;
          status: Database["public"]["Enums"]["review_status"];
          summary: string | null;
          wins: Json;
          misses: Json;
          lessons: Json;
          reflection: Json;
          due_at: string | null;
          submitted_at: string | null;
          locked_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          member_program_id: string;
          level_id: string;
          status?: Database["public"]["Enums"]["review_status"];
          summary?: string | null;
          wins?: Json;
          misses?: Json;
          lessons?: Json;
          reflection?: Json;
          due_at?: string | null;
          submitted_at?: string | null;
          locked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          member_program_id?: string;
          level_id?: string;
          status?: Database["public"]["Enums"]["review_status"];
          summary?: string | null;
          wins?: Json;
          misses?: Json;
          lessons?: Json;
          reflection?: Json;
          due_at?: string | null;
          submitted_at?: string | null;
          locked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      notification_events: PublicTable<
        {
          id: string;
          profile_id: string | null;
          member_program_id: string | null;
          type: Database["public"]["Enums"]["notification_type"];
          status: Database["public"]["Enums"]["notification_status"];
          provider: string;
          provider_message_id: string | null;
          payload: Json;
          scheduled_for: string | null;
          sent_at: string | null;
          failed_at: string | null;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          profile_id?: string | null;
          member_program_id?: string | null;
          type: Database["public"]["Enums"]["notification_type"];
          status?: Database["public"]["Enums"]["notification_status"];
          provider?: string;
          provider_message_id?: string | null;
          payload?: Json;
          scheduled_for?: string | null;
          sent_at?: string | null;
          failed_at?: string | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          profile_id?: string | null;
          member_program_id?: string | null;
          type?: Database["public"]["Enums"]["notification_type"];
          status?: Database["public"]["Enums"]["notification_status"];
          provider?: string;
          provider_message_id?: string | null;
          payload?: Json;
          scheduled_for?: string | null;
          sent_at?: string | null;
          failed_at?: string | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      payments: PublicTable<
        {
          id: string;
          profile_id: string | null;
          member_program_id: string | null;
          stripe_customer_id: string | null;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          amount_cents: number;
          currency: string;
          payment_status: Database["public"]["Enums"]["payment_status"];
          paid_at: string | null;
          refunded_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          profile_id?: string | null;
          member_program_id?: string | null;
          stripe_customer_id?: string | null;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          amount_cents: number;
          currency?: string;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          paid_at?: string | null;
          refunded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          profile_id?: string | null;
          member_program_id?: string | null;
          stripe_customer_id?: string | null;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          amount_cents?: number;
          currency?: string;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          paid_at?: string | null;
          refunded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      profiles: PublicTable<
        {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          display_name: string;
          handle: string | null;
          avatar_path: string | null;
          bio: string | null;
          timezone: string;
          public_profile_enabled: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id: string;
          role?: Database["public"]["Enums"]["app_role"];
          display_name: string;
          handle?: string | null;
          avatar_path?: string | null;
          bio?: string | null;
          timezone?: string;
          public_profile_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          display_name?: string;
          handle?: string | null;
          avatar_path?: string | null;
          bio?: string | null;
          timezone?: string;
          public_profile_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      program_weeks: PublicTable<
        {
          id: string;
          program_id: string;
          level_id: string;
          week_number: number;
          start_day: number;
          end_day: number;
          title: string;
          theme: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          program_id: string;
          level_id: string;
          week_number: number;
          start_day: number;
          end_day: number;
          title: string;
          theme?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          program_id?: string;
          level_id?: string;
          week_number?: number;
          start_day?: number;
          end_day?: number;
          title?: string;
          theme?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      programs: PublicTable<
        {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          duration_days: number;
          status: string;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          duration_days?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          duration_days?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        }
      >;
      proof_items: PublicTable<
        {
          id: string;
          member_program_id: string;
          profile_id: string;
          member_daily_task_id: string | null;
          daily_checkin_id: string | null;
          weekly_review_id: string | null;
          monthly_review_id: string | null;
          type: Database["public"]["Enums"]["proof_type"];
          visibility: Database["public"]["Enums"]["proof_visibility"];
          label: string;
          text_value: string | null;
          numeric_value: number | null;
          url: string | null;
          storage_path: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          member_program_id: string;
          profile_id: string;
          member_daily_task_id?: string | null;
          daily_checkin_id?: string | null;
          weekly_review_id?: string | null;
          monthly_review_id?: string | null;
          type: Database["public"]["Enums"]["proof_type"];
          visibility?: Database["public"]["Enums"]["proof_visibility"];
          label: string;
          text_value?: string | null;
          numeric_value?: number | null;
          url?: string | null;
          storage_path?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          member_program_id?: string;
          profile_id?: string;
          member_daily_task_id?: string | null;
          daily_checkin_id?: string | null;
          weekly_review_id?: string | null;
          monthly_review_id?: string | null;
          type?: Database["public"]["Enums"]["proof_type"];
          visibility?: Database["public"]["Enums"]["proof_visibility"];
          label?: string;
          text_value?: string | null;
          numeric_value?: number | null;
          url?: string | null;
          storage_path?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        }
      >;
      weekly_mission_templates: PublicTable<
        {
          id: string;
          program_id: string;
          level_id: string;
          program_week_id: string;
          title: string;
          instructions: string;
          success_criteria: string;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          program_id: string;
          level_id: string;
          program_week_id: string;
          title: string;
          instructions: string;
          success_criteria: string;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          program_id?: string;
          level_id?: string;
          program_week_id?: string;
          title?: string;
          instructions?: string;
          success_criteria?: string;
          created_at?: string;
          updated_at?: string;
        }
      >;
      weekly_reviews: PublicTable<
        {
          id: string;
          member_program_id: string;
          program_week_id: string;
          weekly_mission_template_id: string | null;
          status: Database["public"]["Enums"]["review_status"];
          summary: string | null;
          wins: Json;
          misses: Json;
          lessons: Json;
          next_week_adjustments: Json;
          score: number | null;
          due_at: string | null;
          submitted_at: string | null;
          locked_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          member_program_id: string;
          program_week_id: string;
          weekly_mission_template_id?: string | null;
          status?: Database["public"]["Enums"]["review_status"];
          summary?: string | null;
          wins?: Json;
          misses?: Json;
          lessons?: Json;
          next_week_adjustments?: Json;
          score?: number | null;
          due_at?: string | null;
          submitted_at?: string | null;
          locked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          member_program_id?: string;
          program_week_id?: string;
          weekly_mission_template_id?: string | null;
          status?: Database["public"]["Enums"]["review_status"];
          summary?: string | null;
          wins?: Json;
          misses?: Json;
          lessons?: Json;
          next_week_adjustments?: Json;
          score?: number | null;
          due_at?: string | null;
          submitted_at?: string | null;
          locked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      waitlist_leads: PublicTable<
        {
          id: string;
          email: string;
          full_name: string | null;
          lead_state: Database["public"]["Enums"]["lead_state"];
          source: string | null;
          medium: string | null;
          campaign: string | null;
          referral_code: string | null;
          referred_by_lead_id: string | null;
          converted_profile_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          email: string;
          full_name?: string | null;
          lead_state?: Database["public"]["Enums"]["lead_state"];
          source?: string | null;
          medium?: string | null;
          campaign?: string | null;
          referral_code?: string | null;
          referred_by_lead_id?: string | null;
          converted_profile_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          email?: string;
          full_name?: string | null;
          lead_state?: Database["public"]["Enums"]["lead_state"];
          source?: string | null;
          medium?: string | null;
          campaign?: string | null;
          referral_code?: string | null;
          referred_by_lead_id?: string | null;
          converted_profile_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      account_state: "waitlisted" | "invited" | "active" | "paused" | "refunded" | "alumni" | "banned";
      app_role: "member" | "founder_admin";
      enrollment_state:
        | "waitlist"
        | "checkout_started"
        | "paid"
        | "onboarding"
        | "in_program"
        | "completed";
      lead_state: "new" | "notified" | "converted" | "unsubscribed";
      notification_status: "queued" | "sent" | "failed";
      notification_type:
        | "welcome"
        | "onboarding_complete"
        | "daily_reminder"
        | "missed_day_followup"
        | "weekly_review_due"
        | "level_unlocked"
        | "founder_broadcast"
        | "payment_update";
      payment_status: "pending" | "paid" | "refunded" | "failed";
      progress_decision_source: "automatic" | "admin_override" | "admin_block";
      proof_type: "metric" | "note" | "link" | "image";
      proof_visibility: "private" | "public_opt_in";
      review_status: "draft" | "submitted" | "missed" | "locked";
      task_status: "planned" | "completed" | "missed" | "skipped";
    };
    CompositeTypes: Record<string, never>;
  };
}
