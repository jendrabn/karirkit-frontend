import { Job, JobRole, City, JobsResponse } from "@/types/job";

export const mockJobRoles: JobRole[] = [
  { id: "1", name: "Frontend Developer", slug: "frontend-developer", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: "2", name: "Backend Developer", slug: "backend-developer", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: "3", name: "UI/UX Designer", slug: "ui-ux-designer", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: "4", name: "Product Manager", slug: "product-manager", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: "5", name: "Data Analyst", slug: "data-analyst", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: "6", name: "DevOps Engineer", slug: "devops-engineer", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: "7", name: "Mobile Developer", slug: "mobile-developer", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: "8", name: "QA Engineer", slug: "qa-engineer", created_at: "2025-01-01", updated_at: "2025-01-01" },
];

export const mockCities: City[] = [
  { id: "1", province_id: "1", name: "Jakarta Selatan", province: { id: "1", name: "DKI Jakarta" }, job_count: 150 },
  { id: "2", province_id: "1", name: "Jakarta Pusat", province: { id: "1", name: "DKI Jakarta" }, job_count: 120 },
  { id: "3", province_id: "2", name: "Bandung", province: { id: "2", name: "Jawa Barat" }, job_count: 80 },
  { id: "4", province_id: "3", name: "Surabaya", province: { id: "3", name: "Jawa Timur" }, job_count: 60 },
  { id: "5", province_id: "4", name: "Yogyakarta", province: { id: "4", name: "DI Yogyakarta" }, job_count: 45 },
  { id: "6", province_id: "5", name: "Semarang", province: { id: "5", name: "Jawa Tengah" }, job_count: 35 },
  { id: "7", province_id: "6", name: "Denpasar", province: { id: "6", name: "Bali" }, job_count: 30 },
  { id: "8", province_id: "7", name: "Medan", province: { id: "7", name: "Sumatera Utara" }, job_count: 25 },
];

