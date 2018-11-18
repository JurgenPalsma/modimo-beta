import Api from '@/services/Api'
import UserService from '@/services/UserService'

export default {
    async getConversations(token,  withUser = "") {
        let res = await Api().get('/api/messagerie/conversations', {
            headers: {
            'x-access-token': token,
            'with': withUser
            }
        })
        let me = await UserService.getCurrentUser(token)
        console.log(res)
        let conversations = []
        for (let i = 0; i < res.data.conversations.length; i++){
            conversations.push(res.data.conversations[i])
        }
        for (let i = 0; i < conversations.length; i++){
            //assign a name and an ID
            for (let j = 0; j < conversations[i].with.length; j++) {
                let u = await UserService.getUser(token, conversations[i].with[j]);
                conversations[i].name = u.data.user["name"]
            }
            conversations[i].threadId = conversations[i]._id;
        }
        return conversations;
    },

    postConversation (token, withUser) {
        return Api().post('/api/messagerie/conversation', {}, {
            'users': [withUser],
            headers: {
                'x-access-token': token    
            }
        })
    },

    postMessage (token, threadId, content) {
        let url = '/api/messagerie/' + threadId + '/message'
        return Api().post(url, {}, {
            headers: {
                'x-access-token': token,
                'content': content 
            }
        })
    }
}