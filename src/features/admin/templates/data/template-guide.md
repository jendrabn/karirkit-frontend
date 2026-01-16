# Panduan Membuat Template CV dan Surat Lamaran di Microsoft Word

## Pengenalan

Panduan ini akan membantu Anda membuat template CV dan Surat Lamaran menggunakan Microsoft Word dengan sistem template dinamis. Template ini menggunakan delimiter `{{ }}` untuk menampilkan data secara otomatis.

## Cara Kerja Template

Template bekerja dengan menyisipkan kode khusus di dalam dokumen Word yang akan diganti dengan data aktual saat dokumen dihasilkan. Kode tersebut ditulis di antara tanda `{{` dan `}}`.

---

## 1. Template Surat Lamaran (Application Letter)

### Data yang Tersedia

Berikut adalah daftar lengkap data yang dapat Anda gunakan dalam template surat lamaran:

#### Informasi Pelamar

- `{{applicant_city}}` - Kota pelamar
- `{{application_date}}` - Tanggal pengajuan lamaran
- `{{name}}` - Nama lengkap pelamar
- `{{birth_place_date}}` - Tempat dan tanggal lahir
- `{{gender}}` - Jenis kelamin
- `{{marital_status}}` - Status pernikahan
- `{{education}}` - Pendidikan terakhir
- `{{phone}}` - Nomor telepon
- `{{email}}` - Alamat email
- `{{address}}` - Alamat lengkap

#### Informasi Penerima

- `{{receiver_title}}` - Jabatan penerima (misal: HRD Manager)
- `{{company_name}}` - Nama perusahaan
- `{{company_address}}` - Alamat perusahaan
- `{{company_city}}` - Kota perusahaan

#### Isi Surat

- `{{subject}}` - Subjek surat lamaran
- `{{opening_paragraph}}` - Paragraf pembuka
- `{{body_paragraph}}` - Paragraf isi/body
- `{{closing_paragraph}}` - Paragraf penutup
- `{{attachments}}` - Daftar lampiran (teks lengkap)
- `{{attachments_items}}` - Item lampiran (untuk loop)

#### Tanda Tangan

- `{{signature}}` - Nama untuk tanda tangan
- `{{signature_path}}` - Path gambar tanda tangan
- `{{signature_fallback}}` - Fallback jika tidak ada tanda tangan

### Contoh Template Surat Lamaran

```
{{applicant_city}}, {{application_date}}


Kepada Yth.
{{receiver_title}}
{{company_name}}
{{company_address}}
{{company_city}}


Perihal: {{subject}}


Dengan hormat,

{{opening_paragraph}}

{{body_paragraph}}

{{closing_paragraph}}

Sebagai bahan pertimbangan, bersama ini saya lampirkan:
{{FOR item IN attachments_items}}
{{$idx + 1}}. {{$item}}
{{END-FOR item}}

Demikian surat lamaran ini saya buat dengan sebenar-benarnya. Atas perhatian dan kesempatan yang diberikan, saya ucapkan terima kasih.


Hormat saya,


{{signature}}


DATA DIRI PELAMAR

Nama                    : {{name}}
Tempat, Tanggal Lahir   : {{birth_place_date}}
Jenis Kelamin           : {{gender}}
Status Pernikahan       : {{marital_status}}
Pendidikan              : {{education}}
Telepon                 : {{phone}}
Email                   : {{email}}
Alamat                  : {{address}}
```

### Menyisipkan Gambar Tanda Tangan

Untuk menambahkan tanda tangan digital:

```
Hormat saya,

{{IMAGE signature_path}}

{{name}}
```

---

## 2. Template CV (Curriculum Vitae)

### Data yang Tersedia

#### Informasi Pribadi

- `{{name}}` - Nama lengkap (HURUF BESAR)
- `{{headline}}` - Headline/tagline profesional
- `{{email}}` - Email (objek link)
  - `{{email.url}}` - URL mailto
  - `{{email.label}}` - Teks email
- `{{phone}}` - Nomor telepon (objek link)
  - `{{phone.url}}` - URL telepon/WA
  - `{{phone.label}}` - Teks nomor telepon
- `{{address}}` - Alamat
- `{{about}}` - Deskripsi singkat tentang diri
- `{{photo_path}}` - Path foto profil

