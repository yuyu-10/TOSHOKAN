import axios from "axios"

const getMangakas = async () => {
    const getURL = "http://localhost:3000/getMangakas"
    const response = await axios.get(getURL)
    return response.data
}

export { getMangakas }