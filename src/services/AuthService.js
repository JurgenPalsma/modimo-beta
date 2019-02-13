import Api from '@/services/Api'

export default {
    authenticate (email, password) {
        return Api().post('/api/authenticate', {
            'email': email,
            'password': password
        })
    },
    logout (token) {
        return Api().post('/api/logout', {}, {
            headers: {
                'x-access-token': token
            }
        })
    },
    ping () {
        return Api().post('/ping')
    }
}