#### Pendidikan (educations) - Array

Setiap item pendidikan memiliki:

- `{{$education.degree}}` - Gelar/jenjang pendidikan
- `{{$education.school_name}}` - Nama sekolah/universitas
- `{{$education.school_location}}` - Lokasi sekolah
- `{{$education.major}}` - Jurusan
- `{{$education.start_month}}` - Bulan mulai
- `{{$education.start_year}}` - Tahun mulai
- `{{$education.end_month}}` - Bulan selesai
- `{{$education.end_year}}` - Tahun selesai
- `{{$education.is_current}}` - Status masih berjalan (true/false)
- `{{$education.gpa}}` - IPK/GPA
- `{{$education.description}}` - Deskripsi tambahan

#### Sertifikat (certificates) - Array

Setiap item sertifikat memiliki:

- `{{$certificate.title}}` - Judul sertifikat
- `{{$certificate.issuer}}` - Penerbit sertifikat
- `{{$certificate.issue_month}}` - Bulan terbit
- `{{$certificate.issue_year}}` - Tahun terbit
- `{{$certificate.expiry_month}}` - Bulan kadaluarsa
- `{{$certificate.expiry_year}}` - Tahun kadaluarsa
- `{{$certificate.no_expiry}}` - Tidak ada kadaluarsa (true/false)
- `{{$certificate.credential_id}}` - ID kredensial
- `{{$certificate.credential_url}}` - URL kredensial
- `{{$certificate.description}}` - Deskripsi

#### Pengalaman Kerja (experiences) - Array

Setiap item pengalaman memiliki:

- `{{$experience.job_title}}` - Jabatan
- `{{$experience.company_name}}` - Nama perusahaan
- `{{$experience.company_location}}` - Lokasi perusahaan
- `{{$experience.job_type}}` - Tipe pekerjaan (Full-time, Part-time, dll)
- `{{$experience.start_month}}` - Bulan mulai
- `{{$experience.start_year}}` - Tahun mulai
- `{{$experience.end_month}}` - Bulan selesai
- `{{$experience.end_year}}` - Tahun selesai
- `{{$experience.is_current}}` - Masih bekerja (true/false)
- `{{$experience.description}}` - Deskripsi pekerjaan
- `{{$experience.description_points}}` - Array poin deskripsi (opsional)

#### Keterampilan (skills) - Array

Setiap item keterampilan memiliki:

- `{{$skill.name}}` - Nama keterampilan
- `{{$skill.level}}` - Tingkat keahlian
- `{{$skill.category}}` - Kategori keterampilan

#### Keterampilan per Kategori (skills_by_category) - Array

Setiap item kategori memiliki:

- `{{$skill_category.label}}` - Nama kategori
- `{{$skill_category.skills}}` - Array daftar keterampilan

#### Penghargaan (awards) - Array

Setiap item penghargaan memiliki:

- `{{$award.title}}` - Judul penghargaan
- `{{$award.issuer}}` - Pemberi penghargaan
- `{{$award.description}}` - Deskripsi
- `{{$award.year}}` - Tahun

#### Media Sosial (social_links) - Array

Setiap item media sosial memiliki:

- `{{$link.platform}}` - Platform (LinkedIn, GitHub, dll)
- `{{$link.url}}` - URL lengkap
- `{{$link.label}}` - Label yang ditampilkan
- `{{$link.url_label}}` - Label URL (opsional)

#### Organisasi (organizations) - Array

Setiap item organisasi memiliki:

- `{{$organization.organization_name}}` - Nama organisasi
- `{{$organization.role_title}}` - Jabatan dalam organisasi
- `{{$organization.organization_type}}` - Tipe organisasi
- `{{$organization.location}}` - Lokasi
- `{{$organization.start_month}}` - Bulan mulai
- `{{$organization.start_year}}` - Tahun mulai
- `{{$organization.end_month}}` - Bulan selesai
- `{{$organization.end_year}}` - Tahun selesai
- `{{$organization.is_current}}` - Masih aktif (true/false)
- `{{$organization.description}}` - Deskripsi
- `{{$organization.description_points}}` - Array poin deskripsi (opsional)

