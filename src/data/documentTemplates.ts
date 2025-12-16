export interface DocumentTemplate {
  id: string;
  name: string;
  previewImage: string;
}

export const cvTemplates: DocumentTemplate[] = [
  {
    id: "cv-template-001",
    name: "Template Klasik",
    previewImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=550&fit=crop",
  },
  {
    id: "cv-template-002",
    name: "Template Modern",
    previewImage: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=400&h=550&fit=crop",
  },
  {
    id: "cv-template-003",
    name: "Template Minimalis",
    previewImage: "https://images.unsplash.com/photo-1586282391129-76a6df230234?w=400&h=550&fit=crop",
  },
  {
    id: "cv-template-004",
    name: "Template Profesional",
    previewImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=550&fit=crop",
  },
];

export const applicationLetterTemplates: DocumentTemplate[] = [
  {
    id: "al-template-001",
    name: "Template Formal",
    previewImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=550&fit=crop",
  },
  {
    id: "al-template-002",
    name: "Template Modern",
    previewImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=550&fit=crop",
  },
  {
    id: "al-template-003",
    name: "Template Simpel",
    previewImage: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=550&fit=crop",
  },
];
