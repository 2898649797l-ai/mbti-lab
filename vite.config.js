import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import brand from './src/brand.json'
import manifest from './public/manifest.json'

const brandManifest = () =>
  JSON.stringify({
    ...manifest,
    name: brand.zh.title,
    short_name: brand.zh.title,
    description: brand.zh.subtitle,
    background_color: '#fffaf1',
    theme_color: '#6840c8',
  })
const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'personality-brand',
      transformIndexHtml(html) {
        return html
          .replace(/<title>.*?<\/title>/, '<title>' + escapeHtml(brand.zh.title) + '</title>')
          .replace(
            /(name="apple-mobile-web-app-title" content=")[^"]*/,
            '$1' + escapeHtml(brand.zh.title),
          )
          .replace(
            /(name="description" content=")[^"]*/,
            '$1' + escapeHtml(brand.zh.title + '：' + brand.zh.subtitle),
          )
      },
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.split('?')[0] !== '/manifest.json') return next()
          res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8')
          res.end(brandManifest())
        })
      },
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'manifest.json', source: brandManifest() })
      },
    },
  ],
  base: '/',
  test: { environment: 'jsdom', globals: true },
})
