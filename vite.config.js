import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import postcssPluginPxtorem from 'postcss-pxtorem'

// https://vite.dev/config/
export default defineConfig({
  base: '/restaurant-marketing-app/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssPluginPxtorem({
          rootValue: 37.5, // Vant is based on 375px design
          propList: ['*'],
          selectorBlackList: ['.norem'], // Selector blacklist
        }),
      ],
    },
  },
})
