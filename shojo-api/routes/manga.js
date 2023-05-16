const { pool, runQuery } = require('../index')

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

//Route to get one shojo by his name
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

//Route to get one shojo by his id
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

//Route to add a manga in the database (post page in front)
const addManga = (req, res) => {
    const { title, year, mangaka, resume, animation } = req.body

    verifTitle(req, res, title, (result) => {
        if (result.message === "Le titre existe déjà") {
            res.json(result.message)
        } else {
            addMangaToDatabase(req, res, year, title, mangaka, resume, animation)
        }
    })
}

//Route to check that the manga we want to add does not already exist in the database, check by the title
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

// Route to add the manga after the check
const addMangaToDatabase = (req, res, year, title, mangaka, resume, animation) => {
    runQuery(
        `
        INSERT INTO shojos (year_of_publication, title, mangaka_id, resume, animation)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [`${year}`, `${title}`, mangaka, `${resume}`, animation],
        (results) => {
            res.json(`${title} has been had to the data`)
        }
    )
}


const modifyManga = (req, res) => {
    const id = parseInt(req.params.id)
    const { title, year, mangaka, resume, animation } = req.body

    runQuery(`
        UPDATE shojos
        SET (year_of_publication, title, mangaka_id, resume, animation) = ($1, $2, $3, $4, $5)
        WHERE id = $6;
    `, [`${year}`, `${title}`, mangaka,`${resume}`, animation, id], (result) => {
        res.json(`${title} has been update`)
    })
}

module.exports = {
    getAll,
    getOneShojoByName,
    getOneShojoById,
    addManga,
    verifTitle,
    addMangaToDatabase,
    modifyManga
}