export const mockJobs: Job[] = [
  {
    id: "1",
    company_id: "1",
    job_role_id: "1",
    city_id: "1",
    title: "Senior Frontend Developer",
    slug: "senior-frontend-developer-gojek",
    job_type: "full_time",
    work_system: "hybrid",
    education_level: "bachelor",
    min_years_of_experience: 3,
    max_years_of_experience: 5,
    description: "Kami mencari Senior Frontend Developer yang berpengalaman untuk bergabung dengan tim teknologi kami. Anda akan bekerja pada produk-produk yang digunakan jutaan pengguna setiap hari.",
    requirements: "- Minimal 3 tahun pengalaman dengan React/Vue.js\n- Memahami TypeScript\n- Pengalaman dengan state management (Redux, Zustand)\n- Familiar dengan testing (Jest, Cypress)\n- Kemampuan komunikasi yang baik",
    salary_min: 15000000,
    salary_max: 25000000,
    talent_quota: 2,
    job_url: "https://gojek.com/careers",
    contact_name: "HR Gojek",
    contact_email: "hr@gojek.com",
    contact_phone: "+6281234567890",
    poster: "",
    status: "published",
    expiration_date: "2026-02-28",
    created_at: "2025-12-20",
    updated_at: "2025-12-20",
    company: {
      id: "1",
      name: "Gojek",
      slug: "gojek",
      description: "Gojek adalah perusahaan teknologi Indonesia yang melayani jutaan pengguna di Asia Tenggara.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Gojek_logo_2019.svg/1200px-Gojek_logo_2019.svg.png",
      employee_size: "more_than_thousand",
      business_sector: "Technology",
      website_url: "https://gojek.com",
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
    },
    job_role: { id: "1", name: "Frontend Developer", slug: "frontend-developer", created_at: "2025-01-01", updated_at: "2025-01-01" },
    city: { id: "1", province_id: "1", name: "Jakarta Selatan", province: { id: "1", name: "DKI Jakarta" }, job_count: 150 },
  },
  {
    id: "2",
    company_id: "2",
    job_role_id: "2",
    city_id: "3",
    title: "Backend Developer",
    slug: "backend-developer-tokopedia",
    job_type: "full_time",
    work_system: "onsite",
    education_level: "bachelor",
    min_years_of_experience: 2,
    max_years_of_experience: 4,
    description: "Tokopedia mencari Backend Developer untuk mengembangkan microservices yang handal dan skalabel.",
    requirements: "- 2+ tahun pengalaman dengan Go/Java/Node.js\n- Memahami konsep microservices\n- Pengalaman dengan database SQL dan NoSQL\n- Familiar dengan Docker dan Kubernetes",
    salary_min: 12000000,
    salary_max: 20000000,
    talent_quota: 3,
    job_url: "https://tokopedia.com/careers",
    contact_name: "HR Tokopedia",
    contact_email: "hr@tokopedia.com",
    contact_phone: "+6281234567891",
    poster: "",
    status: "published",
    expiration_date: "2026-03-15",
    created_at: "2025-12-18",
    updated_at: "2025-12-18",
    company: {
      id: "2",
      name: "Tokopedia",
      slug: "tokopedia",
      description: "Tokopedia adalah marketplace terbesar di Indonesia.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Tokopedia.svg/1200px-Tokopedia.svg.png",
      employee_size: "more_than_thousand",
      business_sector: "E-commerce",
      website_url: "https://tokopedia.com",
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
    },
    job_role: { id: "2", name: "Backend Developer", slug: "backend-developer", created_at: "2025-01-01", updated_at: "2025-01-01" },
    city: { id: "3", province_id: "2", name: "Bandung", province: { id: "2", name: "Jawa Barat" }, job_count: 80 },
  },
  {
    id: "3",
    company_id: "3",
    job_role_id: "3",
    city_id: "1",
    title: "UI/UX Designer",
    slug: "ui-ux-designer-bukalapak",
    job_type: "full_time",
    work_system: "remote",
    education_level: "bachelor",
    min_years_of_experience: 2,
    max_years_of_experience: null,
    description: "Bergabunglah dengan tim desain Bukalapak untuk menciptakan pengalaman pengguna yang luar biasa.",
    requirements: "- Portfolio yang kuat\n- Mahir menggunakan Figma\n- Memahami user research\n- Pengalaman dengan design system\n- Bisa bekerja dalam tim",
    salary_min: 10000000,
    salary_max: 18000000,
    talent_quota: 1,
    job_url: "https://bukalapak.com/careers",
    contact_name: "HR Bukalapak",
    contact_email: "hr@bukalapak.com",
    contact_phone: "+6281234567892",
    poster: "",
    status: "published",
    expiration_date: "2026-01-31",
    created_at: "2025-12-15",
    updated_at: "2025-12-15",
    company: {
      id: "3",
      name: "Bukalapak",
      slug: "bukalapak",
      description: "Bukalapak adalah e-commerce Indonesia yang fokus pada pemberdayaan UMKM.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/40/Bukalapak.png",
      employee_size: "five_hundred_one_to_thousand",
      business_sector: "E-commerce",
      website_url: "https://bukalapak.com",
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
    },
    job_role: { id: "3", name: "UI/UX Designer", slug: "ui-ux-designer", created_at: "2025-01-01", updated_at: "2025-01-01" },
    city: { id: "1", province_id: "1", name: "Jakarta Selatan", province: { id: "1", name: "DKI Jakarta" }, job_count: 150 },
  },
  {
    id: "4",
    company_id: "4",
    job_role_id: "4",
    city_id: "2",
    title: "Product Manager",
    slug: "product-manager-shopee",
    job_type: "full_time",
    work_system: "hybrid",
    education_level: "bachelor",
    min_years_of_experience: 4,
    max_years_of_experience: 7,
    description: "Shopee Indonesia mencari Product Manager berpengalaman untuk memimpin pengembangan fitur-fitur baru.",
    requirements: "- 4+ tahun pengalaman sebagai PM\n- Track record dalam meluncurkan produk sukses\n- Kemampuan analitis yang kuat\n- Leadership yang baik\n- Kemampuan komunikasi lintas tim",
    salary_min: 20000000,
    salary_max: 35000000,
    talent_quota: 1,
    job_url: "https://shopee.co.id/careers",
    contact_name: "HR Shopee",
    contact_email: "hr@shopee.co.id",
    contact_phone: "+6281234567893",
    poster: "",
    status: "published",
    expiration_date: "2026-02-14",
    created_at: "2025-12-22",
    updated_at: "2025-12-22",
    company: {
      id: "4",
      name: "Shopee Indonesia",
      slug: "shopee-indonesia",
      description: "Shopee adalah platform e-commerce terkemuka di Asia Tenggara dan Taiwan.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopee_logo.svg/1200px-Shopee_logo.svg.png",
      employee_size: "more_than_thousand",
      business_sector: "E-commerce",
      website_url: "https://shopee.co.id",
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
    },
    job_role: { id: "4", name: "Product Manager", slug: "product-manager", created_at: "2025-01-01", updated_at: "2025-01-01" },
    city: { id: "2", province_id: "1", name: "Jakarta Pusat", province: { id: "1", name: "DKI Jakarta" }, job_count: 120 },
  },
  {
    id: "5",
    company_id: "5",
    job_role_id: "5",
    city_id: "4",
    title: "Data Analyst Intern",
    slug: "data-analyst-intern-traveloka",
    job_type: "internship",
    work_system: "onsite",
    education_level: "bachelor",
    min_years_of_experience: 0,
    max_years_of_experience: 1,
    description: "Program magang Data Analyst di Traveloka untuk mahasiswa tingkat akhir atau fresh graduate.",
    requirements: "- Mahasiswa tingkat akhir atau fresh graduate\n- Menguasai SQL dan Python\n- Memahami statistik dasar\n- Familiar dengan tools visualisasi data\n- Tertarik dengan travel industry",
    salary_min: 3000000,
    salary_max: 5000000,
    talent_quota: 5,
    job_url: "https://traveloka.com/careers",
    contact_name: "HR Traveloka",
    contact_email: "hr@traveloka.com",
    contact_phone: "+6281234567894",
    poster: "",
    status: "published",
    expiration_date: "2026-01-15",
    created_at: "2025-12-10",
    updated_at: "2025-12-10",
    company: {
      id: "5",
      name: "Traveloka",
      slug: "traveloka",
      description: "Traveloka adalah platform pemesanan tiket dan hotel terkemuka di Asia Tenggara.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Traveloka_Primary_Logo.svg/1200px-Traveloka_Primary_Logo.svg.png",
      employee_size: "five_hundred_one_to_thousand",
      business_sector: "Travel & Tourism",
      website_url: "https://traveloka.com",
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
    },
    job_role: { id: "5", name: "Data Analyst", slug: "data-analyst", created_at: "2025-01-01", updated_at: "2025-01-01" },
    city: { id: "4", province_id: "3", name: "Surabaya", province: { id: "3", name: "Jawa Timur" }, job_count: 60 },
  },
  {
    id: "6",
    company_id: "6",
    job_role_id: "6",
    city_id: "5",
    title: "DevOps Engineer",
    slug: "devops-engineer-kredivo",
    job_type: "full_time",
    work_system: "hybrid",
    education_level: "bachelor",
    min_years_of_experience: 3,
    max_years_of_experience: 6,
    description: "Kredivo mencari DevOps Engineer untuk mengelola infrastruktur cloud dan CI/CD pipeline.",
    requirements: "- 3+ tahun pengalaman DevOps\n- Expert di AWS/GCP\n- Mahir Terraform/Ansible\n- Pengalaman dengan Kubernetes\n- Memahami security best practices",
    salary_min: 18000000,
    salary_max: 28000000,
    talent_quota: 2,
    job_url: "https://kredivo.com/careers",
    contact_name: "HR Kredivo",
    contact_email: "hr@kredivo.com",
    contact_phone: "+6281234567895",
    poster: "",
    status: "published",
    expiration_date: "2026-02-20",
    created_at: "2025-12-19",
    updated_at: "2025-12-19",
    company: {
      id: "6",
      name: "Kredivo",
      slug: "kredivo",
      description: "Kredivo adalah platform kredit digital terkemuka di Indonesia.",
      logo: "https://play-lh.googleusercontent.com/gQ6RCCHsF8Q8-mUvTMmE_cAC2nLU9rj6f3aNjkPX9CxB0HvxGz3F7UvH4vM2M5FhWQ",
      employee_size: "two_hundred_one_to_five_hundred",
      business_sector: "Fintech",
      website_url: "https://kredivo.com",
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
    },
    job_role: { id: "6", name: "DevOps Engineer", slug: "devops-engineer", created_at: "2025-01-01", updated_at: "2025-01-01" },
    city: { id: "5", province_id: "4", name: "Yogyakarta", province: { id: "4", name: "DI Yogyakarta" }, job_count: 45 },
  },
  {
    id: "7",
    company_id: "7",
    job_role_id: "7",
    city_id: "6",
    title: "React Native Developer",
    slug: "react-native-developer-xendit",
    job_type: "contract",
    work_system: "remote",
    education_level: "bachelor",
    min_years_of_experience: 2,
    max_years_of_experience: 4,
    description: "Xendit mencari React Native Developer untuk kontrak 1 tahun mengembangkan aplikasi mobile.",
    requirements: "- 2+ tahun pengalaman React Native\n- Familiar dengan TypeScript\n- Pengalaman dengan Redux/MobX\n- Memahami native modules\n- Pernah publish app ke store",
    salary_min: 14000000,
    salary_max: 22000000,
    talent_quota: 2,
    job_url: "https://xendit.co/careers",
    contact_name: "HR Xendit",
    contact_email: "hr@xendit.co",
    contact_phone: "+6281234567896",
    poster: "",
    status: "published",
    expiration_date: "2026-01-25",
    created_at: "2025-12-17",
    updated_at: "2025-12-17",
    company: {
      id: "7",
      name: "Xendit",
      slug: "xendit",
      description: "Xendit adalah perusahaan payment gateway terkemuka di Asia Tenggara.",
      logo: "https://www.xendit.co/wp-content/uploads/2020/03/Xendit-Logo-1.png",
      employee_size: "two_hundred_one_to_five_hundred",
      business_sector: "Fintech",
      website_url: "https://xendit.co",
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
    },
    job_role: { id: "7", name: "Mobile Developer", slug: "mobile-developer", created_at: "2025-01-01", updated_at: "2025-01-01" },
    city: { id: "6", province_id: "5", name: "Semarang", province: { id: "5", name: "Jawa Tengah" }, job_count: 35 },
  },
  {
    id: "8",
    company_id: "8",
    job_role_id: "1",
    city_id: "7",
    title: "Junior Frontend Developer",
    slug: "junior-frontend-developer-dana",
    job_type: "full_time",
    work_system: "onsite",
    education_level: "bachelor",
    min_years_of_experience: 0,
    max_years_of_experience: 2,
    description: "DANA mencari Junior Frontend Developer untuk bergabung dengan tim engineering.",
    requirements: "- Fresh graduate atau 1-2 tahun pengalaman\n- Memahami HTML, CSS, JavaScript\n- Familiar dengan React\n- Mau belajar dan berkembang\n- Bisa bekerja dalam tim",
    salary_min: 7000000,
    salary_max: 12000000,
    talent_quota: 3,
    job_url: "https://dana.id/careers",
    contact_name: "HR DANA",
    contact_email: "hr@dana.id",
    contact_phone: "+6281234567897",
    poster: "",
    status: "published",
    expiration_date: "2026-03-01",
    created_at: "2025-12-21",
    updated_at: "2025-12-21",
    company: {
      id: "8",
      name: "DANA Indonesia",
      slug: "dana-indonesia",
      description: "DANA adalah dompet digital terkemuka di Indonesia.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/72/Dana_logo.png",
      employee_size: "five_hundred_one_to_thousand",
      business_sector: "Fintech",
      website_url: "https://dana.id",
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
    },
    job_role: { id: "1", name: "Frontend Developer", slug: "frontend-developer", created_at: "2025-01-01", updated_at: "2025-01-01" },
    city: { id: "7", province_id: "6", name: "Denpasar", province: { id: "6", name: "Bali" }, job_count: 30 },
  },
];

