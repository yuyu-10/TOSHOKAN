const { cloudinary, path, upload } = require('../cloudinaryConfig')
const { pool } = require('../index')

//Route get all with author
const getAll = (req, res) => {
    runQuery(`
        SELECT *
        FROM mangakas m
        RIGHT JOIN shojos s
        ON s.mangaka_id = m.id
        ORDER BY s.title;
        `, null, (results) => res.json(results.rows))
}

//Route for get one shojo by his name
const getOneShojoByName = (req, res) => {
    const { title } = req.query

    runQuery(`
        SELECT * 
        FROM mangakas m
        RIGHT JOIN shojos s
        ON s.mangaka_id = m.id
        WHERE s.title ILIKE $1
        ORDER BY s.title;
        `, [`%${title}%`], (results) => {
        if (results.rows.length == 0) {
            res.json(`No results for your recherche sorry...`)
        } else {
            res.send(results.rows)
        }
    })
}

const getOneShojoById = (req, res) => {
    const id = parseInt(req.params.id)

    runQuery(`
        SELECT * 
        FROM mangakas m
        RIGHT JOIN shojos s
        ON s.mangaka_id = m.id
        WHERE s.id = $1;
            `, [id], (results) => {
        if (results.rows.length !== 0) {
            res.send(results.rows)
        } else {
            res.json('not good')
        }
    })
}

const getAllMangakas = (req, res) => {
    runQuery(`
        SELECT *
        FROM mangakas
        ORDER BY author;
    `, null, (results) => {
        res.json(results.rows)
    })
}

const addMangaka = (req, res) => {
    const { author } = req.body

    runQuery(`
        SELECT * 
        FROM mangakas
        WHERE UPPER(author) = UPPER($1)
    `, [`${author}`], (results) => {
        if (results.rows.length > 0) {
            res.json({ message: `Le mangaka: ${author} existe déjà` })
        } else {
            runQuery(`
                INSERT INTO mangakas (author)
                VALUES ($1)
            `, [`${author}`], (results) => {
                res.json(results.rows)
            })
        }
    })
}

const addManga = (req, res) => {
    const { title, year, mangaka, resume } = req.body

    verifTitle(req, res, title, (result) => {
        if (result.message === "Le titre existe déjà") {
            res.json(result.message)
        } else {
            addMangaToDatabase(req, res, year, title, mangaka, resume)
        }
    })
}

const verifTitle = (req, res, title, callback) => {
    runQuery(
        `
        SELECT * 
        FROM shojos
        WHERE UPPER(title) = UPPER($1)
        `,
        [`${title}`],
        (results) => {
            if (results.rows.length > 0) {
                callback({ message: "Le titre existe déjà" })
            } else {
                callback(results)
            }
        }
    )
}

const addMangaToDatabase = (req, res, year, title, mangaka, resume) => {
    runQuery(
        `
        INSERT INTO shojos (year_of_publication, title, mangaka_id, resume)
        VALUES ($1, $2, $3, $4)
        `,
        [`${year}`, `${title}`, mangaka, `${resume}`],
        (results) => {
            res.json(`${title} has been had to the data`)
        }
    )
}

const uploadImages = async (req, res) => {
    const { title } = req.body
    let newTitle = title.replace(/'/g, '');
    newTitle = newTitle.toLowerCase();
    newTitle = newTitle.replace(/\s+/g, '_');

    try {
        const results = []
        for (const file of req.files) {
            const filename = `${newTitle}`
            // const ext = path.extname(file.originalname)
            // const finalFilename = `${filename}${ext}`
            const result = await cloudinary.uploader.upload(file.path, {
                public_id: filename,
                folder: 'toshokan',
                format: 'jpg'
            })
            results.push(result)
        }
        res.json(results)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const addImage = (req, res) => {
    const { title, url } = req.body

    runQuery(`
        UPDATE shojos
        SET image = $1
        WHERE title = $2
    `, [`${url}`, `${title}`], (results) => {
        res.json(results)
    })
}

module.exports = {
    getAll,
    getOneShojoByName,
    getOneShojoById,
    getAllMangakas,
    addMangaka,
    addManga,
    verifTitle,
    uploadImages,
    addMangaToDatabase,
    addImage
}

function runQuery(request, parameters, callback) {
    pool.query(request, parameters ?? [], (error, results) => {
        if (error) {
            throw error
        } else {
            callback(results)
        }
    })
}