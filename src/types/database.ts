export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      blocked_numbers: {
        Row: {
          blocked_at: string;
          blocked_by_rule_id: string | null;
          id: string;
          is_active: boolean;
          phone_number: string;
          reason: string;
          source_alert_id: string | null;
          unblocked_at: string | null;
        };
        Insert: {
          blocked_at?: string;
          blocked_by_rule_id?: string | null;
          id?: string;
          is_active?: boolean;
          phone_number: string;
          reason: string;
          source_alert_id?: string | null;
          unblocked_at?: string | null;
        };
        Update: {
          blocked_at?: string;
          blocked_by_rule_id?: string | null;
          id?: string;
          is_active?: boolean;
          phone_number?: string;
          reason?: string;
          source_alert_id?: string | null;
          unblocked_at?: string | null;
        };
        Relationships: [];
      };
      call_detail_records: {
        Row: {
          call_end: string | null;
          call_start: string;
          call_type: string;
          caller_number: string;
          cost: number;
          created_at: string;
          destination_country: string;
          destination_network: string | null;
          duration_seconds: number;
          id: string;
          is_suspicious: boolean;
          metadata: Json;
          receiver_number: string;
          risk_score: number;
          source_country: string;
          source_network: string | null;
          status: string;
        };
        Insert: {
          call_end?: string | null;
          call_start: string;
          call_type?: string;
          caller_number: string;
          cost?: number;
          created_at?: string;
          destination_country: string;
          destination_network?: string | null;
          duration_seconds?: number;
          id?: string;
          is_suspicious?: boolean;
          metadata?: Json;
          receiver_number: string;
          risk_score?: number;
          source_country: string;
          source_network?: string | null;
          status?: string;
        };
        Update: {
          call_end?: string | null;
          call_start?: string;
          call_type?: string;
          caller_number?: string;
          cost?: number;
          created_at?: string;
          destination_country?: string;
          destination_network?: string | null;
          duration_seconds?: number;
          id?: string;
          is_suspicious?: boolean;
          metadata?: Json;
          receiver_number?: string;
          risk_score?: number;
          source_country?: string;
          source_network?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      case_notes: {
        Row: {
          author_name: string;
          case_id: string;
          created_at: string;
          id: string;
          note: string;
        };
        Insert: {
          author_name?: string;
          case_id: string;
          created_at?: string;
          id?: string;
          note: string;
        };
        Update: {
          author_name?: string;
          case_id?: string;
          created_at?: string;
          id?: string;
          note?: string;
        };
        Relationships: [];
      };
      fraud_alerts: {
        Row: {
          acknowledged_at: string | null;
          cdr_id: string | null;
          created_at: string;
          description: string | null;
          id: string;
          reason: string;
          resolved_at: string | null;
          risk_score: number;
          rule_id: string | null;
          severity: string;
          source_number: string;
          status: string;
          title: string;
        };
        Insert: {
          acknowledged_at?: string | null;
          cdr_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          reason: string;
          resolved_at?: string | null;
          risk_score?: number;
          rule_id?: string | null;
          severity?: string;
          source_number: string;
          status?: string;
          title: string;
        };
        Update: {
          acknowledged_at?: string | null;
          cdr_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          reason?: string;
          resolved_at?: string | null;
          risk_score?: number;
          rule_id?: string | null;
          severity?: string;
          source_number?: string;
          status?: string;
          title?: string;
        };
        Relationships: [];
      };
      fraud_rules: {
        Row: {
          configuration: Json;
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          rule_type: string;
          severity: string;
          threshold_value: number | null;
        };
        Insert: {
          configuration?: Json;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          rule_type: string;
          severity?: string;
          threshold_value?: number | null;
        };
        Update: {
          configuration?: Json;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          rule_type?: string;
          severity?: string;
          threshold_value?: number | null;
        };
        Relationships: [];
      };
      investigation_cases: {
        Row: {
          alert_id: string;
          created_at: string;
          id: string;
          owner_name: string;
          priority: string;
          status: string;
          summary: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          alert_id: string;
          created_at?: string;
          id?: string;
          owner_name?: string;
          priority?: string;
          status?: string;
          summary?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          alert_id?: string;
          created_at?: string;
          id?: string;
          owner_name?: string;
          priority?: string;
          status?: string;
          summary?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      health_check: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
