# Image URL Helper

## Deskripsi

Fungsi `buildImageUrl` adalah helper utility untuk menggabungkan path gambar dari API response dengan base URL API. Ini memastikan semua gambar, avatar, dan media lainnya ditampilkan dengan URL yang lengkap.

## Penggunaan

```typescript
import { buildImageUrl } from "@/lib/utils";

// Contoh penggunaan
const imagePath = "/images/avatar.jpg";
const fullUrl = buildImageUrl(imagePath);
// Hasil: "https://api.karirkit.id/images/avatar.jpg"

// Jika path sudah full URL, akan dikembalikan apa adanya
const fullImageUrl = "https://example.com/image.jpg";
const result = buildImageUrl(fullImageUrl);
// Hasil: "https://example.com/image.jpg"

// Jika path null atau undefined, akan mengembalikan string kosong
const emptyResult = buildImageUrl(null);
// Hasil: ""
```

## Implementasi di Komponen

### 1. Avatar Component

```typescript
import { buildImageUrl } from "@/lib/utils";

<Avatar className="h-24 w-24">
  <AvatarImage src={buildImageUrl(user.avatar)} />
  <AvatarFallback>
    {user.name.charAt(0)}
  </AvatarFallback>
</Avatar>
```

### 2. Image Gallery

```typescript
import { buildImageUrl } from "@/lib/utils";

{portfolio.medias.map((media) => (
  <img
    key={media.id}
    src={buildImageUrl(media.path)}
    alt={media.caption}
    className="w-full h-full object-cover"
  />
))}
```

### 3. Upload Preview

```typescript
import { buildImageUrl } from "@/lib/utils";

// Saat menampilkan preview dari API response
<img
  src={buildImageUrl(preview)}
  alt="Preview"
  className="w-full h-full object-cover"
/>
```

## Catatan Penting

1. Fungsi ini secara otomatis menggunakan `VITE_APP_API_URL` dari environment variables
2. Jika path sudah berupa full URL (dimulai dengan http:// atau https://), fungsi akan mengembalikannya apa adanya
3. Jika path null atau undefined, fungsi akan mengembalikan string kosong
4. Fungsi ini menangani penghapusan leading slash untuk menghindari double slash

## Komponen yang Sudah Diupdate

1. `src/pages/CVShow.tsx` - Untuk foto profil CV
2. `src/pages/PortfolioShow.tsx` - Untuk cover dan media portfolio
3. `src/components/cv/PhotoUpload.tsx` - Untuk preview foto CV
4. `src/components/portfolios/CoverUpload.tsx` - Untuk preview cover portfolio
5. `src/components/portfolios/MediaUpload.tsx` - Untuk preview media portfolio
6. `src/features/account/components/ProfileForm.tsx` - Untuk avatar profil pengguna

## Best Practices

1. Selalu gunakan `buildImageUrl` saat menampilkan gambar dari API response
2. Jangan hardcode base URL API di komponen
3. Pastikan environment variable `VITE_APP_API_URL` sudah diatur dengan benar
4. Untuk gambar lokal atau base64, fungsi ini akan mengembalikan path aslinya