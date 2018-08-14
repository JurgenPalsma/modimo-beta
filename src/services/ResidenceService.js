import Api from '@/services/Api'

export default {
    getResidence (token, id) {
        return Api().get('/api/residence', {
            headers: {
                'x-access-token': token,
                'id': id
            }
        })
    }
}
