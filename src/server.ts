import { fastifyCors } from '@fastify/cors'
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
  getCategoriesRoute,
  getItemByUserRoute,
  getUsersRoute,
  loginRoute,
} from './http/index.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
})

app.register(fastifyMultipart)

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.get('/health', () => {
  return 'OK'
})

app.register(createUserRoute)
app.register(getUsersRoute)
app.register(loginRoute)
app.register(createCategoryRoute)
app.register(getCategoriesRoute)
app.register(createItemRoute)
app.register(deleteItemRoute)
app.register(getItemByUserRoute)

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server is running on port ${env.PORT}`)
})
