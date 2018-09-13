import Api from '@/services/Api'

export default {
    postContact (contactName, contactMail, contactMessage) {
        return Api().post('/lead', {
            'name': contactName,
            'email': contactMail,
            'message': contactMessage,
            'role': 'OTHER'
        })
    }
}
