// const { response } = require('express');
const { cloudinary } = require('../cloudinaryConfig')
const { runQuery } = require('../index')

//Route to send an image to cloudinary
const uploadImages = async (req, res) => {
    const { romanji_title } = req.body
    let newTitle = romanji_title.replace(/'/g, '');
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

//Route to send manga image url added in database
const addImage = (req, res) => {
    const { romanji_title, url, publicId } = req.body
  
    runQuery(
      `INSERT INTO images (public_id, url) VALUES ($1, $2) RETURNING image_id;`,
      [publicId, url],
      (response) => {
        if (response && response.rows.length > 0) {
          const imageId = response.rows[0].image_id
  
          runQuery(
            `
            UPDATE shojos
            SET image_id = $1
            FROM titles
            WHERE titles.title_id = shojos.title_id
            AND titles.romanji_title = $2;
            `,
            [imageId, `${romanji_title}`],
            (results) => {
              res.json(results)
            }
          )
        } else {
          res.json({ error: 'Une erreur s\'est produite lors de l\'insertion de l\'image.' })
        }
      }
    )
}

const updateImage = (req, res) => {
  const { url, publicId } = req.body

  runQuery(
    `
    UPDATE images
    SET url = $1
    WHERE public_id = $2;`,
    [url, publicId],
    (results) => {
      res.json(results)
    }
  )
}

const deleteImage = async (req, res) => {
    const { publicId } = req.body

    try {
        const result = await cloudinary.uploader.destroy(publicId)
        res.json(result)
    } catch (error) {
      res.json('Erreur lors de la suppression de l\'image :', error)
    }
}

module.exports = {
    uploadImages,
    addImage,
    deleteImage,
    updateImage
}