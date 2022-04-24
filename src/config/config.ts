import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT || 8080

export const config = {
  server: {
    port: port
  }
}
