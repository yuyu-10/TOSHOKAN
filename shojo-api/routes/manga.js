const { pool, runQuery } = require('../index')

//Route get all with author
const getAll = (req, res) => {
    runQuery(`
        SELECT *
        FROM shojos s
        LEFT JOIN mangakas m
        ON s.mangaka_id = m.mangaka_id
        LEFT JOIN images i
        ON s.image_id = i.image_id
        LEFT JOIN titles t
        ON s.title_id = t.title_id
        ORDER BY CONCAT(t.french_title, t.romanji_title);
        `, null, (results) => res.json(results.rows))
}

//Route to get one shojo by his name
const getOneShojoByName = (req, res) => {
    const { title } = req.query

    runQuery(`
        SELECT *
        FROM shojos s
        LEFT JOIN mangakas m
        ON s.mangaka_id = m.mangaka_id
        LEFT JOIN images i
        ON s.image_id = i.image_id
        LEFT JOIN titles t
        ON s.title_id = t.title_id
        WHERE t.french_title ILIKE $1 OR t.romanji_title ILIKE $1
        ORDER BY CONCAT(t.french_title, t.romanji_title);
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
        FROM shojos s
        LEFT JOIN mangakas m
        ON s.mangaka_id = m.mangaka_id
        LEFT JOIN images i
        ON s.image_id = i.image_id
        LEFT JOIN titles t
        ON s.title_id = t.title_id
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
    const { original_title, romanji_title, french_title, year, mangaka, resume, animation } = req.body

    verifTitle(req, res, romanji_title, (result) => {
        if (result.message === "Le titre existe déjà") {
            res.json(result.message)
        } else {
            addMangaToDatabase(req, res, year, original_title, romanji_title, french_title, mangaka, resume, animation)
        }
    })
}

//Route to check that the manga we want to add does not already exist in the database, check by the title
const verifTitle = (req, res, romanji_title, callback) => {
    runQuery(
        `
        SELECT * 
        FROM titles
        WHERE UPPER(romanji_title) = UPPER($1)
        `,
        [`${romanji_title}`],
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
const addMangaToDatabase = (req, res, year, original_title, romanji_title, french_title, mangaka, resume, animation) => {

    runQuery(
        `
        INSERT INTO titles (original_title, romanji_title, french_title)
        VALUES ($1, $2, $3)
        RETURNING title_id;
        `,
        [original_title, romanji_title, french_title],
        (result) => {
            if (result.error) {
                res.status(500).json(result.error)
            } else {
                const titleId = result.rows[0].title_id

                runQuery(
                    `
                    INSERT INTO shojos (year_of_publication, mangaka_id, resume, animation, title_id)
                    VALUES ($1, $2, $3, $4, $5)
                    `,
                    [`${year}`, mangaka, `${resume}`, animation, titleId],
                    (results) => {
                        res.json(`${romanji_title} has been had to the data`)
                    }
                )
            }
        }
    )
}


const modifyManga = (req, res) => {
    const id = parseInt(req.params.id)
    const { original_title, romanji_title, french_title, year, mangaka, resume, animation } = req.body

    runQuery(`
        UPDATE titles
        SET (original_title, romanji_title, french_title) = ($1, $2, $3)
        WHERE title_id = (
        SELECT title_id
        FROM shojos
        WHERE id = $4
        );
    `, [original_title, romanji_title, french_title, id], (result) => {
        if (result.error) {
            res.status(500).json(result.error)
        } else {
            runQuery(`
                UPDATE shojos
                SET (year_of_publication, mangaka_id, resume, animation) = ($1, $2, $3, $4)
                WHERE id = $5;
            `, [year, mangaka, resume, animation, id], (result) => {
                if (result.error) {
                    res.status(500).json(result.error)
                } else {
                    res.json(`${romanji_title} has been updated`)
                }
            })
        }
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