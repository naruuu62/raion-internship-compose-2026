---
outline: deep
title: Setup Supabase di Compose
next: 
  text: "Autentikasi Supabase di Jetpack Compose 🔐"
  link: "../../b_autentikasi"
---

# Setup Supabase di Jetpack Compose 🚀

Supabase adalah alternatif *open-source* dari Firebase yang menggunakan **PostgreSQL** sebagai *database* utamanya. Supabase sangat cocok dipadukan dengan Jetpack Compose karena ekosistem *library* Kotlin-nya sudah sangat matang dan mendukung *coroutines* secara *native*.

Pada materi ini, kita akan belajar cara menghubungkan *project* Android kita dengan Supabase menggunakan *library* resmi **Supabase Kotlin**.

---

## 1. Persiapan di Dashboard Supabase

Langkah pertama adalah menyiapkan *backend* Supabase kita:

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan *login* menggunakan akun GitHub/Google.
2. Klik **"New Project"**, pilih *Organization*, dan beri nama *project* (misal: `Raion-Intern-App`).
3. Buat *password* untuk *database* (simpan baik-baik) dan pilih *region* terdekat (misal: Singapore agar latensi lebih rendah).
4. Tunggu beberapa menit sampai proses *provisioning database* selesai.

### Dapatkan API Keys
Setelah *project* siap, kita butuh URL dan Anon Key untuk dihubungkan ke Android:
1. Pergi ke menu **Project Settings** (ikon roda gigi di *sidebar* bawah).
2. Pilih menu **API**.
3. Salin **Project URL** dan **anon / public key**. Kita akan memasukkan nilai ini ke dalam kode Android Studio nanti.

---

## 2. Setup Dependencies di Android Studio

Buka *project* Jetpack Compose kamu. Kita perlu menambahkan *library* Supabase Kotlin, Ktor (sebagai *HTTP client*), dan Kotlinx Serialization.

Buka file `build.gradle.kts (Module :app)` dan tambahkan plugin *serialization* di bagian paling atas (di dalam blok `plugins`):

```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.jetbrains.kotlin.android)
    // Tambahkan plugin ini untuk parsing JSON
    id("org.jetbrains.kotlin.plugin.serialization") version "1.9.0" 
}
```

Lalu gulir ke bawah ke bagian `dependencies` dan tambahkan:

```kotlin
dependencies {
    // ... dependency bawaan Compose lainnya

    // Supabase Kotlin BOM (Bill of Materials) agar versinya seragam
    implementation(platform("io.github.jan-tennert.supabase:bom:3.0.0"))
    
    // Module Supabase yang dipakai (PostgREST untuk akses database relational)
    implementation("io.github.jan-tennert.supabase:postgrest-kt")
    
    // Ktor client engine (Wajib ada agar Supabase bisa melakukan request jaringan)
    implementation("io.ktor:ktor-client-android:2.3.12")
    
    // Kotlinx Serialization untuk mapping JSON dari database ke Data Class Kotlin
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.3")
}
```

Setelah itu, jangan lupa klik **Sync Now** di pojok kanan atas Android Studio.

---

## 3. Tambahkan Izin Internet 🌐

Aplikasi kita butuh akses internet untuk mengambil data dari *server* Supabase. Buka file `AndroidManifest.xml` (ada di folder `manifests`) dan tambahkan baris ini tepat di atas tag `<application>`:

```xml
<manifest xmlns:android="[http://schemas.android.com/apk/res/android](http://schemas.android.com/apk/res/android)"
    package="com.raion.internapp">

    <uses-permission android:name="android.permission.INTERNET" />

    <application>
        </application>
</manifest>
```
---

## 4. Inisialisasi Supabase Client

Kita perlu membuat satu *instance* Supabase yang bisa dipanggil dari seluruh bagian aplikasi tanpa harus dibuat berulang-ulang. 

Buat *package* baru bernama `data` atau `network`, lalu buat file Kotlin bernama `SupabaseClient.kt`:

