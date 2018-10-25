import Api from '@/services/Api'

export default {
    postComment (token, parent_id, parent_name, content) {
        return Api().post('/api/comments/comment',
        {
            'parent_id': parent_id,
            'parent_name': parent_name,
            'content': content
            }, {
            headers: {
                'x-access-token': token
            }
        })
    },

    getComments (token, parent_id) {
        return Api().get('/api/comments/comments',
        {
            headers: {
                'parent_id': parent_id,
                'x-access-token': token
            }
        })
    }
}