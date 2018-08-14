import Api from '@/services/Api'
import ResidenceService from '@/services/ResidenceService'

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
        res.data.user.residence = resi.data.residence
        return res
    }
}
