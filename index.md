---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "RAION INTERNSHIP\n2026 🦁"
  text: ""
  tagline: Mobile Development Learning Path.
  actions:
    - theme: brand
      text: Raion Community Instagram
      link: https://www.instagram.com/raion_community/
    - theme: alt
      text: Jetpack Compose Official Website
      link: https://developer.android.com/compose
    - theme: alt
      text: Kotlin Playground
      link: https://play.kotlinlang.org/

features:
  - icon: 📱
    title: Instalasi Android Studio
    details: Android Studio adalah IDE resmi dari Google untuk mengembangkan aplikasi Android.
    link: ./src/0_instalasi_android_studio

  - icon: 💜
    title: Pengenalan Kotlin
    details: Kotlin adalah bahasa pemrograman modern yang dirancang oleh JetBrains dan pertama kali diumumkan pada tahun 2011.
    link: ./src/1_pengenalan_kotlin/a_pengertian

  - icon: 💚
    title: Pengenalan Jetpack Compose
    details: Jetpack Compose adalah toolkit modern dan deklaratif untuk membangun antarmuka pengguna (UI) di aplikasi Android.
    link: ./src/2_pengenalan_compose/a_pengertian

  - icon: 🚩
    title: Pengenalan State
    details: State dalam konteks Jetpack Compose merujuk pada data yang mempengaruhi tampilan antarmuka pengguna (UI) dari komponen tertentu.
    link: ./src/3_pengenalan_state/a_state

  - icon: 📍
    title: Pengenalan Navigation
    details: Navigation dalam Jetpack Compose adalah mekanisme yang memungkinkan pengguna berpindah antara berbagai layar (screens) dalam aplikasi.
    link: ./src/4_pengenalan_navigation/a_setup

  - icon: 🔥
    title: Pengenalan MVVM
    details: MVVM, atau Model-View-ViewModel, adalah pola arsitektur yang dirancang untuk memisahkan logika bisnis dari antarmuka pengguna (UI).
    link: ./src/5_pengenalan_mvvm/a_pengertian

  - icon: 🪢
    title: Pengenalan Debugging
    details: Dalam proses pembuatan aplikasi tentu sedikitnya akan mengalami error, melalui debugging kita bisa mengecek letak kesalahan tersebut untuk kemudian diperbaiki
    link: ./src/6_pengenalan_debugging/a_pengertian

  - icon: ⏹️
    title: Pengenalan Supabase
    details: Supabase merupakan database noSQL yang dapat digunakan untuk menyimpan data mulai dari autentikasi, gambar/video, dan berbagai tipe data
    link: ./src/7_pengenalan_supabase/a_setup

---

## Explore Lebih Lanjut! 📺

<div class="video-container">
  <iframe width="300" height="170" src="https://www.youtube.com/embed/6_wK_Ud8--0" frameborder="0" allowfullscreen></iframe>
  <iframe width="300" height="170" src="https://www.youtube.com/embed/FIEnIBq7Ups" frameborder="0" allowfullscreen></iframe>
  <iframe width="300" height="170" src="https://www.youtube.com/embed/bOd3wO0uFr8" frameborder="0" allowfullscreen></iframe>
  <iframe width="300" height="170" src="https://www.youtube.com/embed/zCIfBbm06QM" frameborder="0" allowfullscreen></iframe>
  <iframe width="300" height="170" src="https://www.youtube.com/embed/ek682t-z2gQ" frameborder="0" allowfullscreen></iframe>
  <iframe width="300" height="170" src="https://www.youtube.com/embed/_iXUVJ6HTHU?si=0oYz9jsPOu6wZWHp" frameborder="0" allowfullscreen></iframe>
  <iframe width="300" height="170" src="https://www.youtube.com/embed/ZgYvexniGDA?si=VTX_JSrQ5acvtpld" frameborder="0" allowfullscreen></iframe>
  <iframe width="300" height="170" src="https://www.youtube.com/embed/BqxI7ViS_-M?si=ruBrdtoQ_soo4Ega" frameborder="0" allowfullscreen></iframe>

</div>

<style>
  .video-container {
    display: flex;
    overflow-x: auto;
    gap: 16px;
    padding: 16px 0;
  }

  .video-container iframe {
    flex: 0 0 auto;
  }

  .video-container::-webkit-scrollbar {
    display: none;
  }

</style>

<hr>

# Connect with us!

Meet the incredible team that made this module possible. Feel free to reach out and get to know the people behind the scenes!

<script setup>
import { VPTeamMembers } from 'vitepress/theme'
// Import 'leadCoLead' dan gunakan di template
import { leadCoLead } from './models/team-members' 
</script>

<VPTeamMembers size="medium" :members="leadCoLead" />