#### Proyek (projects) - Array

Setiap item proyek memiliki:

- `{{$project.name}}` - Nama proyek
- `{{$project.description}}` - Deskripsi proyek
- `{{$project.year}}` - Tahun
- `{{$project.repo_url}}` - URL repositori
- `{{$project.repo_label}}` - Label repositori (opsional)
- `{{$project.live_url}}` - URL demo/live
- `{{$project.live_label}}` - Label demo/live (opsional)
- `{{$project.description_points}}` - Array poin deskripsi (opsional)

---

### Contoh Data CV Terbaru

```js
{
    "name": "SELENA GOMEZ",
    "headline": "Singer, Actress & Producer",
    "email": {
        "url": "mailto:selena.gomez@example.com",
        "label": "selena.gomez@example.com"
    },
    "phone": {
        "label": "+628987654321",
        "url": "https://wa.me/628987654321"
    },
    "address": "Jl. Sunset Boulevard No. 21, Jakarta, Indonesia",
    "about": "Penyanyi, aktris, dan produser internasional dengan pengalaman di industri musik, film, dan produksi konten kreatif berskala global.",
    "photo_path": "",
    "educations": [
        {
            "degree": "Semua Jenjang",
            "school_name": "Film & Television Workshops",
            "school_location": "New York, USA",
            "major": "Film Production",
            "start_month": "Mar",
            "start_year": 2016,
            "end_month": "Nov",
            "end_year": 2017,
            "is_current": false,
            "gpa": "",
            "description": "Workshop produksi film dan pengembangan storytelling."
        },
        {
            "degree": "Semua Jenjang",
            "school_name": "Private Vocal Coaching",
            "school_location": "Los Angeles, USA",
            "major": "Music Performance",
            "start_month": "Jan",
            "start_year": 2012,
            "end_month": "Des",
            "end_year": 2014,
            "is_current": false,
            "gpa": "",
            "description": "Pelatihan vokal profesional untuk rekaman dan live performance."
        },
        {
            "degree": "SMA/SMK",
            "school_name": "Hollywood Arts High School",
            "school_location": "Los Angeles, USA",
            "major": "Performing Arts",
            "start_month": "Jul",
            "start_year": 2008,
            "end_month": "Jun",
            "end_year": 2011,
            "is_current": false,
            "gpa": 3.6,
            "description": "Fokus pada seni pertunjukan, musik, dan akting."
        }
    ],
    "certificates": [
        {
            "title": "Creative Producing Essentials",
            "issuer": "Independent Film School",
            "issue_month": "Apr",
            "issue_year": 2018,
            "expiry_month": "",
            "expiry_year": "",
            "no_expiry": true,
            "credential_id": "PROD-SEL-003",
            "credential_url": "https://example.com/producing",
            "description": "Dasar produksi konten kreatif dan manajemen hiburan."
        },
        {
            "title": "Professional Vocal Training",
            "issuer": "Hollywood Vocal Academy",
            "issue_month": "Jun",
            "issue_year": 2015,
            "expiry_month": "",
            "expiry_year": "",
            "no_expiry": true,
            "credential_id": "VOC-SEL-001",
            "credential_url": "https://example.com/vocal",
            "description": "Pelatihan vokal profesional untuk performer musik."
        },
        {
            "title": "Acting for Film & Television",
            "issuer": "Los Angeles Acting Studio",
            "issue_month": "Sep",
            "issue_year": 2014,
            "expiry_month": "",
            "expiry_year": "",
            "no_expiry": true,
            "credential_id": "ACT-SEL-002",
            "credential_url": "https://example.com/acting",
            "description": "Pelatihan akting kamera dan pendalaman karakter."
        }
    ],
    "experiences": [
        {
            "job_title": "Executive Producer",
            "company_name": "July Moon Productions",
            "company_location": "Los Angeles, USA",
            "job_type": "Kontrak",
            "start_month": "Jan",
            "start_year": 2019,
            "end_month": "",
            "end_year": "",
            "is_current": true,
            "description": "Mengawasi pengembangan serial televisi\nTerlibat dalam pengambilan keputusan kreatif\nBerkolaborasi dengan penulis dan sutradara\nMenjaga kualitas produksi\nMendukung talenta kreatif baru",
            "description_points": [
                "Mengawasi pengembangan serial televisi",
                "Terlibat dalam pengambilan keputusan kreatif",
                "Berkolaborasi dengan penulis dan sutradara",
                "Menjaga kualitas produksi",
                "Mendukung talenta kreatif baru"
            ]
        },
        {
            "job_title": "Singer & Songwriter",
            "company_name": "Interscope Records",
            "company_location": "Los Angeles, USA",
            "job_type": "Kontrak",
            "start_month": "Jan",
            "start_year": 2013,
            "end_month": "",
            "end_year": "",
            "is_current": true,
            "description": "Menulis dan merekam album musik studio\nBerkolaborasi dengan produser dan musisi internasional\nMelakukan tur dan penampilan live di berbagai negara\nMengelola proses kreatif dari konsep hingga rilis\nMembangun koneksi dengan penggemar secara global",
            "description_points": [
                "Menulis dan merekam album musik studio",
                "Berkolaborasi dengan produser dan musisi internasional",
                "Melakukan tur dan penampilan live di berbagai negara",
                "Mengelola proses kreatif dari konsep hingga rilis",
                "Membangun koneksi dengan penggemar secara global"
            ]
        },
        {
            "job_title": "Actress",
            "company_name": "Walt Disney Studios",
            "company_location": "Los Angeles, USA",
            "job_type": "Kontrak",
            "start_month": "Mar",
            "start_year": 2007,
            "end_month": "Des",
            "end_year": 2012,
            "is_current": false,
            "description": "Membintangi serial televisi dan film layar lebar\nMengembangkan karakter sesuai kebutuhan cerita\nBekerja sama dengan sutradara dan kru produksi\nMengikuti jadwal syuting profesional\nMengembangkan kemampuan akting melalui pengalaman lapangan",
            "description_points": [
                "Membintangi serial televisi dan film layar lebar",
                "Mengembangkan karakter sesuai kebutuhan cerita",
                "Bekerja sama dengan sutradara dan kru produksi",
                "Mengikuti jadwal syuting profesional",
                "Mengembangkan kemampuan akting melalui pengalaman lapangan"
            ]
        }
    ],
    "skills": [
        {
            "name": "Brand Collaboration",
            "level": "Ahli",
            "category": "Manajemen Proyek"
        },
        {
            "name": "Creative Leadership",
            "level": "Lanjutan",
            "category": "Manajemen Proyek"
        },
        {
            "name": "Vocal Performance",
            "level": "Ahli",
            "category": "Penulisan Konten"
        },
        {
            "name": "Music Interpretation",
            "level": "Lanjutan",
            "category": "Penulisan Konten"
        },
        {
            "name": "Creative Storytelling",
            "level": "Ahli",
            "category": "Penulisan Konten"
        },
        {
            "name": "Media Strategy",
            "level": "Menengah",
            "category": "Manajemen Proyek"
        },
        {
            "name": "Content Production",
            "level": "Lanjutan",
            "category": "Manajemen Proyek"
        },
        {
            "name": "Character Development",
            "level": "Lanjutan",
            "category": "Komunikasi"
        },
        {
            "name": "Creative Direction",
            "level": "Lanjutan",
            "category": "Manajemen Proyek"
        },
        {
            "name": "On-Camera Performance",
            "level": "Ahli",
            "category": "Komunikasi"
        },
        {
            "name": "Songwriting",
            "level": "Lanjutan",
            "category": "Penulisan Konten"
        },
        {
            "name": "Emotional Expression",
            "level": "Ahli",
            "category": "Komunikasi"
        },
        {
            "name": "Lyric Composition",
            "level": "Lanjutan",
            "category": "Penulisan Konten"
        },
        {
            "name": "Film Acting",
            "level": "Ahli",
            "category": "Komunikasi"
        },
        {
            "name": "Script Interpretation",
            "level": "Lanjutan",
            "category": "Komunikasi"
        }
    ],
    "skills_by_category": [
        {
            "label": "Manajemen Proyek",
            "skills": [
                {
                    "name": "Brand Collaboration",
                    "level": "Ahli"
                },
                {
                    "name": "Creative Leadership",
                    "level": "Lanjutan"
                },
                {
                    "name": "Media Strategy",
                    "level": "Menengah"
                },
                {
                    "name": "Content Production",
                    "level": "Lanjutan"
                },
                {
                    "name": "Creative Direction",
                    "level": "Lanjutan"
                }
            ]
        },
        {
            "label": "Penulisan Konten",
            "skills": [
                {
                    "name": "Vocal Performance",
                    "level": "Ahli"
                },
                {
                    "name": "Music Interpretation",
                    "level": "Lanjutan"
                },
                {
                    "name": "Creative Storytelling",
                    "level": "Ahli"
                },
                {
                    "name": "Songwriting",
                    "level": "Lanjutan"
                },
                {
                    "name": "Lyric Composition",
                    "level": "Lanjutan"
                }
            ]
        },
        {
            "label": "Komunikasi",
            "skills": [
                {
                    "name": "Character Development",
                    "level": "Lanjutan"
                },
                {
                    "name": "On-Camera Performance",
                    "level": "Ahli"
                },
                {
                    "name": "Emotional Expression",
                    "level": "Ahli"
                },
                {
                    "name": "Film Acting",
                    "level": "Ahli"
                },
                {
                    "name": "Script Interpretation",
                    "level": "Lanjutan"
                }
            ]
        }
    ],
    "awards": [
        {
            "title": "MTV Video Music Award",
            "issuer": "MTV",
            "description": "Penghargaan untuk karya video musik terbaik.",
            "year": 2021
        },
        {
            "title": "Billboard Women in Music",
            "issuer": "Billboard",
            "description": "Pengakuan atas pengaruh dan pencapaian di dunia musik.",
            "year": 2020
        },
        {
            "title": "American Music Award",
            "issuer": "American Music Awards",
            "description": "Penghargaan atas kontribusi di industri musik internasional.",
            "year": 2017
        }
    ],
    "social_links": [
        {
            "platform": "YouTube",
            "url": "https://youtube.com/selenagomez",
            "label": "YouTube",
            "url_label": "youtube.com/selenagomez"
        },
        {
            "platform": "Instagram",
            "url": "https://instagram.com/selenagomez",
            "label": "Instagram",
            "url_label": "instagram.com/selenagomez"
        },
        {
            "platform": "Website",
            "url": "https://selenagomez.com",
            "label": "Website",
            "url_label": "selenagomez.com"
        },
        {
            "platform": "LinkedIn",
            "url": "https://linkedin.com/in/selenagomez",
            "label": "LinkedIn",
            "url_label": "linkedin.com/in/selenagomez"
        },
        {
            "platform": "X",
            "url": "https://x.com/selenagomez",
            "label": "X",
            "url_label": "x.com/selenagomez"
        }
    ],
    "organizations": [
        {
            "organization_name": "Rare Impact Fund",
            "role_title": "Founder",
            "organization_type": "Profesional",
            "location": "Los Angeles, USA",
            "start_month": "Jul",
            "start_year": 2020,
            "end_month": "",
            "end_year": "",
            "is_current": true,
            "description": "Menginisiasi gerakan kesehatan mental global\nMenggalang dana sosial internasional\nBerkolaborasi dengan organisasi nonprofit\nMeningkatkan kesadaran publik\nMenciptakan dampak sosial berkelanjutan",
            "description_points": [
                "Menginisiasi gerakan kesehatan mental global",
                "Menggalang dana sosial internasional",
                "Berkolaborasi dengan organisasi nonprofit",
                "Meningkatkan kesadaran publik",
                "Menciptakan dampak sosial berkelanjutan"
            ]
        },
        {
            "organization_name": "Women in Music",
            "role_title": "Member",
            "organization_type": "Komunitas",
            "location": "Los Angeles, USA",
            "start_month": "Jan",
            "start_year": 2016,
            "end_month": "",
            "end_year": "",
            "is_current": true,
            "description": "Mendukung pemberdayaan perempuan di industri musik\nMenghadiri diskusi komunitas\nBerbagi pengalaman profesional\nMendorong kesetaraan gender\nMendukung talenta perempuan baru",
            "description_points": [
                "Mendukung pemberdayaan perempuan di industri musik",
                "Menghadiri diskusi komunitas",
                "Berbagi pengalaman profesional",
                "Mendorong kesetaraan gender",
                "Mendukung talenta perempuan baru"
            ]
        },
        {
            "organization_name": "UNICEF",
            "role_title": "Ambassador",
            "organization_type": "Profesional",
            "location": "Global",
            "start_month": "Sep",
            "start_year": 2009,
            "end_month": "Des",
            "end_year": 2018,
            "is_current": false,
            "description": "Mendukung kampanye kemanusiaan global\nBerpartisipasi dalam kegiatan sosial internasional\nMeningkatkan kesadaran isu anak\nMewakili organisasi dalam acara publik\nMendukung program pendidikan dan kesehatan",
            "description_points": [
                "Mendukung kampanye kemanusiaan global",
                "Berpartisipasi dalam kegiatan sosial internasional",
                "Meningkatkan kesadaran isu anak",
                "Mewakili organisasi dalam acara publik",
                "Mendukung program pendidikan dan kesehatan"
            ]
        }
    ],
    "projects": [
        {
            "name": "Television Series Production",
            "description": "Terlibat sebagai produser eksekutif serial televisi\nMengawasi alur cerita\nBekerja sama dengan tim produksi\nMenjaga kualitas konten\nMengelola kolaborasi kreatif",
            "year": 2022,
            "repo_url": "",
            "repo_label": "",
            "live_url": "https://hulu.com",
            "live_label": "Live Demo",
            "description_points": [
                "Terlibat sebagai produser eksekutif serial televisi",
                "Mengawasi alur cerita",
                "Bekerja sama dengan tim produksi",
                "Menjaga kualitas konten",
                "Mengelola kolaborasi kreatif"
            ]
        },
        {
            "name": "Music Album Production",
            "description": "Mengembangkan konsep album musik\nBerkolaborasi dengan produser global\nMengelola proses rekaman\nMengatur visual dan tema album\nMerilis karya ke pasar internasional",
            "year": 2021,
            "repo_url": "",
            "repo_label": "",
            "live_url": "https://selenagomez.com",
            "live_label": "Live Demo",
            "description_points": [
                "Mengembangkan konsep album musik",
                "Berkolaborasi dengan produser global",
                "Mengelola proses rekaman",
                "Mengatur visual dan tema album",
                "Merilis karya ke pasar internasional"
            ]
        },
        {
            "name": "Rare Beauty",
            "description": "Mengembangkan brand kecantikan dengan nilai inklusivitas\nMengawasi pengembangan produk\nMengelola kampanye pemasaran global\nMengintegrasikan misi sosial\nMembangun identitas brand yang kuat",
            "year": 2020,
            "repo_url": "",
            "repo_label": "",
            "live_url": "https://rarebeauty.com",
            "live_label": "Live Demo",
            "description_points": [
                "Mengembangkan brand kecantikan dengan nilai inklusivitas",
                "Mengawasi pengembangan produk",
                "Mengelola kampanye pemasaran global",
                "Mengintegrasikan misi sosial",
                "Membangun identitas brand yang kuat"
            ]
        }
    ]
}
```

