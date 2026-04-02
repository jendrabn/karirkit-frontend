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
      "KarirKit adalah platform untuk mengelola proses mencari kerja dalam satu tempat. Di dalamnya ada Pelacak Lamaran, Surat Lamaran, CV Builder, Portfolio Digital, Dokumen, dan Langganan.",
  },
  {
    question: "Fitur apa saja yang tersedia di KarirKit?",
    answer:
      "Fitur utamanya meliputi pelacakan lamaran, pembuatan surat lamaran, CV Builder, portfolio digital, pengelolaan dokumen, dan paket langganan untuk membuka akses tambahan sesuai kebutuhan.",
  },
  {
    question: "Bagaimana cara mulai menggunakan Pelacak Lamaran?",
    answer:
      "Masuk ke menu Pelacak Lamaran, lalu tambahkan data perusahaan, posisi, status, sumber lowongan, kontak, catatan, dan jadwal follow-up. Kamu juga bisa memakai filter, statistik, dan bulk action untuk mengelola daftar lamaran lebih cepat.",
  },
  {
    question: "Apakah CV Builder dan Surat Lamaran mendukung Bahasa Indonesia dan Inggris?",
    answer:
      "Ya. CV Builder dan Surat Lamaran mendukung Bahasa Indonesia dan Bahasa Inggris, termasuk pilihan template premium yang bisa dibuka melalui paket langganan.",
  },
  {
    question: "Apakah saya bisa download dan mengelola dokumen?",
    answer:
      "Bisa. CV dan Surat Lamaran dapat diunduh dalam format DOCX atau PDF, lalu diduplikasi untuk versi lain. Di menu Dokumen, kamu juga bisa upload, cari, filter, download, dan hapus file seperti PDF atau DOCX.",
  },
  {
    question: "Bagaimana cara membagikan Portfolio Digital?",
    answer:
      "Setiap portfolio bisa dibuat publik dengan slug unik, lalu dibagikan lewat link. Kamu juga bisa menambahkan cover, galeri media, tools yang dipakai, live demo, dan source code agar tampil lebih lengkap.",
  },
  {
    question: "Apakah saya harus berlangganan untuk mulai memakai KarirKit?",
    answer:
      "Tidak harus. Kamu bisa mulai dengan plan Free untuk memakai fitur inti. Jika butuh akses tambahan, kamu bisa upgrade ke Pro atau Max kapan saja dari halaman Langganan.",
  },
  {
    question: "Apa yang didapat dari fitur Langganan?",
    answer:
      "Langganan menyediakan plan Free, Pro, dan Max dengan batas penggunaan, akses template premium, serta capability tambahan seperti pengelolaan dokumen dan limit yang lebih besar. Pembayaran dilakukan lewat alur checkout yang terhubung dengan Midtrans, dan status langganan bisa dipantau dari halaman Langganan.",
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
