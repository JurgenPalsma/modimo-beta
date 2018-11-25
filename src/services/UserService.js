import Api from '@/services/Api'
import ResidenceService from '@/services/ResidenceService'
import NotificationService from '@/services/NotificationService'

export default {
    getUser (token, id) {
        return Api().get('/api/user', {
            headers: {
                'x-access-token': token,
                'user_id': id
            }
        })
    },
    async getCurrentUser (token) {
        let res = await Api().get('/api/current-user', {
            headers: {
                'x-access-token': token
            }
        })
        if (!res.data.success) {
            return {}
        }
        let resi = await ResidenceService.getResidence(token, res.data.user.residence)
        if (!resi.data.success) {
            return {}
        }
        let notifs = await NotificationService.getNotifications(token)
        if (!notifs.data.success){
          return {}
        }
        res.data.user.residence = resi.data.residence
        res.data.user.notifs = notifs.data.notifs
        return res
    },

    getUsers (token, residence_id) {
        return Api().get('/api/users', {
            headers: {
                'x-access-token': token,
                'residence_id': residence_id,
            }
        })
    },

    async createUserFromAdmin (token, email, name, residence_id, roles) {
        let res = await Api().post('/api/admin_register_user', {
            'email': email,
            'name': name,
            'residence_id': residence_id,
            'roles': roles
          },
          {
            headers: {
                'x-access-token': token
            }
        });
        if (!res.data.success) {
            return {}
        } else
        return res
    },
  
    getUsers (token, residence_id) {
        return Api().get('/api/tickets', {
            headers: {
                'x-access-token': token,
                'residence_id': residence_id,
            }
        })
    },

    async createUserFromAdmin (token, email, name, residence_id, roles) {
        let res = await Api().post('/api/admin_register_user', {
            'email': email,
            'name': name,
            'residence_id': residence_id,
            'roles': roles
          },
          {
            headers: {
                'x-access-token': token
            }
        });
        if (!res.data.success) {
            return {}
        } else      
        return res
    },
  
    deleteUser (token, user_id) {
        return Api().delete('/api/user', {
            headers: {
                'x-access-token': token,
                'user_id': user_id
            }
        })
    }

}
