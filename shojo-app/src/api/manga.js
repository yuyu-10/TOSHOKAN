import axios from "axios"

const getAllManga = async () => {
    const getURL = `http://localhost:3000/getAll`
    const response = await axios.get(getURL)
    return response.data
}

const getMangasByTitle = async (uid) => {
    const getURL = `http://localhost:3000/getOne?title=${uid}`
    const response = await axios.get(getURL)
    return response.data
}

const getMangasById = async (uid) => {
    const getURL = `http://localhost:3000/getOneById/${uid}`
    const response = await axios.get(getURL)
    return response.data
}

export { getMangasByTitle, getMangasById, getAllManga }