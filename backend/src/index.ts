import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import usersRouter from '~/routes/users.routes.js'
import databaseService from '~/services/database.services.js'
import { defaultErrorHandler } from '~/middlewares/error.middlewares.js'
import { envConfig } from '~/config/index.js'
import openApiSpec from '~/docs/openapi.js'

const app = express()
const port = envConfig.port

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', usersRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec))
app.get('/openapi.json', (_req, res) => {
  return res.json(openApiSpec)
})

app.use(defaultErrorHandler)

databaseService
  .connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`)
      console.log(`📋 API Base URL: http://localhost:${port}/api`)
      console.log(`📚 Swagger UI: http://localhost:${port}/api-docs`)
      console.log(`🧩 OpenAPI JSON: http://localhost:${port}/openapi.json`)
    })
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  })
