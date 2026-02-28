---
outline: deep
title: Setup Supabase di Compose
next: 
  text: "Database Supabase (PostgreSQL) di Jetpack Compose 🗄️"
  link: "../../c_database"
---

# Autentikasi Supabase di Jetpack Compose 🔐

Pada modul ini, kita akan belajar cara mengimplementasikan fitur autentikasi menggunakan **Supabase** di dalam aplikasi Android berbasis **Jetpack Compose**. Kita akan membuat fitur **Login dan Register menggunakan Email/Password**, serta mengintegrasikan **Google Sign-In**.

Sebelum masuk ke kodenya, mari kita pahami dulu opsi yang kita miliki. Di ekosistem Supabase Android, ada **tiga cara utama** untuk menerapkan Login dengan Google:

### 3 Cara Google Authentication

| Fitur / Metode | 1. `composeAuth` (Native) | 2. Web OAuth | 3. Manual Token (Native) |
| :--- | :--- | :--- | :--- |
| **Deskripsi** | Cara paling modern khusus untuk Jetpack Compose. Menampilkan *bottom sheet* (Google One Tap) bawaan HP. | Cara standar (Universal). Membuka *browser* Chrome Custom Tabs untuk login, lalu *redirect* balik ke aplikasi. | Menulis kode *Credential Manager* Android murni dari nol untuk menangkap `IdToken` dari Google. |
| **Kelebihan** | Kodenya sangat ringkas & UX sangat mulus karena menggunakan UI bawaan OS. | Sangat stabil, paling mudah di-setup di Supabase, & jalan di HP tanpa Google Play Services. | Kontrol penuh atas arsitektur aplikasi (bisa untuk XML atau ViewModel murni). |
| **Kekurangan** | Wajib pakai framework Jetpack Compose. | UX kurang mulus (harus pindah ke *browser* sebentar). Butuh setup *Deep Link* di AndroidManifest. | Kodenya sangat panjang dan rumit (*boilerplate* tinggi). |

> **💡 Catatan:** Pada panduan ini, kita akan menggunakan metode **`composeAuth` Native** karena ini adalah *best practice* dan cara paling efisien untuk Jetpack Compose saat ini.

---

## 1. Setup Dependencies Tambahan

Kita perlu menambahkan *library* khusus Auth dari Supabase. Buka file `build.gradle.kts (Module :app)` dan tambahkan baris ini di dalam blok `dependencies`:

```kotlin
dependencies {
    // ... dependency supabase bom dan postgrest dari materi sebelumnya

    // Modul Auth dasar (GoTrue) untuk Autentikasi Email & Password
    implementation("io.github.jan-tennert.supabase:gotrue-kt")
    
    // Modul khusus untuk mempermudah integrasi Google Auth Native di Compose
    implementation("io.github.jan-tennert.supabase:compose-auth")
    implementation("io.github.jan-tennert.supabase:compose-auth-ui")
}

Jangan lupa klik **Sync Now** di Android Studio.

---
```

## 2. Inisialisasi Supabase Client

Buka kembali file konfigurasi `SupabaseClient.kt` kamu. Kita perlu menambahkan instalasi modul `Auth` (untuk Email) dan `ComposeAuth` (untuk Google). 

> **⚠️ Penting:** Jika kamu menggunakan Google Sign-In, kamu wajib memasukkan **Web Client ID** yang didapatkan dari Google Cloud Console.

```kotlin
package com.raion.internapp.network // Sesuaikan dengan nama package-mu

import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.Auth
import io.github.jan.supabase.compose.auth.ComposeAuth
import io.github.jan.supabase.compose.auth.googleNativeLogin
import io.github.jan.supabase.postgrest.Postgrest

object SupabaseClient {
    private const val SUPABASE_URL = "[https://xyz.supabase.co](https://xyz.supabase.co)"
    private const val SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR..."
    
    // Web Client ID dari Google Cloud Console
    private const val GOOGLE_CLIENT_ID = "ISI_DENGAN_WEB_CLIENT_ID_KAMU.apps.googleusercontent.com"

    val client = createSupabaseClient(
        supabaseUrl = SUPABASE_URL,
        supabaseKey = SUPABASE_KEY
    ) {
        install(Postgrest) // Modul Database
        
        install(Auth) // Modul Autentikasi Dasar (Untuk Email)
        
        install(ComposeAuth) { // Modul khusus Compose Auth (Untuk Google)
            googleNativeLogin(serverClientId = GOOGLE_CLIENT_ID)
        }
    }
}

---
```
## 3. Membuat Halaman Login (UI & Logika)