```kotlin
package com.raion.internapp.network // Sesuaikan dengan package kamu

import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest

object SupabaseClient {
    // GANTI dengan URL dan Key dari dashboard Supabase kamu
    private const val SUPABASE_URL = "[https://xyz.supabase.co](https://xyz.supabase.co)"
    private const val SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR..."

    val client = createSupabaseClient(
        supabaseUrl = SUPABASE_URL,
        supabaseKey = SUPABASE_KEY
    ) {
        install(Postgrest) // Mengaktifkan modul PostgREST (Database)
    }
}
```
---

## 5. Membuat Model Data

Misalkan di Supabase kita sudah membuat tabel bernama `mahasiswa` dengan kolom `id` (int) dan `nama` (text). Kita buat *Data Class* di Kotlin yang strukturnya sama persis agar datanya bisa di-*mapping* secara otomatis.

Buat file `Mahasiswa.kt`:

```kotlin
package com.raion.internapp.data // Sesuaikan dengan package kamu

import kotlinx.serialization.Serializable

@Serializable
data class Mahasiswa(
    val id: Int,
    val nama: String
)
```
---

## 6. Mengambil dan Menampilkan Data di Compose UI

Sekarang kita buat UI-nya. Di contoh dasar ini, kita menggunakan `LaunchedEffect` untuk menjalankan *coroutine* dan mengambil data saat layar pertama kali dibuka. 

Buat file *Composable* baru, misalnya `MahasiswaScreen.kt`:

```kotlin
package com.raion.internapp.ui // Sesuaikan dengan package kamu

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.raion.internapp.data.Mahasiswa // Sesuaikan import
import com.raion.internapp.network.SupabaseClient // Sesuaikan import
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

@Composable
fun MahasiswaScreen() {
    // State untuk menyimpan daftar mahasiswa dan status loading/error
    var listMahasiswa by remember { mutableStateOf<List<Mahasiswa>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf("") }

    // Mengambil data dari Supabase secara asinkron (Background Thread)
    LaunchedEffect(Unit) {
        withContext(Dispatchers.IO) {
            try {
                // Proses fetch data dari tabel "mahasiswa"
                val response = SupabaseClient.client
                    .from("mahasiswa")
                    .select()
                    .decodeList<Mahasiswa>()
                
                listMahasiswa = response
            } catch (e: Exception) {
                errorMessage = e.message ?: "Terjadi kesalahan yang tidak diketahui"
            } finally {
                isLoading = false
            }
        }
    }

    // Tampilan UI
    Column(
        modifier = Modifier
            .padding(16.dp)
            .fillMaxSize()
    ) {
        Text(
            text = "Data Mahasiswa Internship",
            style = MaterialTheme.typography.headlineSmall
        )
        
        Spacer(modifier = Modifier.height(16.dp))

        when {
            isLoading -> {
                CircularProgressIndicator()
            }
            errorMessage.isNotEmpty() -> {
                Text(text = "Error: $errorMessage", color = MaterialTheme.colorScheme.error)
            }
            listMahasiswa.isEmpty() -> {
                Text(text = "Belum ada data di database.")
            }
            else -> {
                LazyColumn {
                    items(listMahasiswa) { mhs ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                        ) {
                            Text(
                                text = "${mhs.id} - ${mhs.nama}",
                                modifier = Modifier.padding(16.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}
```

### Selamat! 🎉
Kamu sudah berhasil mengatur dan menghubungkan aplikasi Jetpack Compose dengan Supabase. Proses pengambilan datanya pun sudah berjalan secara asinkron sehingga tidak membuat UI aplikasi menjadi *freeze* (macet).

> **💡 Best Practice:**
> Untuk tahap pengembangan selanjutnya, logika pemanggilan database (`SupabaseClient.client.from...`) sangat disarankan untuk dipindahkan ke dalam lapisan **Repository** dan **ViewModel** sesuai dengan pola arsitektur **MVVM** yang sudah dipelajari pada bab sebelumnya.