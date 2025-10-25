export interface InquiryPayload {
  inquiry_type: string; // 'domestic', 'global', 'etc'
  brand_name: string;
  launch_status: string; // 'launched', '1month', '3months', 'over3months'
  inquiry_content: string;
  name: string;
  contact_number: string;
  email: string;
}
