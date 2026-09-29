export type CampaignType = 'flash' | 'announcement' | 'product_promo' | 'membership';
export type CampaignStatus = 'draft' | 'sent' | 'relance_sent';

export interface Campaign {
  id: string;
  salon_id: string;
  type: CampaignType;
  message_template: string;
  discount_percent: number | null;
  recipient_count: number | null;
  sent_at: string | null;
  auto_relance_days: number;
  status: CampaignStatus;
  created_at: string;
}

export interface CampaignRecipient {
  id: string;
  campaign_id: string;
  client_id: string;
  message_sent: boolean;
  message_delivered: boolean;
  message_read: boolean;
  whatsapp_message_id: string | null;
}

export type CampaignStep = 'audience' | 'compose' | 'review';

export interface CampaignDraft {
  type: CampaignType | null;
  selectedClientIds: string[];
  messageTemplate: string;
  discountPercent: number | null;
  autoRelanceDays: number;
}
