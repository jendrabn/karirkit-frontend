import { JobRole, JobRolesResponse } from "@/types/jobRole";

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

export const getMockJobRolesResponse = (filters: {
  page?: number;
  per_page?: number;
  q?: string;
}): JobRolesResponse => {
  let filteredJobRoles = [...mockJobRoles];

  if (filters.q) {
    const query = filters.q.toLowerCase();
    filteredJobRoles = filteredJobRoles.filter(
      (role) => role.name.toLowerCase().includes(query)
    );
  }

  const page = filters.page || 1;
  const per_page = filters.per_page || 20;
  const total_items = filteredJobRoles.length;
  const total_pages = Math.ceil(total_items / per_page);
  const start = (page - 1) * per_page;
  const end = start + per_page;

  return {
    data: {
      items: filteredJobRoles.slice(start, end),
      pagination: {
        page,
        per_page,
        total_items,
        total_pages,
      },
    },
  };
};
