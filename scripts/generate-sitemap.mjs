import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawSiteUrl = process.env.VITE_APP_URL || "";
const BASE_SITE_URL =
  rawSiteUrl && !rawSiteUrl.includes("localhost") && !rawSiteUrl.includes("127.0.0.1")
    ? rawSiteUrl.replace(/\/+$/, "")
    : "https://karirkit.id";

const rawApiUrl = process.env.VITE_APP_API_URL || "";
const API_BASE_URL =
  rawApiUrl && !rawApiUrl.includes("localhost") && !rawApiUrl.includes("127.0.0.1")
    ? rawApiUrl.replace(/\/+$/, "")
    : "https://api.karirkit.id";

const SITEMAP_PATH = path.resolve(__dirname, "../public/sitemap.xml");

const formatDate = (dateString) => {
  if (!dateString) {
    return new Date().toISOString().split("T")[0];
  }
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      return new Date().toISOString().split("T")[0];
    }
    return d.toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
};

const escapeXml = (unsafe) => {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
};

const fetchAllBlogs = async () => {
  const blogs = [];
  try {
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages && page <= 10) {
      const res = await fetch(`${API_BASE_URL}/blogs?page=${page}&per_page=50&status=published`);
      if (!res.ok) {
        console.warn(`[sitemap] Failed to fetch blogs on page ${page}: ${res.statusText}`);
        break;
      }
      const raw = await res.json();
      const payload = raw?.data || raw;
      if (payload?.items && Array.isArray(payload.items)) {
        blogs.push(...payload.items);
      }
      if (payload?.pagination?.total_pages) {
        totalPages = payload.pagination.total_pages;
      } else {
        break;
      }
      page++;
    }
    console.log(`[sitemap] Fetched ${blogs.length} published blogs.`);
  } catch (error) {
    console.warn(`[sitemap] Error fetching blogs: ${error.message}`);
  }
  return blogs;
};

const fetchAllJobs = async () => {
  const jobs = [];
  try {
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages && page <= 10) {
      const res = await fetch(`${API_BASE_URL}/jobs?page=${page}&per_page=50&status=published`);
      if (!res.ok) {
        console.warn(`[sitemap] Failed to fetch jobs on page ${page}: ${res.statusText}`);
        break;
      }
      const raw = await res.json();
      const payload = raw?.data || raw;
      if (payload?.items && Array.isArray(payload.items)) {
        jobs.push(...payload.items);
      }
      if (payload?.pagination?.total_pages) {
        totalPages = payload.pagination.total_pages;
      } else {
        break;
      }
      page++;
    }
    console.log(`[sitemap] Fetched ${jobs.length} published jobs.`);
  } catch (error) {
    console.warn(`[sitemap] Error fetching jobs: ${error.message}`);
  }
  return jobs;
};

async function generateSitemap() {
  console.log(`[sitemap] Generating sitemap.xml for ${BASE_SITE_URL} (API: ${API_BASE_URL})...`);
  const today = new Date().toISOString().split("T")[0];

  const staticUrls = [
    {
      loc: `${BASE_SITE_URL}/`,
      changefreq: "daily",
      priority: "1.0",
      lastmod: today,
    },
    {
      loc: `${BASE_SITE_URL}/jobs`,
      changefreq: "daily",
      priority: "0.9",
      lastmod: today,
    },
    {
      loc: `${BASE_SITE_URL}/blog`,
      changefreq: "daily",
      priority: "0.9",
      lastmod: today,
    },
    {
      loc: `${BASE_SITE_URL}/pricing`,
      changefreq: "weekly",
      priority: "0.8",
      lastmod: today,
    },
  ];

  const [blogs, jobs] = await Promise.all([
    fetchAllBlogs(),
    fetchAllJobs(),
  ]);

  const blogUrls = blogs
    .filter((b) => b.slug)
    .map((blog) => ({
      loc: `${BASE_SITE_URL}/blog/${encodeURIComponent(blog.slug)}`,
      changefreq: "weekly",
      priority: "0.8",
      lastmod: formatDate(blog.updated_at || blog.published_at || blog.created_at),
    }));

  const jobUrls = jobs
    .filter((j) => j.slug)
    .map((job) => ({
      loc: `${BASE_SITE_URL}/jobs/${encodeURIComponent(job.slug)}`,
      changefreq: "daily",
      priority: "0.8",
      lastmod: formatDate(job.updated_at || job.created_at),
    }));

  const allUrls = [...staticUrls, ...blogUrls, ...jobUrls];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allUrls
  .map(
    (item) => `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  fs.writeFileSync(SITEMAP_PATH, xmlContent, "utf-8");
  console.log(`[sitemap] Successfully generated sitemap.xml with ${allUrls.length} URLs at ${SITEMAP_PATH}`);
}

generateSitemap().catch((err) => {
  console.error("[sitemap] Error generating sitemap:", err);
  process.exit(1);
});