### Contoh Template CV

```
{{IMAGE photo_path}}

{{name}}
{{headline}}

{{email.label}} | {{phone.label}} | {{address}}

{{FOR link IN social_links}}
{{$link.platform}}: {{LINK $link}}
{{END-FOR link}}

---

TENTANG SAYA

{{about}}

---

PENDIDIKAN

{{FOR education IN educations}}
{{$education.degree}} - {{$education.major}}
{{$education.school_name}}, {{$education.school_location}}
{{$education.start_month}} {{$education.start_year}} - {{IF $education.is_current}}Sekarang{{END-IF}}{{IF !$education.is_current}}{{$education.end_month}} {{$education.end_year}}{{END-IF}}
{{IF $education.gpa}}IPK: {{$education.gpa}}{{END-IF}}
{{IF $education.description}}{{$education.description}}{{END-IF}}

{{END-FOR education}}

---

PENGALAMAN KERJA

{{FOR experience IN experiences}}
{{$experience.job_title}}
{{$experience.company_name}}, {{$experience.company_location}}
{{$experience.start_month}} {{$experience.start_year}} - {{IF $experience.is_current}}Sekarang{{END-IF}}{{IF !$experience.is_current}}{{$experience.end_month}} {{$experience.end_year}}{{END-IF}} | {{$experience.job_type}}

{{$experience.description}}

{{END-FOR experience}}

---

SERTIFIKAT

{{FOR certificate IN certificates}}
{{$certificate.title}}
Diterbitkan oleh: {{$certificate.issuer}}
{{$certificate.issue_month}} {{$certificate.issue_year}}{{IF !$certificate.no_expiry}} - {{$certificate.expiry_month}} {{$certificate.expiry_year}}{{END-IF}}
{{IF $certificate.credential_id}}ID Kredensial: {{$certificate.credential_id}}{{END-IF}}
{{IF $certificate.description}}{{$certificate.description}}{{END-IF}}

{{END-FOR certificate}}

---

KETERAMPILAN

{{FOR skill IN skills}}
• {{$skill.name}} - {{$skill.level}}
{{END-FOR skill}}

---

KETERAMPILAN PER KATEGORI

{{FOR skill_category IN skills_by_category}}
{{$skill_category.label}}
{{FOR skill IN $skill_category.skills}}
- {{$skill}}
{{END-FOR skill}}
{{END-FOR skill_category}}

---

PENGHARGAAN

{{FOR award IN awards}}
{{$award.title}} ({{$award.year}})
{{$award.issuer}}
{{IF $award.description}}{{$award.description}}{{END-IF}}

{{END-FOR award}}

---

ORGANISASI

{{FOR organization IN organizations}}
{{$organization.role_title}}
{{$organization.organization_name}} ({{$organization.organization_type}})
{{$organization.location}}
{{$organization.start_month}} {{$organization.start_year}} - {{IF $organization.is_current}}Sekarang{{END-IF}}{{IF !$organization.is_current}}{{$organization.end_month}} {{$organization.end_year}}{{END-IF}}

{{IF $organization.description}}{{$organization.description}}{{END-IF}}

{{END-FOR organization}}
```

