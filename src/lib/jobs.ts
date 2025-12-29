import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Company, JobRole, City } from "@/types/job";

// --- API Calls ---

export const getCompanies = (): Promise<Company[]> => {
  return api.get("/companies");
};

export const getJobRoles = (): Promise<JobRole[]> => {
  return api.get("/job-roles");
};

export interface GetCitiesParams {
  has_jobs?: boolean;
  province_id?: string;
}

export const getCities = (params?: GetCitiesParams): Promise<City[]> => {
  return api.get("/cities", { params });
};

// --- Query Options ---

export const companiesQueryOptions = () => {
  return queryOptions({
    queryKey: ["companies", "list"],
    queryFn: () => getCompanies(),
  });
};

export const jobRolesQueryOptions = () => {
  return queryOptions({
    queryKey: ["job-roles", "list"],
    queryFn: () => getJobRoles(),
  });
};

export const citiesQueryOptions = (params?: GetCitiesParams) => {
  return queryOptions({
    queryKey: ["cities", "list", params],
    queryFn: () => getCities(params),
  });
};

// --- Hooks ---

export const useCompaniesList = () => {
  return useQuery(companiesQueryOptions());
};

export const useJobRolesList = () => {
  return useQuery(jobRolesQueryOptions());
};

export const useCitiesList = (params?: GetCitiesParams) => {
  return useQuery(citiesQueryOptions(params));
};
