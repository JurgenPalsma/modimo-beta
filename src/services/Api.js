import axios from 'axios'
export default() => {
    return axios.create({
        //baseURL: 'https://modimo-beta-api.herokuapp.com/'
        baseURL: 'http://localhost:8000'
    })
}
