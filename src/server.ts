import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import { createRouter } from './middleware'
import { userRouter } from './router/user'
import { config } from './config/config'

export const appRouter = createRouter().merge('user.', userRouter)

export type AppRouter = typeof appRouter

// express implementation
const app = express()
// cors implementation
app.use(cors())

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => null
    // createContext
  })
)

app.get('/', (_req, res) => res.send('management api testing 1.2.3.'))

const server = app.listen(config.server.port, () => {
  console.log('Express server has been started on port ', config.server.port)
})
export default server

