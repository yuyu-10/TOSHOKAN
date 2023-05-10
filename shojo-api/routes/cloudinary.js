const { cloudinary } = require('../cloudinaryConfig')
const { pool, runQuery } = require('../index')

//Route to send an image to cloudinary
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

//Route to send manga image url added in database
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
    uploadImages,
    addImage
}