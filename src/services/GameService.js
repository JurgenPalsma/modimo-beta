import Api from '@/services/Api'

export default {

    create_resident_game (email) {
        return Api().post('/api/game/resident', {
            'email': email
        })
    },
    create_admin_game (email) {
        return Api().post('/api/game/admin', {
            'email': email
        })
    },

    create_game (firstname, lastname, email, password, roles, residenceName) {
        return Api().post('/api/game', {
            'email': email,
            'residenceName': residenceName,
            'firstname': firstname,
            'lastname': lastname,
            'password': password,
            'roles': roles
        })
    }
}
