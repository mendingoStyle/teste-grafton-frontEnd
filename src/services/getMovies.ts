import axios from 'axios';

class GetMoviesPayload {
    page: number
    import: boolean
}
export const getMovies = async (payload: GetMoviesPayload) => {
    return await axios.get(process.env.REACT_APP_API_URL + '/movies', { params: payload })
}