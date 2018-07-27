import Api from '@/services/Api'

export default {
  authenticate (email, password) {
    return Api().post('/api/authenticate', {
      'email': email,
      'password': password
    })
  },

  ping () {
    return Api().post('/ping')
  }
}

/*
launch_demo: function() {
            let call_url = this.role == 'resi' ? this.$config.api +'/demo/resident' : this.$config.api +'/demo/admin'
            let mail = this.email// != '' ? this.email : 'salut@yopmail.com'
             this.$http.post(
                    call_url,
                    {'email': mail}).then(response => {
                    if (response.body.success == true) {
                        this.$http.post(
                            this.$config.api + '/authenticate',
                            {
                                'email': response.body.user.email,
                                'name': response.body.user.name,
                                'password': response.body.user.password,
                            }
                        ).then(response => {
                            if (response.body.success == true) {
                                this.$cookies.set('dev-api-token', response.body.token);
                                this.$http.get(this.$config.api + '/current-user',
                                    {headers: {'x-access-token': this.$cookies.get('dev-api-token')}}).then(response => {
                                    this.$parent.currentUser = response.body.user;
                                    this.$ga.set('dimension1', response.body.user.residence)
                                    this.$router.push({name: 'home'})
                                });

                            } else
                                alert(response.body)
                        }, response => {
                            alert("Error in auth: " + response.body.message)
                        });}
                        else {
                            this.emailInputError = true
                            this.email = "Email invalide"
                        }
                }, response => {
                    alert("Error: in registration " + response.body.message)
                });
        }
*/
