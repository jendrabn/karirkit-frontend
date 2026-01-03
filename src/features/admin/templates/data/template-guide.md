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
- `{{phone}}` - Nomor telepon
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
  name: 'ADMIN USER CV',
  headline: 'Project Manager',
  email: { url: 'mailto:admin@example.com', label: 'admin@example.com' },
  phone: '+1234567892',
  address: '789 Pine Rd, Chicago, IL',
  about: 'Experienced project manager with a track record of successful project delivery.',
  photo_path: '/uploads/cvs/1767434687496-4cca49166743-3cffec91-4148-4854-b463-0d710a746dcc.png',
  educations: [
    {
      degree: 'Doktor',
      school_name: 'International Business University',
      school_location: 'London, UK',
      major: 'Strategic Management',
      start_month: 'Sep',
      start_year: 2020,
      end_month: 'Jun',
      end_year: 2024,
      is_current: false,
      gpa: 4,
      description: 'Research in organizational leadership and innovation'
    },
    {
      degree: 'Magister',
      school_name: 'Business School',
      school_location: 'New York, NY',
      major: 'Business Administration',
      start_month: 'Sep',
      start_year: 2014,
      end_month: 'Jun',
      end_year: 2016,
      is_current: false,
      gpa: 3.7,
      description: 'Focused on project management and leadership'
    }
  ],
  certificates: [
    {
      title: 'PMP Certification',
      issuer: 'Project Management Institute',
      issue_month: 'Sep',
      issue_year: 2019,
      expiry_month: '',
      expiry_year: null,
      no_expiry: true,
      credential_id: 'PMP-345678',
      credential_url: 'https://www.pmi.org/certifications',
      description: 'Project Management Professional certification'
    }
  ],
  experiences: [
    {
      job_title: 'Project Manager',
      company_name: 'Global Corp',
      company_location: 'Chicago, IL',
      job_type: 'Penuh Waktu',
      start_month: 'Jan',
      start_year: 2017,
      end_month: 'Des',
      end_year: 2020,
      is_current: false,
      description: 'Managed multiple projects with budgets over $1M',
      description_points: [
        'Managed multiple projects with budgets over $1M',
        'Delivered cross-functional initiatives on time',
        'Improved reporting cadence for executives'
      ]
    }
  ],
  skills: [
    { name: 'Agile', level: 'Lanjutan' },
    { name: 'Scrum', level: 'Lanjutan' },
    { name: 'Project Management', level: 'Ahli' }
  ],
  awards: [
    {
      title: 'Project Manager of the Year',
      issuer: 'Global Corp',
      description: 'Recognized for successful project delivery',
      year: 2019
    }
  ],
  social_links: [
    { platform: 'X', url: 'https://twitter.com/adminuser', label: 'X' },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/adminuser',
      label: 'LinkedIn'
    }
  ],
  organizations: [
    {
      organization_name: 'Project Management Institute',
      role_title: 'Member',
      organization_type: 'Profesional',
      location: 'Chicago, IL',
      start_month: 'Mar',
      start_year: 2018,
      end_month: '',
      end_year: null,
      is_current: true,
      description: 'Active member of PMI local chapter',
      description_points: [
        'Active member of PMI local chapter',
        'Led community knowledge-sharing sessions'
      ]
    }
  ],
  projects: [
    {
      name: 'PMO Reporting Suite',
      description: 'Launched KPI reporting suite for executive stakeholders.',
      year: 2021,
      repo_url: 'https://github.com/adminuser/pmo-reporting',
      repo_label: 'Repositori',
      live_url: 'https://reports.example.com',
      live_label: 'Live Demo',
      description_points: [
        'Automated monthly reporting pipeline',
        'Reduced manual reporting time by 60%'
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

{{email.label}} | {{phone}} | {{address}}

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
Email: {{email}}
Telepon: {{phone}}
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
|              {{email.label}} | {{phone}} | {{address}}              |
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
