import { PortfolioListResponse, PortfolioDetailResponse } from "@/types/portfolio";

export const mockPortfolioUser = {
  id: "user-1",
  name: "Jendra Bayu",
  username: "jendrabayu",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  headline: "Full Stack Developer | React & Node.js Enthusiast",
};

export const mockPortfolios = [
  {
    id: "portfolio-1",
    user_id: "user-1",
    title: "KarirKit - Platform Manajemen Karir",
    slug: "karirkit-platform-manajemen-karir",
    sort_description: "Platform untuk membantu pencari kerja mengelola lamaran dan portofolio mereka.",
    description: `KarirKit adalah platform komprehensif yang dirancang untuk membantu para pencari kerja dalam mengelola proses pencarian kerja mereka. Platform ini menyediakan berbagai fitur seperti pembuatan CV, surat lamaran, dan pelacakan aplikasi pekerjaan.

Fitur utama meliputi:
- Pembuat CV dengan berbagai template profesional
- Generator surat lamaran yang disesuaikan
- Pelacak aplikasi pekerjaan dengan status real-time
- Manajemen portofolio digital
- Dashboard analitik untuk melacak progress`,
    role_title: "Full Stack Developer",
    project_type: "work" as const,
    industry: "Human Resources Technology",
    month: 6,
    year: 2024,
    live_url: "https://karirkit.com",
    repo_url: "https://github.com/jendrabayu/karirkit",
    cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop",
    created_at: "2024-06-15T10:00:00.000Z",
    updated_at: "2024-06-15T10:00:00.000Z",
    medias: [
      {
        id: "media-1",
        portfolio_id: "portfolio-1",
        path: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
        caption: "Dashboard utama dengan statistik real-time",
      },
      {
        id: "media-2",
        portfolio_id: "portfolio-1",
        path: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&h=800&fit=crop",
        caption: "Halaman pembuatan CV dengan editor drag-and-drop",
      },
      {
        id: "media-3",
        portfolio_id: "portfolio-1",
        path: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop",
        caption: "Fitur pelacakan aplikasi pekerjaan",
      },
    ],
    tools: [
      { id: "tool-1", portfolio_id: "portfolio-1", name: "React" },
      { id: "tool-2", portfolio_id: "portfolio-1", name: "TypeScript" },
      { id: "tool-3", portfolio_id: "portfolio-1", name: "Tailwind CSS" },
      { id: "tool-4", portfolio_id: "portfolio-1", name: "Node.js" },
      { id: "tool-5", portfolio_id: "portfolio-1", name: "PostgreSQL" },
    ],
  },
  {
    id: "portfolio-2",
    user_id: "user-1",
    title: "E-Commerce Fashion Store",
    slug: "ecommerce-fashion-store",
    sort_description: "Toko online fashion dengan fitur AR untuk try-on virtual.",
    description: `Proyek e-commerce fashion dengan teknologi Augmented Reality yang memungkinkan pelanggan mencoba pakaian secara virtual sebelum membeli.

Platform ini mengintegrasikan:
- Katalog produk dengan filter canggih
- Fitur AR try-on untuk pengalaman belanja interaktif
- Sistem pembayaran terintegrasi
- Manajemen inventori real-time
- Analitik penjualan dan customer insights`,
    role_title: "Frontend Developer",
    project_type: "freelance" as const,
    industry: "E-Commerce & Retail",
    month: 3,
    year: 2024,
    live_url: "https://fashionstore-demo.com",
    repo_url: "",
    cover: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=630&fit=crop",
    created_at: "2024-03-20T10:00:00.000Z",
    updated_at: "2024-03-20T10:00:00.000Z",
    medias: [
      {
        id: "media-4",
        portfolio_id: "portfolio-2",
        path: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
        caption: "Tampilan katalog produk dengan filter",
      },
      {
        id: "media-5",
        portfolio_id: "portfolio-2",
        path: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop",
        caption: "Halaman checkout yang responsif",
      },
    ],
    tools: [
      { id: "tool-6", portfolio_id: "portfolio-2", name: "Next.js" },
      { id: "tool-7", portfolio_id: "portfolio-2", name: "Three.js" },
      { id: "tool-8", portfolio_id: "portfolio-2", name: "Stripe" },
      { id: "tool-9", portfolio_id: "portfolio-2", name: "Prisma" },
    ],
  },
  {
    id: "portfolio-3",
    user_id: "user-1",
    title: "Task Management App",
    slug: "task-management-app",
    sort_description: "Aplikasi manajemen tugas dengan fitur kolaborasi tim.",
    description: `Aplikasi manajemen tugas yang dirancang untuk meningkatkan produktivitas tim dengan fitur kolaborasi real-time.

Fitur yang dikembangkan:
- Kanban board dengan drag-and-drop
- Real-time collaboration menggunakan WebSocket
- Notifikasi dan reminder otomatis
- Time tracking terintegrasi
- Laporan produktivitas tim`,
    role_title: "Lead Developer",
    project_type: "personal" as const,
    industry: "Productivity Software",
    month: 1,
    year: 2024,
    live_url: "https://taskapp-demo.com",
    repo_url: "https://github.com/jendrabayu/taskapp",
    cover: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=630&fit=crop",
    created_at: "2024-01-10T10:00:00.000Z",
    updated_at: "2024-01-10T10:00:00.000Z",
    medias: [
      {
        id: "media-6",
        portfolio_id: "portfolio-3",
        path: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=800&fit=crop",
        caption: "Kanban board dengan fitur drag-and-drop",
      },
    ],
    tools: [
      { id: "tool-10", portfolio_id: "portfolio-3", name: "Vue.js" },
      { id: "tool-11", portfolio_id: "portfolio-3", name: "Socket.io" },
      { id: "tool-12", portfolio_id: "portfolio-3", name: "MongoDB" },
      { id: "tool-13", portfolio_id: "portfolio-3", name: "Docker" },
    ],
  },
  {
    id: "portfolio-4",
    user_id: "user-1",
    title: "Healthcare Appointment System",
    slug: "healthcare-appointment-system",
    sort_description: "Sistem booking appointment untuk klinik kesehatan.",
    description: `Sistem manajemen appointment untuk klinik kesehatan yang memudahkan pasien dalam melakukan booking dan dokter dalam mengelola jadwal.

Sistem mencakup:
- Booking online 24/7
- Reminder otomatis via SMS dan email
- Manajemen jadwal dokter
- Rekam medis elektronik dasar
- Dashboard admin untuk analitik`,
    role_title: "Backend Developer",
    project_type: "work" as const,
    industry: "Healthcare Technology",
    month: 11,
    year: 2023,
    live_url: "",
    repo_url: "",
    cover: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=630&fit=crop",
    created_at: "2023-11-05T10:00:00.000Z",
    updated_at: "2023-11-05T10:00:00.000Z",
    medias: [
      {
        id: "media-7",
        portfolio_id: "portfolio-4",
        path: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=800&fit=crop",
        caption: "Interface booking untuk pasien",
      },
      {
        id: "media-8",
        portfolio_id: "portfolio-4",
        path: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1200&h=800&fit=crop",
        caption: "Dashboard manajemen jadwal dokter",
      },
    ],
    tools: [
      { id: "tool-14", portfolio_id: "portfolio-4", name: "Laravel" },
      { id: "tool-15", portfolio_id: "portfolio-4", name: "MySQL" },
      { id: "tool-16", portfolio_id: "portfolio-4", name: "Redis" },
      { id: "tool-17", portfolio_id: "portfolio-4", name: "AWS" },
    ],
  },
];

export const getPortfolioListData = (username: string): PortfolioListResponse => {
  return {
    user: mockPortfolioUser,
    portfolios: mockPortfolios,
  };
};

export const getPortfolioDetailData = (username: string, id: string): PortfolioDetailResponse | null => {
  const portfolio = mockPortfolios.find((p) => p.id === id);
  if (!portfolio) return null;
  return {
    user: mockPortfolioUser,
    portfolio,
  };
};