---

## Perintah Template yang Tersedia

### 1. Menampilkan Data Sederhana

**Sintaks:** `{{nama_variabel}}`

**Contoh:**

```
Nama: {{name}}
Email: {{email.label}}
Telepon: {{phone.label}}
```

### 2. Loop/Perulangan (FOR)

Digunakan untuk menampilkan data berupa array/list.

**Sintaks:**

```
{{FOR item IN nama_array}}
  {{$item.property}}
{{END-FOR item}}
```

**Catatan:** Variabel di dalam loop harus diawali dengan tanda `$`

**Contoh:**

```
{{FOR education IN educations}}
- {{$education.degree}} di {{$education.school_name}}
{{END-FOR education}}
```

**Menggunakan Index:**

```
{{FOR skill IN skills}}
{{$idx + 1}}. {{$skill.name}} - {{$skill.level}}
{{END-FOR skill}}
```

### 3. Kondisi (IF)

Digunakan untuk menampilkan konten berdasarkan kondisi.

**Sintaks:**

```
{{IF kondisi}}
  konten jika kondisi benar
{{END-IF}}
```

**Contoh:**

```
{{IF $education.is_current}}
Status: Sedang Berlangsung
{{END-IF}}

{{IF $education.gpa}}
IPK: {{$education.gpa}}
{{END-IF}}
```

