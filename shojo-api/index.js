const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.USER_NAME,
  host: process.env.HOST_DB,
  database: process.env.DB_NAME,
  password: process.env.PASSWORD_DB,
  port: process.env.PORT_DB,
})

function runQuery(request, parameters, callback) {
  pool.query(request, parameters ?? [], (error, results) => {
      if (error) {
          throw error
      } else {
          callback(results)
      }
  })
}

module.exports = {
  pool,
  runQuery
}

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const manga = require('./routes/manga')
const mangaka = require('./routes/mangaka')
const cloud = require('./routes/cloudinary')
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

//Get all manga with mangakas
//For the list page
app.get('/getAll', manga.getAll)

//Get manga by the name
//For search page
app.get('/getOne', manga.getOneShojoByName)

//Get one by the id
//For info page
app.get('/getOneById/:id', manga.getOneShojoById)

//Get all mangaka
//For the select in the post page
app.get('/getMangakas', mangaka.getAllMangakas)

//Add a new mangaka
//For the post page too
app.post('/addMangaka', mangaka.addMangaka)

//Call all routes for add a manga
//For post page again
app.post('/addManga', manga.addManga)

//Verif before add the manga
app.get('/verifTitle', manga.verifTitle)

//Add infos of the new manga except the image
//For post page
app.post('/addMangaDataBase', manga.addMangaToDatabase)

//Add an image ine cloudinary
//For post page
app.post('/upload', upload.array('image'), cloud.uploadImages)

//Rec the url of the image on cloudinary for then update the manga
//Post page 
app.put('/addImage', cloud.addImage)

//Update a manga
//SetManga page
app.put('/modifyManga/:id', manga.modifyManga)

app.post('/deleteImage', cloud.deleteImage)

app.put('/updateImage', cloud.updateImage)

app.get('/getMangakaByName', mangaka.getMangakaByName)