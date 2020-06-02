const fastify = require('fastify')()
const { promises: fs, constants: { R_OK } } = require('fs')

fastify.get('/', async (request, reply) => {
  reply.type('html')
  return fs.readFile('public/index.html')
})

fastify.get('/:file', async ({ req: { originalUrl } }, reply) => {
  reply.type(originalUrl.slice(originalUrl.lastIndexOf('.')))
  return fs.readFile(`public${originalUrl}`)
})


fastify.listen({
  port: 8080,
  host: '0.0.0.0'
})
