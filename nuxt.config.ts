// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  srcDir: 'app',

  css: ['./app/assets/css/main.css'],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    { 
      path: '~/components/invokers',
      pathPrefix: false
    },
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    'motion-v/nuxt',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image'
  ]
})