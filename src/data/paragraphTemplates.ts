export type ParagraphType = "opening" | "body" | "closing";

export interface ParagraphTemplate {
  id: string;
  title: string;
  content: string;
}

export const paragraphTemplates: Record<ParagraphType, ParagraphTemplate[]> = {
  opening: [
    {
      id: "opening-1",
      title: "Pembuka Formal Umum",
      content: "Dengan hormat,\n\nBerdasarkan informasi lowongan kerja yang saya peroleh dari [sumber informasi], saya bermaksud untuk mengajukan lamaran pekerjaan di perusahaan yang Bapak/Ibu pimpin untuk posisi [nama posisi].",
    },
    {
      id: "opening-2",
      title: "Pembuka dengan Referensi",
      content: "Dengan hormat,\n\nMelalui rekomendasi dari [nama referensi] yang bekerja di perusahaan Bapak/Ibu, saya mengetahui bahwa perusahaan sedang membuka lowongan untuk posisi [nama posisi]. Dengan ini saya mengajukan lamaran untuk posisi tersebut.",
    },
    {
      id: "opening-3",
      title: "Pembuka dari Job Portal",
      content: "Dengan hormat,\n\nSaya mendapat informasi mengenai lowongan pekerjaan di [nama perusahaan] melalui [nama portal pekerjaan]. Dengan latar belakang pendidikan dan pengalaman yang saya miliki, saya yakin dapat berkontribusi pada posisi [nama posisi] yang sedang dibuka.",
    },
    {
      id: "opening-4",
      title: "Pembuka Fresh Graduate",
      content: "Dengan hormat,\n\nPerkenalkan, saya [nama lengkap], lulusan [nama universitas] jurusan [nama jurusan] pada tahun [tahun lulus]. Saya sangat tertarik untuk bergabung dengan [nama perusahaan] pada posisi [nama posisi] yang sedang dibuka.",
    },
  ],
  body: [
    {
      id: "body-1",
      title: "Pengalaman Profesional",
      content: "Saya memiliki pengalaman kerja selama [jumlah tahun] tahun sebagai [posisi sebelumnya] di [nama perusahaan sebelumnya]. Selama bekerja, saya bertanggung jawab atas [deskripsi tanggung jawab utama]. Pencapaian yang berhasil saya raih antara lain [daftar pencapaian].\n\nDengan latar belakang tersebut, saya yakin dapat memberikan kontribusi yang signifikan bagi perkembangan perusahaan, khususnya dalam [bidang keahlian].",
    },
    {
      id: "body-2",
      title: "Fresh Graduate dengan Magang",
      content: "Meskipun saya baru lulus, saya telah memiliki pengalaman magang selama [durasi magang] di [nama perusahaan magang] sebagai [posisi magang]. Selama magang, saya berkesempatan untuk [deskripsi pengalaman magang].\n\nSaya juga aktif dalam kegiatan organisasi dan proyek akademik, di mana saya mengembangkan kemampuan [daftar soft skill] yang relevan dengan posisi yang dilamar.",
    },
    {
      id: "body-3",
      title: "Keahlian Teknis",
      content: "Saya memiliki keahlian di bidang [bidang keahlian] dengan penguasaan [daftar teknologi/tools]. Selama [jumlah tahun] tahun berkarir, saya telah mengerjakan berbagai proyek seperti [contoh proyek] yang menghasilkan [dampak/hasil proyek].\n\nSaya juga memiliki sertifikasi [nama sertifikasi] yang menunjukkan kompetensi saya dalam bidang ini.",
    },
    {
      id: "body-4",
      title: "Motivasi dan Kesesuaian",
      content: "Saya sangat tertarik untuk bergabung dengan [nama perusahaan] karena [alasan ketertarikan pada perusahaan]. Nilai-nilai perusahaan yang menjunjung tinggi [nilai perusahaan] sangat selaras dengan prinsip kerja saya.\n\nDengan keahlian saya dalam [bidang keahlian] dan semangat untuk terus belajar, saya yakin dapat berkontribusi positif untuk tim dan mencapai target yang ditetapkan.",
    },
  ],
  closing: [
    {
      id: "closing-1",
      title: "Penutup Formal Umum",
      content: "Demikian surat lamaran ini saya sampaikan. Besar harapan saya untuk dapat diberikan kesempatan wawancara agar dapat menjelaskan lebih detail mengenai potensi diri saya. Atas perhatian dan kesempatan yang diberikan, saya mengucapkan terima kasih.",
    },
    {
      id: "closing-2",
      title: "Penutup dengan Ketersediaan",
      content: "Saya sangat antusias untuk mendiskusikan bagaimana pengalaman dan keahlian saya dapat berkontribusi pada [nama perusahaan]. Saya dapat dihubungi kapan saja untuk jadwal wawancara melalui [nomor telepon] atau [email].\n\nTerima kasih atas waktu dan pertimbangan yang diberikan. Saya menantikan kabar baik dari Bapak/Ibu.",
    },
    {
      id: "closing-3",
      title: "Penutup Ringkas",
      content: "Demikian surat lamaran ini saya buat dengan sebenar-benarnya. Atas perhatian Bapak/Ibu, saya mengucapkan terima kasih.",
    },
    {
      id: "closing-4",
      title: "Penutup dengan Lampiran",
      content: "Sebagai bahan pertimbangan, bersama surat ini saya lampirkan dokumen pendukung seperti [daftar lampiran]. Saya berharap dapat diberikan kesempatan untuk membuktikan kemampuan saya dalam sesi wawancara.\n\nAtas perhatian dan kesempatan yang diberikan, saya mengucapkan terima kasih.",
    },
  ],
};

export const paragraphTypeLabels: Record<ParagraphType, string> = {
  opening: "Paragraf Pembuka",
  body: "Paragraf Isi",
  closing: "Paragraf Penutup",
};