Sekarang, mari kita buat antarmuka *login*-nya. Buat file baru bernama `LoginScreen.kt`. 

Di sini kita menggabungkan form untuk **Email/Password** dan tombol **Google Sign-In**. Kita juga menambahkan parameter `onAuthSuccess` berupa fungsi *callback* yang akan memberitahu aplikasi kapan harus pindah halaman setelah login sukses. 

```kotlin
package com.raion.internapp.ui // Sesuaikan dengan nama package-mu

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.raion.internapp.network.SupabaseClient
import io.github.jan.supabase.compose.auth.composable.rememberSignInWithGoogle
import io.github.jan.supabase.compose.auth.composeAuth
import io.github.jan.supabase.compose.auth.ui.NativeSignInResult
import io.github.jan.supabase.gotrue.auth
import io.github.jan.supabase.gotrue.providers.builtin.Email
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(
    onAuthSuccess: () -> Unit // Callback navigasi jika login sukses
) {
    val coroutineScope = rememberCoroutineScope()
    
    // State untuk input teks
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var statusMessage by remember { mutableStateOf("") }

    // 1. Setup Logika Google Login (composeAuth)
    // Ingat: fungsi remember... harus dipanggil di root Composable!
    val googleLoginAction = SupabaseClient.client.composeAuth.rememberSignInWithGoogle(
        onResult = { result ->
            when (result) {
                is NativeSignInResult.Success -> {
                    // Jika sukses dari Google, trigger navigasi
                    onAuthSuccess()
                }
                is NativeSignInResult.Error -> statusMessage = "Error: ${result.message}"
                is NativeSignInResult.ClosedByUser -> statusMessage = "Login dibatalkan."
                is NativeSignInResult.NetworkError -> statusMessage = "Gagal koneksi internet."
            }
        },
        fallback = {
            statusMessage = "Fitur Native tidak didukung, butuh fallback ke browser."
        }
    )

    Column(
        modifier = Modifier.padding(24.dp).fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Autentikasi Supabase", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(24.dp))

        // Input Email
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(8.dp))

        // Input Password
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(16.dp))

        // 2. Tombol Login & Register lewat Email
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            Button(onClick = {
                coroutineScope.launch {
                    try {
                        // Memanggil API Sign In Email Supabase
                        SupabaseClient.client.auth.signInWith(Email) {
                            this.email = email
                            this.password = password
                        }
                        onAuthSuccess() // Trigger navigasi jika sukses
                    } catch (e: Exception) {
                        statusMessage = "Login Gagal: ${e.message}"
                    }
                }
            }) { Text("Login Email") }

            OutlinedButton(onClick = {
                coroutineScope.launch {
                    try {
                        // Memanggil API Sign Up Email Supabase
                        SupabaseClient.client.auth.signUpWith(Email) {
                            this.email = email
                            this.password = password
                        }
                        statusMessage = "Register Berhasil! Silakan cek email/login."
                    } catch (e: Exception) {
                        statusMessage = "Register Gagal: ${e.message}"
                    }
                }
            }) { Text("Register Email") }
        }

        Spacer(modifier = Modifier.height(24.dp))
        Text("ATAU")
        Spacer(modifier = Modifier.height(24.dp))

        // 3. Tombol Login lewat Google
        FilledTonalButton(
            onClick = { 
                // Memicu munculnya Bottom Sheet Google
                googleLoginAction.startFlow() 
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Login dengan Google")
        }

        Spacer(modifier = Modifier.height(24.dp))
        
        // Menampilkan pesan error/sukses
        if (statusMessage.isNotEmpty()) {
            Text(text = statusMessage, color = MaterialTheme.colorScheme.error)
        }
    }
}
