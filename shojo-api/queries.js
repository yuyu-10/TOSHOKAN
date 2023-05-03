const Pool = require('pg').Pool
const pool = new Pool({
    user: 'yuna',
    host: 'localhost',
    database: 'shojo',
    password: 'kaikai1269',
    port: 5433,
})

const { cloudinary, path } = require('./cloudinaryConfig')

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
const getAllMangakas = (req, res) => {
    runQuery(`
        SELECT *
        FROM mangakas
        ORDER BY author;
    `, null, (results) => {
        res.json(results.rows)
    })
}

// const uploadImages = async (req, res, title) => {
//     let newTitle = title.replace(/'/g, '');
//     newTitle = newTitle.toLowerCase();
//     newTitle = newTitle.replace(/\s+/g, '_');

//     try {
//       const results = []
//       for (const file of req.files) {
//         const filename = `${newTitle}`
//         // const ext = path.extname(file.originalname)
//         // const finalFilename = `${filename}${ext}`
//         const result = await cloudinary.uploader.upload(file.path, {
//           public_id: filename,
//           folder: 'toshokan',
//           format: 'jpg'
//         })
//         results.push(result)
//       }
//       res.json(true)
//     } catch (error) {
//       res.status(400).json({ message: error.message })
//     }
// }

// const reqImage = async (req, res, title) => {
//     let newTitle = title.replace(/'/g, '');
//     newTitle = newTitle.toLowerCase();
//     newTitle = newTitle.replace(/\s+/g, '_');

//     try {
//         const publicId = `toshokan/${newTitle}.jpg`;
//         const image = await cloudinary.url(publicId);
//         return res.send(image);
//       } catch (error) {
//         res.status(404).send('Image not found');
//       }
// }

// const verifTitle = (req, res, year, title, mangaka) => {
//     console.log(title)

//     runQuery(`
//     SELECT * 
//     FROM shojos
//     WHERE UPPER(title) = UPPER($1)
//     `, [`${title}`], (results) => {
//         if (results.rows.length > 0) {
//             res.json({ message: "Le titre existe déjà" });
//         } else {
//             runQuery(`
//             INSERT INTO shojos (year_of_publication, title, mangaka_id)
//             VALUES ($1, $2, $3)
//             `, [`${year}`, `${title}`, mangaka], (results) => {
//                     res.json(`${title} has been add to the liste`)
//                 }
//             )
//         }
//     })
// }

//     runQuery(`
//         SELECT * 
//         FROM shojos
//         WHERE UPPER(title) = UPPER($1)
//         `, [`${title}`], (results) => {
//         if (results.rows.length > 0) {
//             res.json({ message: "Le titre existe déjà" });
//         } else {
//             if (uploadImages(req, res, title) === true) {
//                 const url = reqImage(req, res, title)
//                 if (url.length !== 0) {
//                     runQuery(`
//                     INSERT INTO shojos (year_of_publication, title, mangaka_id, image)
//                     VALUES ($1, $2, $3, $4)
//                     `, [`${year}`, `${title}`, mangaka, `${url}`], (results) => {
//                             res.json(`${title} has been add to the liste`)
//                         }
//                     )
//                 } else {
//                     res.send(url)
//                 }
//             } else {
//                 res.send('nooooooooooo')
//             }
//         }
//     }
//     )
// }

// const addManga = (req, res) => {
//     const { title, year, mangaka } = req.body
//     verifTitle(req, res, year, title, mangaka)
// }

const addManga = (req, res) => {
    const { title, year, mangaka } = req.body;

    verifTitle(res, title, (result) => {
        if (result.message === "Le titre existe déjà") {
            return;
        }

        uploadImages(req, res, title, (uploadResult) => {
            reqImage(req, res, title, (image) => {
                addMangaToDatabase(req, res, year, title, mangaka, (addResult) => {
                    res.json(`${title} has been added to the list`);
                });
            });
        });
    });
};

const verifTitle = (res, title, callback) => {
    console.log(title);

    runQuery(
        `
        SELECT * 
        FROM shojos
        WHERE UPPER(title) = UPPER($1)
        `,
        [`${title}`],
        (results) => {
            if (results.rows.length > 0) {
                res.json({ message: "Le titre existe déjà" });
            } else {
                callback({ message: "OK" });
            }
        }
    );
};

const uploadImages = async (req, res, title, callback) => {
    let newTitle = title.replace(/'/g, "");
    newTitle = newTitle.toLowerCase();
    newTitle = newTitle.replace(/\s+/g, "_");

    try {
        const results = [];
        for (const file of req.files) {
            const filename = `${newTitle}`;
            const result = await cloudinary.uploader.upload(file.path, {
                public_id: filename,
                folder: "toshokan",
                format: "jpg",
            });
            results.push(result);
        }
        callback(results);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const reqImage = async (req, res, title, callback) => {
    let newTitle = title.replace(/'/g, "");
    newTitle = newTitle.toLowerCase();
    newTitle = newTitle.replace(/\s+/g, "_");

    try {
        const publicId = `toshokan/${newTitle}.jpg`;
        const image = await cloudinary.url(publicId);
        callback(image);
    } catch (error) {
        res.status(404).send("Image not found");
    }
};

const addMangaToDatabase = (req, res, year, title, mangaka, callback) => {
    runQuery(
        `
        INSERT INTO shojos (year_of_publication, title, mangaka_id, image)
        VALUES ($1, $2, $3, $4)
        `,
        [`${year}`, `${title}`, mangaka, `${callback}`],
        (results) => {
            callback(results);
        }
    )
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
    getAll,
    getOneShojoByName,
    uploadImages,
    getAllMangakas,
    addManga,
    addMangaToDatabase,
    verifTitle,
    getOneShojoById,
    addMangaka,
    reqImage
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







// //Routes for shojo table


// //Route for get all shojo of the data
// const getAllShojo = (req, res) => {
//     runQuery('SELECT * FROM shojos ORDER BY id ASC', null, (results) => res.json(results.rows))
// }

// //Route for add one shojo to the data
// const addShojo = (req, res) => {
//     const { title, date, mangaka } = req.body

//     runQuery(`
// SELECT * 
// FROM shojos
// WHERE title = $1
//     `, [title], (results) => {
//         if (results.length !== 0) {
//             res.json(`${title} already exists in the liste`)
//         } else {
//             runQuery(`
//             INSERT INTO shojos (title, year_of_publication, mangaka_id)
//             VALUES ($1, $2, $3)
//             RETURNING *
//                 `, [title, date, mangaka], (results) => {
//                 res.send(`${results.rows[0].title} was successfully added to the list`)
//             })
//         }
//     })
// }

// //Route for modify one shojo
// const updateOneShojo = (req, res) => {
//     const id = parseInt(req.params.id)
//     const { title, date, mangaka } = req.body

//     runQuery(`
// UPDATE shojos
// SET title = $1, year_of_publication = $2, mangaka_id = $3
// WHERE id = $4
//     `, [title, date, mangaka, id], (results) => res.send(`Update done`))
// }

// //Route for delete one manga
// const deleteOne = (req, res) => {
//     const id = parseInt(req.params.id)

//     runQuery(`
// DELETE FROM shojos
// WHERE id = $1
//     `, [id], (results) => res.json('Manga deleted'))
// }