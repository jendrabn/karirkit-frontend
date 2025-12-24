export type ParagraphType = "opening" | "body" | "closing";

export interface ParagraphTemplate {
  id: string;
  title: string;
  content: string;
  language?: string;
}

export const paragraphTemplates: Record<ParagraphType, ParagraphTemplate[]> = {
  opening: [
    {
      id: "opening-1-id",
      title: "Pembuka Formal Umum (ID)",
      content:
        "Dengan hormat,\n\nBerdasarkan informasi lowongan kerja yang saya peroleh dari [sumber informasi], saya bermaksud untuk mengajukan lamaran pekerjaan di perusahaan yang Bapak/Ibu pimpin untuk posisi [nama posisi].",
      language: "id",
    },
    {
      id: "opening-1-en",
      title: "Formal Opening (EN)",
      content:
        "Dear Hiring Manager,\n\nI am writing to express my interest in the [Position Name] position at [Company Name], as advertised on [Source].",
      language: "en",
    },
    {
      id: "opening-2-id",
      title: "Pembuka dengan Referensi (ID)",
      content:
        "Dengan hormat,\n\nMelalui rekomendasi dari [nama referensi] yang bekerja di perusahaan Bapak/Ibu, saya mengetahui bahwa perusahaan sedang membuka lowongan untuk posisi [nama posisi]. Dengan ini saya mengajukan lamaran untuk posisi tersebut.",
      language: "id",
    },
    {
      id: "opening-2-en",
      title: "Referral Opening (EN)",
      content:
        "Dear Hiring Manager,\n\nI was referred to this position by [Referral Name], who currently works at your company. I am writing to apply for the [Position Name] role.",
      language: "en",
    },
    {
      id: "opening-3-id",
      title: "Pembuka dari Job Portal (ID)",
      content:
        "Dengan hormat,\n\nSaya mendapat informasi mengenai lowongan pekerjaan di [nama perusahaan] melalui [nama portal pekerjaan]. Dengan latar belakang pendidikan dan pengalaman yang saya miliki, saya yakin dapat berkontribusi pada posisi [nama posisi] yang sedang dibuka.",
      language: "id",
    },
    {
      id: "opening-3-en",
      title: "Job Portal Opening (EN)",
      content:
        "Dear Hiring Manager,\n\nI recently came across the opening for [Position Name] on [Job Portal Name] and was immediately drawn to the opportunity to join [Company Name].",
      language: "en",
    },
    {
      id: "opening-4-id",
      title: "Pembuka Fresh Graduate (ID)",
      content:
        "Dengan hormat,\n\nPerkenalkan, saya [nama lengkap], lulusan [nama universitas] jurusan [nama jurusan] pada tahun [tahun lulus]. Saya sangat tertarik untuk bergabung dengan [nama perusahaan] pada posisi [nama posisi] yang sedang dibuka.",
      language: "id",
    },
    {
      id: "opening-4-en",
      title: "Fresh Graduate Opening (EN)",
      content:
        "Dear Hiring Manager,\n\nMy name is [Your Name], a recent graduate from [University Name] with a degree in [Major]. I am writing to apply for the [Position Name] position at [Company Name].",
      language: "en",
    },
  ],
  body: [
    {
      id: "body-1-id",
      title: "Pengalaman Profesional (ID)",
      content:
        "Saya memiliki pengalaman kerja selama [jumlah tahun] tahun sebagai [posisi sebelumnya] di [nama perusahaan sebelumnya]. Selama bekerja, saya bertanggung jawab atas [deskripsi tanggung jawab utama]. Pencapaian yang berhasil saya raih antara lain [daftar pencapaian].\n\nDengan latar belakang tersebut, saya yakin dapat memberikan kontribusi yang signifikan bagi perkembangan perusahaan, khususnya dalam [bidang keahlian].",
      language: "id",
    },
    {
      id: "body-1-en",
      title: "Professional Experience (EN)",
      content:
        "I have [Number] years of experience working as a [Previous Position] at [Previous Company]. In this role, I was responsible for [Key Responsibilities]. My key achievements include [List Achievements].\n\nI am confident that my background in [Field of Expertise] will allow me to make a significant contribution to your team.",
      language: "en",
    },
    {
      id: "body-2-id",
      title: "Fresh Graduate dengan Magang (ID)",
      content:
        "Meskipun saya baru lulus, saya telah memiliki pengalaman magang selama [durasi magang] di [nama perusahaan magang] sebagai [posisi magang]. Selama magang, saya berkesempatan untuk [deskripsi pengalaman magang].\n\nSaya juga aktif dalam kegiatan organisasi dan proyek akademik, di mana saya mengembangkan kemampuan [daftar soft skill] yang relevan dengan posisi yang dilamar.",
      language: "id",
    },
    {
      id: "body-2-en",
      title: "Fresh Graduate with Internship (EN)",
      content:
        "Although I am a recent graduate, I have gained valuable experience during my [Duration] internship at [Company Name] as a [Intern Position]. During this time, I [Description of Experience].\n\nI was also active in student organizations and academic projects, where I developed relevant skills such as [List Soft Skills].",
      language: "en",
    },
    {
      id: "body-3-id",
      title: "Keahlian Teknis (ID)",
      content:
        "Saya memiliki keahlian di bidang [bidang keahlian] dengan penguasaan [daftar teknologi/tools]. Selama [jumlah tahun] tahun berkarir, saya telah mengerjakan berbagai proyek seperti [contoh proyek] yang menghasilkan [dampak/hasil proyek].\n\nSaya juga memiliki sertifikasi [nama sertifikasi] yang menunjukkan kompetensi saya dalam bidang ini.",
      language: "id",
    },
    {
      id: "body-3-en",
      title: "Technical Skills (EN)",
      content:
        "I possess strong skills in [Field of Expertise], including proficiency in [List Tools/Technologies]. Over the past [Number] years, I have worked on projects such as [Project Example], which resulted in [Impact/Result].\n\nI also hold a [Certification Name] certification, further validating my expertise in this area.",
      language: "en",
    },
    {
      id: "body-4-id",
      title: "Motivasi dan Kesesuaian (ID)",
      content:
        "Saya sangat tertarik untuk bergabung dengan [nama perusahaan] karena [alasan ketertarikan pada perusahaan]. Nilai-nilai perusahaan yang menjunjung tinggi [nilai perusahaan] sangat selaras dengan prinsip kerja saya.\n\nDengan keahlian saya dalam [bidang keahlian] dan semangat untuk terus belajar, saya yakin dapat berkontribusi positif untuk tim dan mencapai target yang ditetapkan.",
      language: "id",
    },
    {
      id: "body-4-en",
      title: "Motivation and Fit (EN)",
      content:
        "I am particularly drawn to [Company Name] because of [Reason]. Your company's commitment to [Company Value] aligns perfectly with my own professional values.\n\nWith my expertise in [Field of Expertise] and my passion for continuous learning, I am confident in my ability to contribute positively to the team and help achieve your goals.",
      language: "en",
    },
  ],
  closing: [
    {
      id: "closing-1-id",
      title: "Penutup Formal Umum (ID)",
      content:
        "Demikian surat lamaran ini saya sampaikan. Besar harapan saya untuk dapat diberikan kesempatan wawancara agar dapat menjelaskan lebih detail mengenai potensi diri saya. Atas perhatian dan kesempatan yang diberikan, saya mengucapkan terima kasih.",
      language: "id",
    },
    {
      id: "closing-1-en",
      title: "Formal Closing (EN)",
      content:
        "Thank you for considering my application. I welcome the opportunity to discuss how my skills and experience align with the needs of your team. I look forward to the possibility of an interview.",
      language: "en",
    },
    {
      id: "closing-2-id",
      title: "Penutup dengan Ketersediaan (ID)",
      content:
        "Saya sangat antusias untuk mendiskusikan bagaimana pengalaman dan keahlian saya dapat berkontribusi pada [nama perusahaan]. Saya dapat dihubungi kapan saja untuk jadwal wawancara melalui [nomor telepon] atau [email].\n\nTerima kasih atas waktu dan pertimbangan yang diberikan. Saya menantikan kabar baik dari Bapak/Ibu.",
      language: "id",
    },
    {
      id: "closing-2-en",
      title: "Closing with Availability (EN)",
      content:
        "I am eager to discuss how my experience and skills can contribute to [Company Name]. I am available for an interview at your earliest convenience and can be reached at [Phone Number] or [Email].\n\nThank you for your time and consideration.",
      language: "en",
    },
    {
      id: "closing-3-id",
      title: "Penutup Ringkas (ID)",
      content:
        "Demikian surat lamaran ini saya buat dengan sebenar-benarnya. Atas perhatian Bapak/Ibu, saya mengucapkan terima kasih.",
      language: "id",
    },
    {
      id: "closing-3-en",
      title: "Concise Closing (EN)",
      content:
        "Thank you for your attention. I declare that the information provided in this application is true and correct.",
      language: "en",
    },
    {
      id: "closing-4-id",
      title: "Penutup dengan Lampiran (ID)",
      content:
        "Sebagai bahan pertimbangan, bersama surat ini saya lampirkan dokumen pendukung seperti [daftar lampiran]. Saya berharap dapat diberikan kesempatan untuk membuktikan kemampuan saya dalam sesi wawancara.\n\nAtas perhatian dan kesempatan yang diberikan, saya mengucapkan terima kasih.",
      language: "id",
    },
    {
      id: "closing-4-en",
      title: "Closing with Attachments (EN)",
      content:
        "I have attached my resume and [Other Documents] for your review. I hope to have the opportunity to prove my capabilities in an interview.\n\nThank you for your time and consideration.",
      language: "en",
    },
  ],
};

export const paragraphTypeLabels: Record<ParagraphType, string> = {
  opening: "Paragraf Pembuka",
  body: "Paragraf Isi",
  closing: "Paragraf Penutup",
};
