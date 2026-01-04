import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apa itu KarirKit?",
    answer:
      "KarirKit adalah platform lengkap untuk pencari kerja yang menyediakan fitur Pelacak Lamaran, CV Builder, Surat Lamaran, dan Portfolio Digital. Semua tools yang kamu butuhkan untuk kelola proses lamaran kerja dalam satu tempat.",
  },
  {
    question: "Apakah KarirKit benar-benar gratis?",
    answer:
      "Ya! Semua fitur utama KarirKit tersedia gratis. Kamu bisa membuat CV profesional, surat lamaran, melacak lamaran, dan membuat portfolio digital tanpa biaya apapun.",
  },
  {
    question: "Apakah saya bisa download CV dan Surat Lamaran?",
    answer:
      "Tentu! Kamu bisa download CV dan Surat Lamaran dalam format DOCX atau PDF. File yang dihasilkan berkualitas tinggi dan siap dikirim ke recruiter atau diunggah ke portal lowongan kerja.",
  },
  {
    question: "Bagaimana cara mulai menggunakan Pelacak Lamaran?",
    answer:
      "Mudah! Daftar akun gratis, masuk ke menu Lamaran, lalu klik 'Tambah Lamaran'. Isi nama perusahaan, posisi, status, dan detail lainnya. Semua data tersimpan otomatis dan bisa kamu pantau kapan saja.",
  },
  {
    question: "Apakah KarirKit cocok untuk fresh graduate?",
    answer:
      "Sangat cocok! KarirKit menyediakan template CV dan surat lamaran yang cocok untuk fresh graduate. Kamu juga bisa menambahkan pengalaman organisasi, proyek, dan sertifikat untuk memperkuat CV.",
  },
  {
    question: "Berapa banyak CV yang bisa saya buat?",
    answer:
      "Tidak ada batasan! Kamu bisa membuat banyak versi CV untuk posisi yang berbeda. Misalnya: satu CV untuk posisi software engineer, satu lagi untuk data analyst.",
  },
  {
    question: "Apakah CV Builder mendukung bahasa Inggris?",
    answer:
      "Ya! CV Builder dan Surat Lamaran mendukung Bahasa Indonesia dan Bahasa Inggris. Kamu bisa pilih bahasa sesuai kebutuhan saat membuat dokumen.",
  },
  {
    question: "Bagaimana cara membuat Portfolio Digital?",
    answer:
      "Masuk ke menu Portfolio, klik 'Tambah Portfolio', lalu isi detail project kamu seperti judul, deskripsi, tech stack, dan upload gambar. Setelah selesai, kamu akan dapat link unik untuk dibagikan ke recruiter atau client.",
  },
  {
    question: "Apakah ada limit download CV dan Surat Lamaran?",
    answer:
      "Ada limit harian untuk download gratis, tapi cukup untuk penggunaan normal. Kamu bisa download hingga 10 dokumen per hari.",
  },
  {
    question: "Bagaimana cara melacak status lamaran saya?",
    answer:
      "Di halaman Pelacak Lamaran, kamu bisa update status setiap lamaran dari 'Submit' sampai 'Offering'. Ada 15+ tahapan yang bisa kamu track, termasuk screening, test, interview, dan lainnya. Kamu juga bisa tambahkan catatan dan reminder follow-up.",
  },
  {
    question: "Apakah KarirKit menyediakan template surat lamaran?",
    answer:
      "Ya! Kami menyediakan berbagai template profesional untuk paragraf pembuka, isi, dan penutup surat lamaran. Kamu tinggal pilih template, isi data, dan surat lamaran siap digunakan.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-sm text-primary font-medium mb-2">FAQ</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Pertanyaan yang Sering Diajukan
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card rounded-xl border border-border px-6 data-[state=open]:card-shadow"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