export const getMockJobsResponse = (filters: {
  page?: number;
  per_page?: number;
  q?: string;
  job_type?: string;
  work_system?: string;
  job_role_id?: string;
  city_id?: string;
  experience_min?: number;
}): JobsResponse => {
  let filteredJobs = [...mockJobs];

  // Apply search filter
  if (filters.q) {
    const query = filters.q.toLowerCase();
    filteredJobs = filteredJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.company.name.toLowerCase().includes(query)
    );
  }

  // Apply job type filter
  if (filters.job_type) {
    filteredJobs = filteredJobs.filter((job) => job.job_type === filters.job_type);
  }

  // Apply work system filter
  if (filters.work_system) {
    filteredJobs = filteredJobs.filter((job) => job.work_system === filters.work_system);
  }

  // Apply job role filter
  if (filters.job_role_id) {
    filteredJobs = filteredJobs.filter((job) => job.job_role_id === filters.job_role_id);
  }

  // Apply city filter
  if (filters.city_id) {
    filteredJobs = filteredJobs.filter((job) => job.city_id === filters.city_id);
  }

  // Apply experience filter
  if (filters.experience_min !== undefined) {
    filteredJobs = filteredJobs.filter((job) => job.min_years_of_experience >= filters.experience_min!);
  }

  const page = filters.page || 1;
  const per_page = filters.per_page || 10;
  const total_items = filteredJobs.length;
  const total_pages = Math.ceil(total_items / per_page);
  const start = (page - 1) * per_page;
  const end = start + per_page;

  return {
    data: {
      items: filteredJobs.slice(start, end),
      pagination: {
        page,
        per_page,
        total_items,
        total_pages,
      },
    },
  };
};

export const getMockJobBySlug = (slug: string): Job | undefined => {
  return mockJobs.find((job) => job.slug === slug);
};
