import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  // Path to your Prisma schema configuration
  schema: 'prisma/schema.prisma',
  
  // Database connection settings (using the direct port 5432)
  datasource: {
    url: env('DATABASE_URL'),
  },
})
