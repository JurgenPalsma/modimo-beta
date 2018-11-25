import Api from '@/services/Api'

export default {
  deleteUserApplication(token, id) {
    return Api().patch('/api/user/application/delete', {
      'application_id': id
    }, {
      headers: {
        'x-access-token': token,
      }
    })
  },

  addUserApplication(token, id) {
    return Api().patch('/api/user/application/add', {
      'application_id': id,
    }, {
      headers: {
        'x-access-token': token
      }
    })
  }
}