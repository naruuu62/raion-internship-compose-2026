---
outline: deep
title: Storage Supabase di Compose
---

# Storage Supabase di Jetpack Compose 📦

Database PostgreSQL sangat hebat untuk menyimpan teks dan angka, tapi bagaimana jika kita ingin menyimpan *file* seperti foto, video, atau dokumen PDF? Di sinilah **Supabase Storage** berperan.

Supabase Storage adalah layanan penyimpanan objek (seperti AWS S3) yang terintegrasi langsung dengan ekosistem Supabase. Pada modul ini, kita akan belajar cara mengunggah (*upload*) gambar dari galeri HP ke Supabase.

---

## Step 1: Membuat Bucket di Dashboard Supabase

*File* di Supabase Storage disimpan di dalam semacam folder besar yang disebut **Bucket**.

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan pilih *project* kamu.
2. Buka menu **Storage** (ikon folder di *sidebar* kiri).
3. Klik tombol **New Bucket**.
4. Beri nama bucket, misalnya: `images`.
5. **Penting:** Centang opsi **Public bucket**. Ini akan membuat *file* yang ada di dalamnya bisa diakses langsung via URL biasa (cocok untuk foto profil atau *banner* artikel).
6. Klik **Save**.

> **⚠️ Kebijakan Keamanan (Policies):**
> Sama seperti *Database*, Storage juga dilindungi oleh RLS (Row Level Security). Agar kita bisa mengunggah file dari aplikasi untuk keperluan *testing*, klik tulisan **Policies** di bucket `images` kamu, lalu buat *policy* baru yang mengizinkan operasi `INSERT` dan `SELECT` untuk semua pengguna (atau matikan RLS sementara).

---

## Step 2: Menambahkan Module Storage

Pastikan *library* Storage sudah ada di `build.gradle.kts (Module :app)` kamu. Jika kamu sudah memakai BOM Supabase di materi awal, cukup tambahkan baris ini:

```kotlin
dependencies {
    // ... dependency supabase lainnya
    implementation("io.github.jan-tennert.supabase:storage-kt")
}
Jangan lupa **Sync Now** di Android Studio.

Selanjutnya, aktifkan modul Storage di file konfigurasi `SupabaseClient.kt` kamu:

```kotlin
import io.github.jan.supabase.storage.Storage
import kotlin.time.Duration.Companion.seconds

// ... di dalam blok createSupabaseClient ...
install(Storage) {
    transferTimeout = 90.seconds // Waktu maksimal untuk upload file besar
}

```
---

## Step 3: Logika Upload File di Android

Di Android, saat pengguna memilih foto dari Galeri, kita tidak mendapatkan *file* utuh, melainkan sebuah `Uri` (alamat lokasi file di memori HP). Sedangkan Supabase membutuhkan data mentah berupa `ByteArray`.

Berikut adalah konsep dasar untuk mengubah `Uri` menjadi `ByteArray` dan mengunggahnya ke Supabase:

```kotlin
// 1. Buka jalur (stream) untuk membaca file dari Uri
val inputStream = context.contentResolver.openInputStream(uri)

// 2. Ubah file menjadi bentuk ByteArray
val byteArray = inputStream?.readBytes() ?: throw Exception("Gagal membaca file")

// 3. Upload ke bucket 'images' di Supabase
val bucket = supabase.storage.from("images")
bucket.upload(
    path = namaFile, 
    data = byteArray, 
    upsert = true // True: Jika nama file sama, timpa file lama
)

// 4. Dapatkan URL Publik dari gambar yang baru di-upload
val publicUrl = bucket.publicUrl(namaFile)

```
---

## Step 4: Implementasi UI Upload Foto (Photo Picker)

Mari kita buat antarmuka Jetpack Compose yang memiliki tombol untuk membuka Galeri bawaan Android (**Photo Picker**), lalu mengunggah foto yang dipilih ke Supabase.

Buat file `UploadScreen.kt`:

```kotlin
package com.example.authexample.presentation.components

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.example.authexample.network.SupabaseClient.client // Sesuaikan import client-mu
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.UUID

@Composable
fun UploadScreen() {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    
    // State UI
    var selectedImageUri by remember { mutableStateOf<Uri?>(null) }
    var uploadedUrl by remember { mutableStateOf("") }
    var isUploading by remember { mutableStateOf(false) }

    // Launcher untuk membuka Galeri Android (Photo Picker)
    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia(),
        onResult = { uri ->
            // Simpan Uri gambar yang dipilih oleh user
            selectedImageUri = uri 
        }
    )

    Column(
        modifier = Modifier.padding(24.dp).fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Supabase Storage", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(32.dp))

        // Tombol Pilih Gambar
        Button(onClick = {
            // Membuka galeri, hanya menampilkan gambar
            photoPickerLauncher.launch(
                androidx.activity.result.PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
            )
        }) {
            Text("Pilih Gambar dari Galeri")
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Jika user sudah memilih gambar, tampilkan tombol Upload
        if (selectedImageUri != null) {
            Text("Gambar dipilih! Siap diunggah.")
            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = {
                    coroutineScope.launch {
                        isUploading = true
                        try {
                            // Pindah ke background thread (IO) untuk operasi berat
                            withContext(Dispatchers.IO) {
                                // Bikin nama file unik pakai UUID biar gak bentrok
                                val namaFileUnik = "foto_${UUID.randomUUID()}.jpg"
                                
                                // Proses baca Uri ke ByteArray
                                val bytes = context.contentResolver.openInputStream(selectedImageUri!!)?.readBytes()
                                    ?: throw Exception("Gagal membaca gambar")

                                // Upload ke bucket "images"
                                val bucket = client.storage.from("images")
                                bucket.upload(
                                    path = namaFileUnik,
                                    data = bytes,
                                    upsert = true
                                )

                                // Dapatkan URL publiknya
                                uploadedUrl = bucket.publicUrl(namaFileUnik)
                            }
                        } catch (e: Exception) {
                            println("Upload gagal: ${e.message}")
                        } finally {
                            isUploading = false
                        }
                    }
                },
                enabled = !isUploading
            ) {
                if (isUploading) {
                    CircularProgressIndicator(modifier = Modifier.size(20.dp), color = MaterialTheme.colorScheme.onPrimary)
                } else {
                    Text("Upload ke Supabase")
                }
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // Tampilkan Hasil URL
        if (uploadedUrl.isNotEmpty()) {
            Text("✅ Berhasil Diunggah!", color = MaterialTheme.colorScheme.primary)
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = uploadedUrl,
                onValueChange = {},
                readOnly = true,
                label = { Text("URL Gambar Kamu") },
                modifier = Modifier.fillMaxWidth()
            )
            
            // Tips: Kamu bisa menggunakan library 'Coil' untuk merender URL ini menjadi gambar sungguhan di UI!
        }
    }
}
