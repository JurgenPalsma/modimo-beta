import axios from 'axios'
export default() => {
    return axios.create({
        baseURL: 'http://localhost:8000'
        // baseURL: 'https://modimo-beta-api.herokuapp.com/'
    })
}
