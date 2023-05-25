import axios from "axios"

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

export { getMangasByTitle, getMangasById }