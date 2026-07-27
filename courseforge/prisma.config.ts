import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  // Path to your Prisma schema configuration
  schema: 'prisma/schema.prisma',
  
  // Database connection settings reading from .env file
  datasource: {
    url: env('DATABASE_URL'),
    directUrl: env('DIRECT_URL'),
  },
})
