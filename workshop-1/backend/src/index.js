const express = require('express')
var cors = require('cors')

const jwt = require('jsonwebtoken')

const app = express()
const port = 5000

app.use(express.json())

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req, res) => {
  const { body } = req

  const token = jwt.sign(body, process.env.JWT_SECRET)
  res.json({ token })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