**Kondisi dengan Else (menggunakan operator ternary):**

```
Periode: {{$education.start_year}} - {{$education.is_current ? 'Sekarang' : $education.end_year}}
```

### 4. Menyisipkan Gambar (IMAGE)

**Sintaks:** `{{IMAGE path_gambar}}`

**Contoh:**

```
{{IMAGE photo_path}}
{{IMAGE signature_path}}
```

### 5. Menyisipkan Link (LINK)

**Sintaks:** `{{LINK {url: 'url', label: 'label'}}}`

**Contoh:**

```
{{LINK email}}
{{LINK {url: 'https://linkedin.com/in/username', label: 'LinkedIn Profile'}}}
```

### 6. Filter dan Manipulasi Data

Anda dapat menggunakan JavaScript di dalam template:

**Contoh:**

```
{{FOR experience IN experiences.filter(exp => exp.is_current)}}
- {{$experience.job_title}} (Pekerjaan Saat Ini)
{{END-FOR experience}}
```

---

## Tips Penggunaan Template

### 1. Format Tanggal

```
{{$education.start_month}} {{$education.start_year}} - {{$education.end_month}} {{$education.end_year}}
```

### 2. Menampilkan Status "Sekarang" atau Tanggal Akhir

```
{{IF $experience.is_current}}
Sekarang
{{END-IF}}
{{IF !$experience.is_current}}
{{$experience.end_month}} {{$experience.end_year}}
{{END-IF}}
```

