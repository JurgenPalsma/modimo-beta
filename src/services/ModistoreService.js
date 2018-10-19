import Api from '@/services/Api'

export default {
    
    // route to post an application
    postApplications(user_token, objApplication) {
        return Api().post('/api/applications/application', {}, {
            'name': objApplication.name,
            'shortname': objApplication.shortname,
            'logo': objApplication.logo,
            'mini_logo': objApplication.mini_logo,
            'small_description': objApplication.small_description,
            'description': objApplication.description,
            'version': objApplication.version,
            'label_name': objApplication.label_name,
            'link': objApplication.link ? objApplication.link : null,
            'keyword': objApplication.keyword ? objApplication.keyword : null,
            headers: {
                'x-access-token': user_token    
            }
        })
    },

    // route to patch application
    patchApplications(user_token, objApplication) {
        return Api().patch('/api/applications/application', {
            'label_name': objApplication.label_name,
            'keyword': objApplication.keyword,
            'version': objApplication.version,
            'small_description': objApplication.small_description,
            'description': objApplication.description,
            'mini_logo': objApplication.mini_logo,
            'logo': objApplication.logo,
            'name': objApplication.name,
            'shortname': objApplication.shortname,
            headers: {
                'x-access-token': user_token,    
                'application_id': objApplication.application_id,
            }
        })
    },

    // route to delete an application by its id
    deleteApplicationByID(user_token, objApplication) {
        return Api().delete('/api/applications/application', {
            headers: {
                'x-access-token': user_token,    
                'application_id': objApplication.application_id,
            }
        })
    },

    // route to get all applications
    getAllApplications(user_token) {
        return Api().get('/api/applications', {
            headers: {
                'x-access-token': user_token,    
            }
        })
    },

    // route to get all applications of a user
    getMyInstalledApplications(user_token) {
        return Api().get('/api/applications/user', {
            headers: {
                'x-access-token': user_token,    
            }
        })
    },

    // route to get an application by his link
    getApplicationByLink(user_token, objApplication) {
        return Api().get('/api/applications/link', {
            headers: {
                'x-access-token': user_token,  
                'application_link': objApplication.application_link
            }
        })
    },

    // route to get one application by id
    getApplicationById(user_token, objApplication) {
        return Api().get('/api/applications/application', {
            headers: {
                'x-access-token': user_token,  
                'application_id': objApplication.application_id
            }
        })
    },

    // route to get all applications by author_name
    getApplicationByAuthor(user_token, objApplication) {
        return Api().get('/api/applications/author', {
            headers: {
                'x-access-token': user_token,  
                'author_name': objApplication.author_name
            }
        })
    },

    // route to create a label with empty list of app
    postLabel(user_token, label_name) {
        return Api().post('/api/applications/labels', {}, {
            'name': label_name,
            headers: {
                'x-access-token': user_token,  
            }
        })
    },

    // route to delete a label
    deleteLabel(user_token, label_id) {
        return Api().delete('/api/applications/label', {
            'label_id': label_id,
            headers: {
                'x-access-token': user_token,  
            }
        })
    },

    // route to get a label by label name
    getLabelByLabelName(user_token, label_name) {
        return Api().get('/api/applications/labels', {
            'name': label_name,
            headers: {
                'x-access-token': user_token,  
            }
        })
    },

    // route research applications corresponding with a name of research
    getAppsBySearchName(user_token, name) {
        return Api().get('/api/applications/applications', {
            'name': name,
            headers: {
                'x-access-token': user_token,  
            }
        })
    },

    // route to get all labels name
    getAllLabels(user_token) {
        return Api().get('/api/applications/labels/all', {
            headers: {
                'x-access-token': user_token,  
            }
        })
    },

    // route to post an application rates from an application_id
    postApplicationRateByAppID(user_token, objRate) {
        return Api().post('/api/applications/rates', {}, {
            'stars': objRate.stars,
            'application_id': objRate.application_id,
            'quote': objRate.quote,
            'comment': objRate.comment,
            headers: {
                'x-access-token': user_token    
            }
        })
    },

    // route to delete a rates in application with rate_id and application_id
    deleteRateinApp(user_token, objRate) {
        return Api().delete('/api/applications/rates', {
            'application_id': objRate.application_id,
            'rate_id': objRate.rate_id,
            headers: {
                'x-access-token': user_token,    
            }
        })
    },

    // route to update a rate in an app by his id
    patchRate(user_token, objRate) {
        return Api().patch('/api/applications/rates', {
            'rate_id': objRate.rate_id,
            'stars': objRate.stars,
            'comment': objRate.comment,
            'quote': objRate.quote,
            headers: {
                'x-access-token': user_token   
            }
        })
    },

    // route to get all application rates from an application id
    getAllRatesFromAppID(user_token, app_id) {
        return Api().get('/api/applications/rates', {
            headers: {
                'x-access-token': user_token,  
                'application_id': app_id
            }
        })
    },

    // route to get all keywords from a keyword name or get all keyword list
    getAllKeywordsByANameOrKeywordsList(user_token, keyword_name) {
        return Api().get('/api/applications/keywords', {
            headers: {
                'x-access-token': user_token,  
                'keyword': keyword_name
            }
        })
    },
}