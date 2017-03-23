const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Secret = require('./lib/secrets')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Secret Box'
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (request, response) => {
  response.end(app.locals.title)
})

app.post('/api/secrets', (request, response) => {
  const created_at = new Date
  const message = request.body.message
  if (!message) {
    return response.status(422).send({
    error: 'No message provided'
    })
  }
  Secret.insertSecret(message, created_at)
  .then( (data) => {
    let newSecret = data.rows[0]
    response.status(201).json(newSecret)
  })
})

app.get('/api/secrets/:id', (request, response) => {
  Secret.findSecretById(request.params.id)
  .then(data => {
    if(!data.rowCount) {
      return response.sendStatus(404)
    }
    response.json(data.rows[0])
  })
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
