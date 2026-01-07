export const documentTypes = [
  "ktp",
  "kk",
  "sim",
  "paspor",
  "npwp",
  "bpjs_kesehatan",
  "bpjs_ketenagakerjaan",
  "ijazah",
  "transkrip",
  "kartu_pelajar",
  "kartu_mahasiswa",
  "pas_foto",
  "cv",
  "surat_lamaran",
  "portfolio",
  "cover_letter",
  "skck",
  "surat_keterangan_sehat",
  "surat_keterangan_kerja",
  "surat_pengalaman_kerja",
  "surat_rekomendasi",
  "paklaring",
  "surat_pengunduran_diri",
  "kontrak_kerja",
  "slip_gaji",
  "kartu_nama",
  "sertifikat",
  "sertifikat_pelatihan",
  "sertifikat_bahasa",
  "sertifikat_profesi",
  "sertifikat_vaksin",
  "surat_bebas_narkoba",
  "surat_domisili",
  "surat_keterangan_catatan_akademik",
  "surat_keterangan_lulus",
  "kartu_keluarga_sejahtera",
  "hasil_medical_checkup",
  "hasil_tes_psikologi",
  "hasil_tes_narkoba",
  "demo_reel",
  "karya_tulis",
  "publikasi",
  "piagam",
  "lainnya",
] as const;

export type DocumentType = (typeof documentTypes)[number];
export type DocumentCompressionLevel = "auto" | "light" | "medium" | "strong";

export const documentTypeLabels: Record<DocumentType, string> = {
  ktp: "KTP",
  kk: "Kartu Keluarga",
  sim: "SIM",
  paspor: "Paspor",
  npwp: "NPWP",
  bpjs_kesehatan: "BPJS Kesehatan",
  bpjs_ketenagakerjaan: "BPJS Ketenagakerjaan",
  ijazah: "Ijazah",
  transkrip: "Transkrip",
  kartu_pelajar: "Kartu Pelajar",
  kartu_mahasiswa: "Kartu Mahasiswa",
  pas_foto: "Pas Foto",
  cv: "CV",
  surat_lamaran: "Surat Lamaran",
  portfolio: "Portfolio",
  cover_letter: "Cover Letter",
  skck: "SKCK",
  surat_keterangan_sehat: "Surat Keterangan Sehat",
  surat_keterangan_kerja: "Surat Keterangan Kerja",
  surat_pengalaman_kerja: "Surat Pengalaman Kerja",
  surat_rekomendasi: "Surat Rekomendasi",
  paklaring: "Paklaring",
  surat_pengunduran_diri: "Surat Pengunduran Diri",
  kontrak_kerja: "Kontrak Kerja",
  slip_gaji: "Slip Gaji",
  kartu_nama: "Kartu Nama",
  sertifikat: "Sertifikat",
  sertifikat_pelatihan: "Sertifikat Pelatihan",
  sertifikat_bahasa: "Sertifikat Bahasa",
  sertifikat_profesi: "Sertifikat Profesi",
  sertifikat_vaksin: "Sertifikat Vaksin",
  surat_bebas_narkoba: "Surat Bebas Narkoba",
  surat_domisili: "Surat Domisili",
  surat_keterangan_catatan_akademik: "Surat Keterangan Catatan Akademik",
  surat_keterangan_lulus: "Surat Keterangan Lulus",
  kartu_keluarga_sejahtera: "Kartu Keluarga Sejahtera",
  hasil_medical_checkup: "Hasil Medical Check Up",
  hasil_tes_psikologi: "Hasil Tes Psikologi",
  hasil_tes_narkoba: "Hasil Tes Narkoba",
  demo_reel: "Demo Reel",
  karya_tulis: "Karya Tulis",
  publikasi: "Publikasi",
  piagam: "Piagam",
  lainnya: "Lainnya",
};

import type { ListResponse } from "./api";

export interface Document {
  id: string;
  user_id: string;
  type: DocumentType;
  original_name: string;
  path: string;
  mime_type: string;
  size: number;
  created_at: string;
  updated_at: string;
}

export type DocumentResponse = Document;
export type DocumentBatchResponse = Document[];
export type DocumentListResponse = ListResponse<Document>;
export type DocumentPagination = ListResponse<Document>["pagination"];
