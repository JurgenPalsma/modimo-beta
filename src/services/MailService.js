import Api from '@/services/Api'

export default {
    postMail (token, title, description, to) {
        return Api().post('/api/mail', {
            'subject': title,
            'text' : description,
            'to': to
            }, {
            headers: {
                'x-access-token': token
            }
        })
    }
}
