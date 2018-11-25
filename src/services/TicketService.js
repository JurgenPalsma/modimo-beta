import Api from '@/services/Api'

export default {
    getTickets (token, id) {
        return Api().get('/api/tickets', {
            headers: {
                'x-access-token': token,
                'residence_id': id,
                'ordered_by': ['vote_desc', 'date_asc']
            }
        })
    },
    getTicket (token, id) {
        return Api().get('/api/tickets/ticket', {
            headers: {
                'x-access-token': token,
                'ticket_id': id
            }
        })
    },
    updateTicket (token, id, content) {
        return Api().patch('/api/tickets/ticket', 
        {
            'ticket_id': id,
            'content': content
        }, {
            headers: {
                'x-access-token': token
            }
        })
    },
    deleteTicket (token, id) {
        return Api().delete('/api/tickets/ticket', {
            headers: {
                'x-access-token': token,
                'ticket_id': id
            }
        })
    },
    postTicket (token, title, content) {
        return Api().post('/api/tickets/ticket', {}, {
            headers : {
                'x-access-token': token,
                'title': title,
                'content': content
            }
        })
    },
    closeTicket (token, id, status) {
        return Api().patch('/api/tickets/ticket/avancement', 
        {
            'ticket_id': id,
            'status': status
        }, {
            headers: {
                'x-access-token': token
            }
        })
    },
    likeTicket (token, id, status) {
        return Api().patch('/api/tickets/ticket/vote', 
        {
            'ticket_id': id
        }, {
            headers: {
                'x-access-token': token
            }
        })
    }
}
