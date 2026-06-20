# GitBlogMD 📝

**GitBlogMD** adalah aplikasi web ringan berbasis HTML, CSS, JS, dan LocalStorage yang dirancang khusus untuk mempermudah alur kerja penulisan blog statis di GitHub Pages dengan tema Jekyll. Aplikasi ini mendukung penuh pembuatan blog untuk **Skenario 1** (Tema Jekyll bawaan) maupun **Skenario 2** (Tema Jekyll kustom dari komunitas menggunakan build otomatis GitHub Actions).

Aplikasi ini berfungsi sebagai **Markdown Generator** yang dilengkapi toolbar visual sekaligus menyediakan **Panduan Interaktif Lengkap** dari awal hingga blog Anda online.

---

## 🚀 Fitur Utama

1. **Jekyll Front Matter Generator**:
   * Masukkan Judul, Tanggal, Layout, Kategori, dan Tag secara visual.
   * Format metadata diubah menjadi header YAML front-matter yang valid secara otomatis.
2. **Auto-Sluggify Filename**:
   * Nama file keluaran dibuat secara otomatis mengikuti format konvensi Jekyll: `YYYY-MM-DD-judul-slug.md`.
3. **Editor Formatting Toolbar Helper**:
   * Tombol pintas sekali klik untuk memasukkan tag Markdown umum: **Tebal**, *Miring*, Judul (Heading), Tautan (Link), Blok Kode, Kutipan (Blockquote), Daftar (List Bullets/Numbers), dan Gambar.
4. **Live Preview Editor**:
   * Tinjau langsung tampilan rendering HTML dari artikel Markdown yang sedang Anda ketik di sisi editor.
5. **Draft Manager (LocalStorage)**:
   * Simpan tulisan Anda secara lokal ke memori browser. Anda dapat mengedit, menghapus, atau mendownload draft lama kapan saja tanpa takut kehilangan data.
6. **One-Click Actions**:
   * **Download .md**: Unduh file langsung dengan ekstensi `.md` yang siap diunggah ke folder `_posts` repositori GitHub Anda.
   * **Salin Konten**: Salin seluruh isi file beserta Front Matter ke clipboard dalam satu ketukan.
7. **Panduan Komprehensif Terintegrasi**:
   * Buku panduan interaktif step-by-step untuk **Skenario 1** (Jekyll bawaan) dan **Skenario 2** (Jekyll kustom komunitas + GitHub Actions workflow).

---

## 📂 Struktur Berkas

* **`index.html`**: Halaman struktural utama aplikasi, toolbar editor, sidebar navigasi, form input, dan konten tutorial.
* **`style.css`**: Lembar gaya dengan tema *dark mode* modern, efek *glassmorphism*, font *Outfit* & *Fira Code*, serta desain yang responsif di HP Android.
* **`app.js`**: Logika pengontrol, helper pemformatan teks, live-preview parser, manajemen state penyimpanan `localStorage`, generator slug, dan penanganan file unduhan.
* **`README.md`**: Dokumen panduan repositori ini.

---

## 💻 Cara Menjalankan Aplikasi

### 1. Dijalankan Secara Offline di HP/Komputer
Karena menggunakan HTML/JS murni, Anda dapat membukanya secara langsung:
* Buka file manager Anda, lalu buka file **`index.html`** menggunakan browser pilihan Anda (Google Chrome, Firefox, dll).

### 2. Menggunakan Web Server Lokal (Termux/Terminal)
Jika Anda menggunakan Termux di Android atau Terminal di komputer:
```bash
# Pindah ke direktori proyek
cd gitblogmd

# Jalankan server HTTP lokal Python
python3 -m http.server 8080
```
Setelah server berjalan, buka browser dan akses alamat: **`http://localhost:8080`**

### 3. Dihosting di GitHub Pages (Online)
Anda dapat mempublikasikan repositori ini di GitHub Pages secara gratis:
1. Buka repositori ini di GitHub Anda.
2. Masuk ke **Settings** -> **Pages**.
3. Di bawah **Build and deployment**, atur Source ke **Deploy from a branch**.
4. Pilih branch **`main`** dan folder **`/ (root)`**, lalu klik **Save**.
5. Situs generator Anda akan aktif di `https://<username>.github.io/gitblogmdgen/`.

---

## 🛠️ Lisensi
Proyek ini gratis untuk digunakan dan dimodifikasi untuk kebutuhan penulisan blog pribadi Anda.
