const { pool, runQuery } = require('../index')

//Route to get all mangaka
const getAllMangakas = (req, res) => {
    runQuery(`
        SELECT *
        FROM mangakas
        ORDER BY author;
    `, null, (results) => {
        res.json(results.rows)
    })
}

//Route to add a manga in the database
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

module.exports = {
    getAllMangakas,
    addMangaka
}