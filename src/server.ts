import { fastifyCors } from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import { fastifyMultipart } from '@fastify/multipart'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './env.ts'
import {
  createCategoryRoute,
  createItemRoute,
  createUserRoute,
  deleteItemRoute,
  generateItemRoute,
  getCategoriesRoute,
  getItemByUserRoute,
  getUserByIdRoute,
  getUsersRoute,
  loginRoute,
} from './http/index.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors, {
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
})

app.register(fastifyMultipart)

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.get('/health', () => {
  return 'OK'
})

// Public routes
app.register(createUserRoute)
app.register(loginRoute)

// Authenticated routes
app.register((authenticatedRoutes) => {
  authenticatedRoutes.addHook('onRequest', async (request) => {
    await request.jwtVerify()
  })

  authenticatedRoutes.register(getUsersRoute)
  authenticatedRoutes.register(createCategoryRoute)
  authenticatedRoutes.register(getCategoriesRoute)
  authenticatedRoutes.register(createItemRoute)
  authenticatedRoutes.register(generateItemRoute)
  authenticatedRoutes.register(deleteItemRoute)
  authenticatedRoutes.register(getItemByUserRoute)
  authenticatedRoutes.register(getUserByIdRoute)
})

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server is running on port ${env.PORT}`)
})
