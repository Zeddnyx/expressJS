import dotenv from 'dotenv'
dotenv.config()

export const config = {
  KEY: process.env.KEY,
  REFRESH_KEY: process.env.REFRESH_KEY,
  NODE_ENV: process.env.NODE_ENV,
}
