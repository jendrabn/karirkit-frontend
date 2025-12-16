import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apa itu KarirKit?",
    answer: "KarirKit adalah platform all-in-one untuk pencari kerja yang menyediakan fitur Application Tracker, CV Builder, Surat Lamaran, dan Portofolio digital. Semua alat yang Anda butuhkan untuk mengelola proses lamaran kerja dalam satu tempat.",
  },
  {
    question: "Apakah fitur CV Builder dan Surat Lamaran gratis?",
    answer: "Ya! Semua fitur dasar KarirKit termasuk CV Builder dan Surat Lamaran tersedia gratis. Anda bisa membuat CV profesional dan surat lamaran tanpa biaya, serta mengekspornya dalam format PDF.",
  },
  {
    question: "Bagaimana cara mulai menggunakan Application Tracker?",
    answer: "Sangat mudah! Cukup daftar akun gratis, lalu masuk ke menu Application Tracker. Anda bisa menambahkan lamaran baru dengan mengisi nama perusahaan, posisi, dan status lamaran. Semua data akan tersimpan dan bisa Anda pantau kapan saja.",
  },
  {
    question: "Apakah KarirKit cocok untuk fresh graduate?",
    answer: "Tentu saja! KarirKit sangat cocok untuk fresh graduate. Kami menyediakan template CV dan surat lamaran yang dirancang khusus untuk yang baru lulus, dengan panduan lengkap cara mengisi setiap bagian.",
  },
  {
    question: "Bisakah saya mengunduh CV dan Surat Lamaran dalam bentuk PDF?",
    answer: "Ya, Anda bisa mengunduh CV dan Surat Lamaran dalam format PDF dengan sekali klik. File PDF yang dihasilkan berkualitas tinggi dan siap dikirim ke recruiter atau diunggah ke portal lowongan kerja.",
  },
];

export function FAQSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
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
