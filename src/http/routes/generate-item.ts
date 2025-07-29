import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { GoogleGenAI } from '@google/genai'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { env } from '../../env.ts'

const BASE64_IMAGE_REGEX =
  /^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/=]+$/

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
})

const model = 'gemini-2.5-flash'

export const generateItemRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/items/generate',
    {
      schema: {
        body: z.object({
          image: z.string(),
          //   image: z
          //     .string()
          //     .regex(BASE64_IMAGE_REGEX, {
          //       message: 'A imagem deve estar em formato válido.',
          //     })
          //     .optional(),
        }),
      },
    },
    async (request, reply) => {
      const { image } = request.body
      const results = await db
        .select({
          id: schema.categories.id,
          name: schema.categories.name,
        })
        .from(schema.categories)
        .orderBy(schema.categories.name)

      const resultsNames = results.map((result) => result.name)

      const __filename = fileURLToPath(import.meta.url)
      const __dirname = dirname(__filename)

      const base64ImageFile = readFileSync(join(__dirname, 'test.jpeg'), {
        encoding: 'base64',
      })

      const response = await gemini.models.generateContent({
        model,
        contents: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64ImageFile,
            },
          },
          {
            text: `
            Interprete o print para português do Brasil. O print vai ser geralmente de um extrado de compras, ou alguma lista de compras, no qual podem ter o nome de cada loja, 
            ou compra, e valor do mesmo. De preferência, sempre vão ser prints de extratos bancários, mas podem ser prints de tabelas. Os prints vão ser todos relacionados a esse 
            tema. Ao receber o print, você vai fazer uma leitura de tudo que foi comprado e separar em categorias. As categorias estão em inglês, você vai traduzir. As categorias são: ${resultsNames.join(
              ', '
            )}. Deve ser separado por categoria, e quanto foi gasto em cada categoria. Me mande a resposta em JSON, com a seguinte estrutura:
            {
              "category": "nome da categoria",
              "value": "valor gasto"
            }
            Caso você veja que a imagem não é um print, ou o print não está de acordo com esse tema, retorne "Imagem não é compatível com o sistema". 
            Não responde nem faça nada mais além disso.
            `,
          },
        ],
      })

      return reply.status(201).send({ itemId: response.text })
    }
  )
}