### 3. Menampilkan Data Opsional

```
{{IF $education.gpa}}
IPK/GPA: {{$education.gpa}}
{{END-IF}}
```

### 4. Membuat Daftar Bernomor

```
{{FOR item IN attachments_items}}
{{$idx + 1}}. {{$item}}
{{END-FOR item}}
```

### 5. Tabel Dinamis

```
+-----------------------------------+------------------+
| Keterampilan                      | Tingkat          |
+===================================+==================+
| {{FOR skill IN skills}}           |                  |
+-----------------------------------+------------------+
| {{$skill.name}}                   | {{$skill.level}} |
+-----------------------------------+------------------+
| {{END-FOR skill}}                 |                  |
+-----------------------------------+------------------+
```

---

## Hal yang Perlu Diperhatikan

1. **Delimiter:** Gunakan `{{` untuk membuka dan `}}` untuk menutup perintah template
2. **Variabel Loop:** Selalu gunakan prefix `$` untuk variabel di dalam loop (misal: `$education`, `$skill`)
3. **Index Loop:** Gunakan `$idx` untuk mendapatkan index saat ini (dimulai dari 0)
4. **Data Opsional:** Gunakan `IF` untuk mengecek ketersediaan data sebelum menampilkan
5. **Format:** Template akan mempertahankan format Word yang Anda terapkan (bold, italic, warna, dll)

