import Api from '@/services/Api'

export default {
  getNotifications(user_token) {
      return Api().get('/api/notifications/notifications', {
          headers: {
              'x-access-token': user_token,
          }
      })
  }
}
