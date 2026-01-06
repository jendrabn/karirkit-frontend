import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { CV } from "@/features/cvs/api/get-cvs";

export type PublicCVResponse = CV;

export const getPublicCV = ({
  slug,
}: {
  slug: string;
}): Promise<PublicCVResponse> => {
  return api.get(`/cv/${slug}`);
};

export const usePublicCV = ({ slug }: { slug: string }) => {
  return useQuery({
    queryKey: ["public-cv", slug],
    queryFn: () => getPublicCV({ slug }),
    enabled: !!slug,
  });
};
