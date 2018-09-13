import Api from '@/services/Api'

export default {

    create_resident_demo (email) {
        dataLayer.push({
            'event': 'api call',
            'action': 'signup resi'
        });
        return Api().post('/api/demo/resident', {
            'email': email
        })
    },
    create_admin_demo (email) {
        dataLayer.push({
            'event': 'api call',
            'action': 'signup admin'
        });
        return Api().post('/api/demo/admin', {
            'email': email
        })
    }
}
