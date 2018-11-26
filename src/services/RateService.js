import Api from '@/services/Api'

export default {
    postRate (token, application_id, comment, stars, quote) {
        return Api().post('/api/applications/rates',
        {
            'application_id': application_id,
            'comment': comment,
            'stars': stars,
            'quote': quote,
            }, {
            headers: {
                'x-access-token': token
            }
        })
    },

    updateRate (token, rate_id, comment, stars, quote) {
        return Api().patch('/api/applications/rates', 
        {
            'rate_id': rate_id,
            'stars': stars,
            'comment': comment,           
            'quote': quote,
            
        }, {
            headers: {
                'x-access-token': token
            }
        })
    },
    
    deleteRate (token, application_id, rate_id) {
        return Api().delete('/api/applications/rates',
        {
            'application_id': application_id,
            'rate_id': rate_id
        }, {
            headers: {
                'x-access-token': token
            }
        })
    },

    getRates (token, application_id) {
        return Api().get('/api/applications/rates',
        {
            headers: {
                'application_id': application_id,
                'x-access-token': token
            }
        })
    }
}