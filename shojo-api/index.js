const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./queries')
var cors = require('cors')
const { upload } = require('./cloudinaryConfig');

app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

app.get('/getAll', db.getAll)
app.get('/getOne', db.getOneShojoByName)
app.get('/verifTitle', db.verifTitle)
app.get('/getMangakas', db.getAllMangakas)
app.post('/addManga', db.addManga)
app.post('/addMangaDataBase', db.addMangaToDatabase)
app.get('/getOneById/:id', db.getOneShojoById)
app.post('/addMangaka', db.addMangaka)
app.post('/upload', upload.array('image'), db.uploadImages)
app.get('/getUrl', db.reqImage)