const fastify = require('fastify')()
const mime = require('mime')

const { promises: fs, constants: { R_OK } } = require('fs')

fastify.get('/', async (request, reply) => {
  reply.type('html')
  return fs.readFile('public/index.html')
})

fastify.get('/test/*', async ({ req: { originalUrl } }, reply) => {
  const queryIndex = originalUrl.indexOf('?')
  const file = originalUrl.slice(0, queryIndex === -1 ? Infinity : queryIndex)
  reply.type(mime.getType(file.slice(file.lastIndexOf('.'))))
  return fs.readFile(file.slice(1))
})

fastify.get('/*', async ({ req: { originalUrl } }, reply) => {
  const queryIndex = originalUrl.indexOf('?')
  const file = originalUrl.slice(0, queryIndex === -1 ? Infinity : queryIndex)
  reply.type(mime.getType(file.slice(file.lastIndexOf('.'))))
  return fs.readFile(`public${file}`)
})


fastify.listen({
  port: 8080,
  host: '0.0.0.0'
})
