require("./config.js")

export default {
   // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
   ssr: false,

   // Global page headers: https://go.nuxtjs.dev/config-head
   head: {
      title: "Sozashop",
      htmlAttrs: {
         lang: "en"
      },
      meta: [
         {
            charset: "utf-8"
         },
         {
            name: "viewport",
            content: "width=device-width, initial-scale=0.6"
         },
         {
            hid: "description",
            name: "description",
            content: ""
         }
      ],
      link: [
         {
            rel: "icon",
            type: "image/x-icon",
            href: "/favicon.ico"
         }
      ],
      script: [
         {
            src: "https://www.googletagmanager.com/gtag/js?id=G-TCC8EE61VL",
         },
         {
            src: "/js/analytics-js.js",
            body: true,
         },
      ]


   },

   // Global CSS: https://go.nuxtjs.dev/config-css
   css: [
      "@/static/css/bootstrap.css",
      "@/static/css/icons.css",
      "@/static/css/app.css",
      "@/assets/scss/app.scss"
   ],

   // Custom progress bar config
   loading: {
      color: "#626ED4"
   },

   // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
   plugins: [
      "~/plugins/axios.js",
      "~/plugins/app.js",
      "~/plugins/components.js",
      "~/plugins/actions.js",
      "~/plugins/directives.js",
      "~/plugins/filter.js",
      "~/plugins/filters.js",
      "~/plugins/mixins/permissions.js",
      "~/plugins/mixins/global.js",
      { src: "~/plugins/vuehtml2pdf.js", mode: "client" },
      { src: '~/plugins/vue-shortkey.js', mode: 'client' }
   ],

   // Auto import components: https://go.nuxtjs.dev/config-components
   components: true,

   // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
   buildModules: [
      [
         "~/modules/echo/module",
         {
            broadcaster: "pusher",
            authEndpoint: `${process.env.API_BASE_URL}/broadcasting/auth`,
            key: process.env.WEBSOCKET_KEY,
            wsHost: process.env.WEBSOCKET_HOST,
            wsPort: process.env.WEBSOCKET_PORT,
            wssPort: process.env.WEBSOCKET_PORT,
            authModule: true,
            forceTLS: true,
            disableStats: true,
            enabledTransports: ["ws", "wss"],
            cluster: "mt1"
         }
      ]
   ],

   publicRuntimeConfig: {
      apiBaseUrl: process.env.API_BASE_URL
   },

   // Modules: https://go.nuxtjs.dev/config-modules
   modules: [
      "bootstrap-vue/nuxt",
      "nuxt-i18n",
      "@nuxtjs/axios",
      "@nuxtjs/auth-next",
      "vue-sweetalert2/nuxt",
      "@nuxtjs/moment",
      'vue-social-sharing/nuxt',
      "vue2-editor/nuxt",
      [
         "vue-toastification/nuxt",
         {
            timeout: 3000,
            draggable: true
         }
      ]
   ],

   // Axios module configuration: https://go.nuxtjs.dev/config-axios
   axios: {
      baseURL: process.env.API_URL,
      proxyHeaders: false,
      credentials: false
   },

   // Authentication strategies
   auth: {
      redirect: {
         callback: false,
         home: false
      },
      strategies: {
         local: {
            token: {
               property: "access_token"
            },
            user: {
               property: "data"
            },
            endpoints: {
               login: {
                  url: "/login",
                  method: "post"
               },
               logout: {
                  url: "/logout",
                  method: "post"
               },
               user: {
                  url: "/profile",
                  method: "get"
               }
            }
         },
         local2: {
            scheme: "local",
            token: {
               property: "access_token"
            },
            user: {
               property: "data"
            },
            endpoints: {
               login: {
                  url: "/admins/login",
                  method: "post"
               },
               logout: {
                  url: "/admins/logout",
                  method: "post"
               },
               user: {
                  url: "/admins/profile",
                  method: "get"
               }
            }
         },
         local3: {
            scheme: "local",
            token: {
               property: "access_token"
            },
            user: {
               property: "data"
            },
            endpoints: {
               login: {
                  url: "/agents/login",
                  method: "post"
               },
               logout: {
                  url: "/agents/logout",
                  method: "post"
               },
               user: {
                  url: "/agents/profile",
                  method: "get"
               }
            }
         }
      }
   },

   // Language config
   i18n: {
      lazy: true,
      langDir: "lang/",
      defaultLocale: "en",
      locales: [
         {
            flag: "/images/flags/us_flag.jpg",
            code: "en",
            name: "English",
            file: "en.js"
         },
         {
            flag: "/images/flags/bd_flag.jpg",
            code: "bd",
            name: "Bengali",
            file: "bd.js"
         },

      ],
      vueI18n: {
         fallbackLocale: "en"
      }
   },

   // Build Configuration: https://go.nuxtjs.dev/config-build
   build: {
      babel: {
         compact: true
      }
   },
   // Server configuration
   server: {
      port: process.env.PORT || 5000 // default: 3000
   }
}
