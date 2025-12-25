import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layouts/PageHeader";
import { MinimalSEO } from "@/components/MinimalSEO";

// Import raw markdown content
import guideContent from "../features/admin/templates/data/template-guide.md?raw";

const TemplateGuide = () => {
  return (
    <DashboardLayout>
      <MinimalSEO
        title="Panduan Template"
        description="Panduan pembuatan template dinamis."
        noIndex={true}
      />
      <PageHeader
        title="Panduan Pembuatan Template"
        subtitle="Pelajari cara membuat template DOCX yang dinamis menggunakan docx-templates."
        showBackButton
        backButtonUrl="/admin/templates"
      />

      <Card>
        <CardContent className="pt-6">
          <div className="prose prose-slate max-w-none dark:prose-invert break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                pre: ({ node, ...props }) => (
                  <div className="overflow-auto w-full my-4 rounded-lg">
                    <pre {...props} />
                  </div>
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-auto w-full my-4">
                    <table {...props} />
                  </div>
                ),
              }}
            >
              {guideContent}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TemplateGuide;
