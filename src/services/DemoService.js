import Api from '@/services/Api'

export default {

    create_resident_demo (email) {
        return Api().post('/api/demo/resident', {
            'email': email
        })
    },
    create_admin_demo (email) {
        return Api().post('/api/demo/admin', {
            'email': email
        })
    }
}
