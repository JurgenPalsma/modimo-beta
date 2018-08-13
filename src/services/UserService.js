import Api from '@/services/Api'

export default {
    getUser (token, id) {
        return Api().get('/api/user', {
            headers: {
                'x-access-token': token,
                'user_id': id
            }
        })
    }
}
