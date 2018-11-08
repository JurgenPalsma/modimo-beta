import Api from '@/services/Api'

export default {
  getInfos(token) {
    return Api().get('/api/infos', {
      headers: {
        'x-access-token': token,
      }
    })
  },
  getInfo(token, id) {
    return Api().get('/api/infos/info', {
      headers: {
        'x-access-token': token,
        'info_id': id
      }
    })
  },
  updateInfo(token, id, title, content) {
    return Api().patch('/api/infos/info', {
      'info_id': id,
      'title': title,
      'content': content
    }, {
        headers: {
          'x-access-token': token,
        }
      })
  },
  deleteInfo(token, id) {
    return Api().delete('/api/infos/info', {
      headers: {
        'x-access-token': token,
        'info_id': id
      },
    })
  },

  postInfo(token, title, content) {
    return Api().post('/api/infos/info', {
      'title': title,
      'content': content
    }, {
        headers: {
          'x-access-token': token
        }
      })
  }
}