---

## Contoh Lengkap Format Tabel CV

```
+----------------------------------------------------------------------+
|                           {{IMAGE photo_path}}                       |
|                                                                      |
|                              {{name}}                                |
|                            {{headline}}                              |
|                                                                      |
|              {{email.label}} | {{phone.label}} | {{address}}              |
+----------------------------------------------------------------------+

PENGALAMAN KERJA
+----------------------------------------------------------------------+
| {{FOR experience IN experiences}}                                    |
+----------------------------------------------------------------------+
| {{$experience.job_title}}                                           |
| {{$experience.company_name}} - {{$experience.company_location}}     |
| {{$experience.start_month}} {{$experience.start_year}} -            |
| {{IF $experience.is_current}}Sekarang{{END-IF}}                     |
| {{IF !$experience.is_current}}{{$experience.end_month}}             |
| {{$experience.end_year}}{{END-IF}}                                  |
|                                                                      |
| {{$experience.description}}                                         |
+----------------------------------------------------------------------+
| {{END-FOR experience}}                                              |
+----------------------------------------------------------------------+
```

---

## Ringkasan Perintah Template

| Perintah                             | Fungsi                     | Contoh                    |
| ------------------------------------ | -------------------------- | ------------------------- |
| `{{variabel}}`                       | Menampilkan nilai variabel | `{{name}}`                |
| `{{FOR x IN array}}...{{END-FOR x}}` | Loop/perulangan            | `{{FOR skill IN skills}}` |
| `{{IF kondisi}}...{{END-IF}}`        | Kondisi                    | `{{IF $education.gpa}}`   |
| `{{IMAGE path}}`                     | Sisipkan gambar            | `{{IMAGE photo_path}}`    |
| `{{LINK object}}`                    | Sisipkan link              | `{{LINK email}}`          |
| `$variabel`                          | Variabel dalam loop        | `{{$education.degree}}`   |
| `$idx`                               | Index loop (mulai dari 0)  | `{{$idx + 1}}`            |

---

Dengan panduan ini, Anda dapat membuat template CV dan Surat Lamaran yang profesional dan mudah digunakan. Template akan secara otomatis mengisi data sesuai dengan informasi yang tersedia.
