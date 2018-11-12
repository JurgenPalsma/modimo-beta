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
    },

    create_demo (firstname, lastname, email, password, roles, residenceName) {
        return Api().post('/api/demo', {
            'email': email,
            'residenceName': residenceName,
            'firstname': firstname,
            'lastname': lastname,
            'password': password,
            'roles': roles
        })
    },
}
