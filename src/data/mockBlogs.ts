import type { Blog, BlogCategory, BlogTag, BlogAuthor } from "@/types/blog";

export const mockCategories: BlogCategory[] = [
  {
    id: "1",
    name: "Tips Karir",
    slug: "tips-karir",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Lamaran Kerja",
    slug: "lamaran-kerja",
    created_at: "2025-01-02T00:00:00Z",
    updated_at: "2025-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "Interview",
    slug: "interview",
    created_at: "2025-01-03T00:00:00Z",
    updated_at: "2025-01-03T00:00:00Z",
  },
  {
    id: "4",
    name: "Pengembangan Diri",
    slug: "pengembangan-diri",
    created_at: "2025-01-04T00:00:00Z",
    updated_at: "2025-01-04T00:00:00Z",
  },
  {
    id: "5",
    name: "Dunia Kerja",
    slug: "dunia-kerja",
    created_at: "2025-01-05T00:00:00Z",
    updated_at: "2025-01-05T00:00:00Z",
  },
];

export const mockTags: BlogTag[] = [
  {
    id: "1",
    name: "Fresh Graduate",
    slug: "fresh-graduate",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "CV",
    slug: "cv",
    created_at: "2025-01-02T00:00:00Z",
    updated_at: "2025-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "Surat Lamaran",
    slug: "surat-lamaran",
    created_at: "2025-01-03T00:00:00Z",
    updated_at: "2025-01-03T00:00:00Z",
  },
  {
    id: "4",
    name: "Tips Interview",
    slug: "tips-interview",
    created_at: "2025-01-04T00:00:00Z",
    updated_at: "2025-01-04T00:00:00Z",
  },
  {
    id: "5",
    name: "Remote Work",
    slug: "remote-work",
    created_at: "2025-01-05T00:00:00Z",
    updated_at: "2025-01-05T00:00:00Z",
  },
  {
    id: "6",
    name: "Soft Skills",
    slug: "soft-skills",
    created_at: "2025-01-06T00:00:00Z",
    updated_at: "2025-01-06T00:00:00Z",
  },
  {
    id: "7",
    name: "Produktivitas",
    slug: "produktivitas",
    created_at: "2025-01-07T00:00:00Z",
    updated_at: "2025-01-07T00:00:00Z",
  },
  {
    id: "8",
    name: "Negosiasi Gaji",
    slug: "negosiasi-gaji",
    created_at: "2025-01-08T00:00:00Z",
    updated_at: "2025-01-08T00:00:00Z",
  },
];

export const mockAuthors: BlogAuthor[] = [
  { id: "1", name: "Admin KarirKit", avatar: null },
  { id: "2", name: "Jendra Bayu", avatar: null },
  { id: "3", name: "Sarah Putri", avatar: null },
];

export const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "10 Tips Membuat CV yang Menarik Perhatian HRD",
    slug: "10-tips-membuat-cv-menarik",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800",
    image_caption: "Ilustrasi CV profesional",
    content: "<p>CV adalah dokumen penting yang menjadi gerbang awal...</p>",
    teaser:
      "Pelajari cara membuat CV yang akan menarik perhatian HRD dan meningkatkan peluang Anda dipanggil interview.",
    min_read: 5,
    views_count: 1250,
    status: "published",
    published_at: "2025-01-15T10:00:00Z",
    category: mockCategories[0],
    tags: [mockTags[0], mockTags[1]],
    author: mockAuthors[0],
    created_at: "2025-01-14T08:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
  },
];
