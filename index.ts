import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import { createRouter } from './middleware'
import { userRouter } from './router/user'

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
app.get('/', (_req, res) => res.send('testing 123'))

// utilise the port aws provides or 8080
const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`)
})
