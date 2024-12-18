export function addFastifyHooks(app, loggerService) {
  app.addHook('onRequest', (request, reply, done) => {
    request.startTime = process.hrtime()
    request = {
      method: request.method,
      url: request.url,
      headers: request.headers,
      query: request.query,
      params: request.params,
      ip: request.ip
    }
    done()
  })

  app.addHook('onSend', async (request, reply, payload) => {
    // Valida e retorna o payload sem modificar headers
    if (typeof payload === 'string' || Buffer.isBuffer(payload)) {
      try {
        request.responseBody = JSON.parse(payload.toString())
      } catch {
        request.responseBody = payload.toString()
      }
    } else {
      request.responseBody = payload
    }

    return payload // Certifique-se de retornar o payload
  })

  app.addHook('onResponse', (request, reply, done) => {
    const responseTime = process.hrtime(request.startTime)
    const responseTimeMs = responseTime[0] * 1e3 + responseTime[1] / 1e6

    loggerService.log('http', `${request.method} ${request.url} ${reply.statusCode}`, {
      request: {
        headers: request.headers,
        query: request.query,
        params: request.params,
        ip: request.ip
      },
      response: {
        responseTime: `${responseTimeMs.toFixed(3)}ms`,
        statusCode: reply.statusCode,
        body: request.responseBody
      }
    })
    done()
  })
}