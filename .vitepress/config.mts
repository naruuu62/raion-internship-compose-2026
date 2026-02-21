import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "RAION INTERNSHIP 2026",
  description: "Introduction to Kotlin and Jetpack Compose.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Additional Resources",
        link: "https://adhesive-eggnog-eca.notion.site/Kotlin-Fundamental-16b2b31e67b447209bc53c8095e363e0" },
    ],

    sidebar: [
      {
        text: "Instalasi Android Studio 📱",
        link: "https://raion-academy-2024.vercel.app/src/0_instalasi_android_studio",
      },
      {
        text: "Instalasi Framework Compose 📱",
        link: "",
      },
      {
        text: "Pengenalan Kotlin 💜",
        items: [
          { text: "Pengertian dan Sejarah", link: "https://raion-academy-2024.vercel.app/src/1_pengenalan_kotlin/a_pengertian" },
          { text: "Variabel dan Tipe Data", link: "https://raion-academy-2024.vercel.app/src/1_pengenalan_kotlin/b_variabel" },
          { text: "Function", link: "https://raion-academy-2024.vercel.app/src/1_pengenalan_kotlin/c_function" },
          { text: "Konsep OOP", link: "https://raion-academy-2024.vercel.app/src/1_pengenalan_kotlin/d_oop" },
        ],
      },
      {
        text: "Pengenalan Compose 💚",
        items: [
          { text: "Pengertian dan Sejarah", link: "https://raion-academy-2024.vercel.app/src/2_pengenalan_compose/a_pengertian" },
          { text: "Composable Function", link: "https://raion-academy-2024.vercel.app/src/2_pengenalan_compose/b_composable" },
          { text: "UI Layout", link: "https://raion-academy-2024.vercel.app/src/2_pengenalan_compose/c_ui_layout" },
          { text: "Modifier", link: "https://raion-academy-2024.vercel.app/src/2_pengenalan_compose/d_modifier" },
          { text: "Material Design", link: "https://raion-academy-2024.vercel.app/src/2_pengenalan_compose/e_material_design" },
        ],
      },
      {
        text: "Pengenalan State 🚩",
        items: [
          { text: "Pengertian State", link: "https://raion-academy-2024.vercel.app/src/3_pengenalan_state/a_state" },
          { text: "State Hoisting", link: "https://raion-academy-2024.vercel.app/src/3_pengenalan_state/b_hoisting" },
          { text: "UI Events", link: "https://raion-academy-2024.vercel.app/src/3_pengenalan_state/c_ui_event" },
        ],
      },
      {
        text: "Pengenalan Navigation 📍",
        items: [
          { text: "Setup Navigation", link: "https://raion-academy-2024.vercel.app/src/4_pengenalan_navigation/a_setup" },
          { text: "Passing Data", link: "https://raion-academy-2024.vercel.app/src/4_pengenalan_navigation/b_passing_data" },
        ],
      },
      {
        text: "Pengenalan MVVM 🔥",
        items: [
          { text: "Pengertian MVVM", link: "https://raion-academy-2024.vercel.app/src/5_pengenalan_mvvm/a_pengertian" },
          { text: "API Interface", link: "https://raion-academy-2024.vercel.app/src/5_pengenalan_mvvm/b_api_interface" },
          { text: "Repository Pattern", link: "https://raion-academy-2024.vercel.app/src/5_pengenalan_mvvm/c_repository" },
          { text: "ViewModel Pattern", link: "https://raion-academy-2024.vercel.app/src/5_pengenalan_mvvm/d_viewmodel" },
          { text: "Dependency Injection", link: "https://raion-academy-2024.vercel.app/src/5_pengenalan_mvvm/e_di" },
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
  },
});
