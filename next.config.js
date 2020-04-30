require('dotenv').config()

module.exports = {
  envs: {
    Addr: process.env.Addr || 'http://127.0.0.1:3000',
  },
  pageExtensions: ['api.ts', 'page.tsx'],
}
