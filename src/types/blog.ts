export type BlogStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlogAuthor {
  id: number;
  name: string;
  avatar?: string | null;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  image?: string | null;
  image_caption?: string | null;
  content: string;
  teaser?: string | null;
  min_read: number;
  views_count: number;
  status: BlogStatus;
  published_at?: string | null;
  category?: BlogCategory | null;
  tags?: BlogTag[];
  author?: BlogAuthor | null;
  created_at: string;
  updated_at: string;
}

export const BLOG_STATUS_OPTIONS: { value: BlogStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Dijadwalkan' },
  { value: 'published', label: 'Dipublikasi' },
  { value: 'archived', label: 'Diarsipkan' },
];

export const getStatusBadgeVariant = (status: BlogStatus) => {
  switch (status) {
    case 'draft':
      return 'secondary';
    case 'scheduled':
      return 'outline';
    case 'published':
      return 'default';
    case 'archived':
      return 'destructive';
    default:
      return 'secondary';
  }
};
