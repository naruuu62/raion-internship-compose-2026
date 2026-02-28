---
outline: deep
title: Setup Supabase di Compose
next: 
  text: "Storage Supabase di Jetpack Compose 📦"
  link: "../../d_storage"
---

# Database Supabase (PostgreSQL) di Jetpack Compose 🗄️

Berbeda dengan Firebase yang menggunakan NoSQL, Supabase berjalan di atas **PostgreSQL**, salah satu *database* relasional paling tangguh di dunia. 

Kabar baiknya, *library* `postgrest-kt` dari Supabase memungkinkan kita melakukan operasi **CRUD** (Create, Read, Update, Delete) di Android dengan sangat mudah tanpa harus menulis *query* SQL manual!

Pada modul ini, kita akan belajar cara menghubungkan tabel di Supabase ke aplikasi Jetpack Compose kita.

---

## Step 1: Membuat Tabel di Dashboard Supabase

Sebelum *ngoding*, kita harus menyiapkan rumah untuk data kita terlebih dahulu.

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan pilih *project* kamu.
2. Buka menu **Table Editor** (ikon tabel di *sidebar* kiri).
3. Klik tombol **Create a new table**.
4. Isi konfigurasi berikut:
   * **Name**: `tugas`
   * Centang **Enable Row Level Security (RLS)** (Kita akan bahas ini nanti).
5. Tambahkan kolom (Columns):
   * `id` : tipe `int8`, centang *Primary*, atur *Default Value* ke `Is Identity` (agar *auto-increment*).
   * `judul` : tipe `text`.
   * `status_selesai` : tipe `boolean`, *Default Value* ke `FALSE`.
6. Klik **Save**.

> **⚠️ Penting Soal RLS (Row Level Security):**
> Secara *default*, Supabase mengunci tabel agar tidak bisa dibaca/ditulis sembarangan. Untuk keperluan *testing* modul ini, kamu bisa mematikan RLS sementara dengan cara: Buka menu **Authentication** -> **Policies** -> Pada tabel `tugas`, klik **Disable RLS**. Pastikan untuk menyalakannya kembali saat aplikasimu sudah rilis!

---

## Step 2: Konfigurasi Supabase Client (Review)

Pastikan di file konfigurasi `SupabaseClient` kamu, modul `Postgrest` sudah terpasang. 

> **💡 Pro-Tip:** Tambahkan `PropertyConversionMethod.CAMEL_CASE_TO_SNAKE_CASE` agar otomatis mengubah format penamaan variabel `camelCase` di Kotlin (seperti `statusSelesai`) menjadi `snake_case` di *database* (`status_selesai`). Ini sangat menghemat waktu!

```kotlin
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.postgrest.PropertyConversionMethod

install(Postgrest) {
    defaultSchema = "public"
    propertyConversionMethod = PropertyConversionMethod.CAMEL_CASE_TO_SNAKE_CASE
}
---
```
## Step 3: Membuat Data Model (Data Class)

Buat *Data Class* di Kotlin untuk merepresentasikan tabel `tugas` yang baru kita buat. Jangan lupa tambahkan anotasi `@Serializable` agar datanya bisa diubah dari/ke format JSON secara otomatis oleh Supabase saat *request* dan *response*.

Buat file `TugasModel.kt`:

```kotlin
package com.example.authexample.domain.model // Sesuaikan dengan package-mu

import kotlinx.serialization.Serializable

@Serializable
data class TugasModel(
    val id: Long? = null, // Nullable agar database yang mengisinya otomatis saat Insert
    val judul: String,
    val statusSelesai: Boolean = false // Otomatis terbaca sebagai status_selesai di DB berkat rule CAMEL_CASE_TO_SNAKE_CASE
)

```
---

## Step 4: Operasi CRUD Dasar

Berikut adalah cara kita memanipulasi data di tabel `tugas` menggunakan *Coroutine*. Di proyek nyata, sangat disarankan untuk meletakkan fungsi-fungsi ini di dalam **Repository** atau **ViewModel** agar kode UI tetap bersih.

### 1. Read (Membaca Data)
Mengambil semua data dari tabel `tugas`.
```kotlin
suspend fun getSemuaTugas(): List<TugasModel> {
    return supabase.postgrest.from("tugas")
        .select()
        .decodeList<TugasModel>()
}

```
### 2. Create (Menambah Data)
Memasukkan baris baru. Kita tidak perlu mengirim `id` karena *database* akan mengaturnya secara *auto-increment*.
```kotlin
suspend fun tambahTugas(judulBaru: String) {
    val tugasBaru = TugasModel(judul = judulBaru)
    
    supabase.postgrest.from("tugas")
        .insert(tugasBaru)
}

```
### 3. Update (Mengubah Data)
Misalnya kita ingin menandai tugas sebagai "selesai" berdasarkan ID-nya.
```kotlin
suspend fun tandaiSelesai(tugasId: Long) {
    supabase.postgrest.from("tugas").update(
        {
            set("status_selesai", true) // Kolom di DB yang mau diubah
        }
    ) {
        filter { eq("id", tugasId) } // Kondisi WHERE id = tugasId
    }
}

```
### 4. Delete (Menghapus Data)
Menghapus baris berdasarkan ID tertentu.
```kotlin
suspend fun hapusTugas(tugasId: Long) {
    supabase.postgrest.from("tugas").delete {
        filter { eq("id", tugasId) }
    }
}