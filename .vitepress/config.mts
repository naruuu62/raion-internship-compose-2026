import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "RAION INTERNSHIP 2026",
  description: "Introduction to Kotlin and Jetpack Compose.",
  
  // Agar URL lebih bersih (misal: /src/materi bukan /src/materi.html)
  cleanUrls: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { 
        text: "Additional Resources", 
        link: "https://adhesive-eggnog-eca.notion.site/Kotlin-Fundamental-16b2b31e67b447209bc53c8095e363e0" 
      },
    ],

    sidebar: [
      {
        text: "Instalasi Android Studio 📱",
        // Mengarah ke file lokal: src/0_instalasi_android_studio.md
        link: "/src/0_instalasi_android_studio",
      },
      {
        text: "Pengenalan Kotlin 💜",
        items: [
          { text: "Pengertian dan Sejarah", link: "/src/1_pengenalan_kotlin/a_pengertian" },
          { text: "Variabel dan Tipe Data", link: "/src/1_pengenalan_kotlin/b_variabel" },
          { text: "Function", link: "/src/1_pengenalan_kotlin/c_function" },
          { text: "Konsep OOP", link: "/src/1_pengenalan_kotlin/d_oop" },
        ],
      },
      {
        text: "Pengenalan Compose 💚",
        items: [
          { text: "Pengertian dan Sejarah", link: "/src/2_pengenalan_compose/a_pengertian" },
          { text: "Composable Function", link: "/src/2_pengenalan_compose/b_composable" },
          { text: "UI Layout", link: "/src/2_pengenalan_compose/c_ui_layout" },
          { text: "Modifier", link: "/src/2_pengenalan_compose/d_modifier" },
          { text: "Material Design", link: "/src/2_pengenalan_compose/e_material_design" },
        ],
      },
      {
        text: "Pengenalan State 🚩",
        items: [
          { text: "Pengertian State", link: "/src/3_pengenalan_state/a_state" },
          { text: "State Hoisting", link: "/src/3_pengenalan_state/b_hoisting" },
          { text: "UI Events", link: "/src/3_pengenalan_state/c_ui_event" },
        ],
      },
      {
        text: "Pengenalan Navigation 📍",
        items: [
          { text: "Setup Navigation", link: "/src/4_pengenalan_navigation/a_setup" },
          { text: "Passing Data", link: "/src/4_pengenalan_navigation/b_passing_data" },
        ],
      },
      {
        text: "Pengenalan MVVM 🔥",
        items: [
          { text: "Pengertian MVVM", link: "/src/5_pengenalan_mvvm/a_pengertian" },
          { text: "API Interface", link: "/src/5_pengenalan_mvvm/b_api_interface" },
          { text: "Repository Pattern", link: "/src/5_pengenalan_mvvm/c_repository" },
          { text: "ViewModel Pattern", link: "/src/5_pengenalan_mvvm/d_viewmodel" },
          { text: "Dependency Injection", link: "/src/5_pengenalan_mvvm/e_di" },
        ],
      },
      {
        text: "Pengenalan Debugging 🪢",
        items: [
          { text: "Pengertian Debugging", link: "/src/6_pengenalan_debugging/a_pengertian" },
          { text: "Logcat", link: "/src/6_pengenalan_debugging/b_logcat" },
        ],
      },
      {
        text: "Pengenalan Supabase ⏹️",
        items: [
          { text: "Pengertian Supabase", link: "/src/7_pengenalan_supabase/a_setup" },
          { text: "Autentikasi", link: "/src/7_pengenalan_supabase/b_autentikasi" },
          { text: "Database", link: "/src/7_pengenalan_supabase/c_database" },
          { text: "Storage", link: "/src/7_pengenalan_supabase/d_storage" },
        ],
      },
      
    ],

    socialLinks: [
      { icon: "instagram", link: "https://www.instagram.com/raion_community/" },
      { icon: "linkedin", link: "https://www.linkedin.com/company/raioncommunity/" },
    ],

    search: {
      provider: "local",
    },

    // Footer untuk memperkuat branding Raion
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present Raion Community'
    }
  },
});