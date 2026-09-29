export type MessageChannel = 'whatsapp' | 'sms';
export type MessageCategory = 'utility' | 'marketing' | 'service';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface MessageLog {
  id: string;
  salon_id: string;
  client_id: string | null;
  appointment_id: string | null;
  campaign_id: string | null;
  channel: MessageChannel;
  category: MessageCategory;
  template_name: string | null;
  message_body: string | null;
  status: MessageStatus;
  whatsapp_message_id: string | null;
  cost_cents: number | null;
  sent_at: string;
}

export type TemplateName =
  | 'appointment_confirmation'
  | 'appointment_reminder'
  | 'delay_notification'
  | 'appointment_cancelled'
  | 'flash_offer'
  | 'reactivation'
  | 'birthday';

export interface WhatsAppTemplate {
  name: TemplateName;
  category: MessageCategory;
  body: string;
  variables: string[];
}

export interface Product {
  id: string;
  salon_id: string;
  name: string;
  price_cents: number;
  stock_quantity: number;
  low_stock_threshold: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}
