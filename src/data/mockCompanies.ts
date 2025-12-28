import { Company, CompaniesResponse } from "@/types/company";

export const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Gojek",
    slug: "gojek",
    description: "Gojek adalah perusahaan teknologi Indonesia yang melayani jutaan pengguna di Asia Tenggara.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Gojek_logo_2019.svg/1200px-Gojek_logo_2019.svg.png",
    employee_size: "five_hundred_plus",
    business_sector: "Technology",
    website_url: "https://gojek.com",
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: "2",
    name: "Tokopedia",
    slug: "tokopedia",
    description: "Tokopedia adalah marketplace terbesar di Indonesia.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Tokopedia.svg/1200px-Tokopedia.svg.png",
    employee_size: "five_hundred_plus",
    business_sector: "E-commerce",
    website_url: "https://tokopedia.com",
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: "3",
    name: "Bukalapak",
    slug: "bukalapak",
    description: "Bukalapak adalah e-commerce Indonesia yang fokus pada pemberdayaan UMKM.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/40/Bukalapak.png",
    employee_size: "two_hundred_one_to_five_hundred",
    business_sector: "E-commerce",
    website_url: "https://bukalapak.com",
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: "4",
    name: "Shopee Indonesia",
    slug: "shopee-indonesia",
    description: "Shopee adalah platform e-commerce terkemuka di Asia Tenggara dan Taiwan.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopee_logo.svg/1200px-Shopee_logo.svg.png",
    employee_size: "five_hundred_plus",
    business_sector: "E-commerce",
    website_url: "https://shopee.co.id",
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: "5",
    name: "Traveloka",
    slug: "traveloka",
    description: "Traveloka adalah platform pemesanan tiket dan hotel terkemuka di Asia Tenggara.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Traveloka_Primary_Logo.svg/1200px-Traveloka_Primary_Logo.svg.png",
    employee_size: "two_hundred_one_to_five_hundred",
    business_sector: "Travel & Tourism",
    website_url: "https://traveloka.com",
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
];

export const getMockCompaniesResponse = (filters: {
  page?: number;
  per_page?: number;
  q?: string;
  business_sector?: string;
  employee_size?: string;
}): CompaniesResponse => {
  let filteredCompanies = [...mockCompanies];

  if (filters.q) {
    const query = filters.q.toLowerCase();
    filteredCompanies = filteredCompanies.filter(
      (company) =>
        company.name.toLowerCase().includes(query) ||
        company.description.toLowerCase().includes(query)
    );
  }

  if (filters.business_sector) {
    filteredCompanies = filteredCompanies.filter(
      (company) => company.business_sector === filters.business_sector
    );
  }

  if (filters.employee_size) {
    filteredCompanies = filteredCompanies.filter(
      (company) => company.employee_size === filters.employee_size
    );
  }

  const page = filters.page || 1;
  const per_page = filters.per_page || 20;
  const total_items = filteredCompanies.length;
  const total_pages = Math.ceil(total_items / per_page);
  const start = (page - 1) * per_page;
  const end = start + per_page;

  return {
    data: {
      items: filteredCompanies.slice(start, end),
      pagination: {
        page,
        per_page,
        total_items,
        total_pages,
      },
    },
  };
};
