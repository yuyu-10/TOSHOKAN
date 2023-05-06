const Pool = require('pg').Pool
const pool = new Pool({
  user: 'yuna',
  host: 'localhost',
  database: 'shojo',
  password: 'kaikai1269',
  port: 5433,
})

module.exports = {
  pool
}

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./routes/manga')
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
app.get('/getAll', db.getAll)

//Get manga by the name
//For search page
app.get('/getOne', db.getOneShojoByName)

//Get one by the id
//For info page
app.get('/getOneById/:id', db.getOneShojoById)

//Get all mangaka
//For the select in the post page
app.get('/getMangakas', db.getAllMangakas)

//Add a new mangaka
//For the post page too
app.post('/addMangaka', db.addMangaka)

//Call all routes for add a manga
//For post page again
app.post('/addManga', db.addManga)

//Verif before add the manga
app.get('/verifTitle', db.verifTitle)

//Add infos of the new manga except the image
//For post page
app.post('/addMangaDataBase', db.addMangaToDatabase)

//Add an image ine cloudinary
//For post page
app.post('/upload', upload.array('image'), db.uploadImages)

//Rec the url of the image on cloudinary for then update the manga
//Post page 
app.put('/addImage', db.addImage)