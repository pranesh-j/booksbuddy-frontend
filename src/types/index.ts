// Replace the entire content of types/index.tsx with this:
export interface Page {
  id: number;
  page_number: number;
  content: string;
  created_at: string;
}

export interface Book {
  id: number;
  title: string;  // Added this field
  original_text: string;
  created_at: string;
  is_processed: boolean;
  total_pages: number;
  pages: Page[];
  last_edited: string;  // Added this field
}