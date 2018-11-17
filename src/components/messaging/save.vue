<template>
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-5">
                <div class="row newcontact">
                    <div class="col-12 col-lg-6">
                        <input class="newcontact-input" @keyup.enter="addContact(contact)" v-model="contact" :placeholder="$t('messagerie.messagerie.seach_by_email')">
                    </div>
                    <div class="col-12 col-lg-6">
                        <button class="full-width" v-on:click="addContact(contact)">{{ $t("messagerie.messagerie.add_contact") }}</button>
                    </div>
                </div>
                <div v-for="conv in conversations" :key="conv.threadId" class="white-block text-left row">
                    <div @click="currentConv = conv" class="col-9 no-padding contact-container">
                        <span>{{ conv.name }}</span>
                    </div>
                    <div class="col-3 no-padding text-right">
                        <span class="fa fa-trash delete-button" v-on:click="deleteContact(conv.threadId)"></span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-7">
                <div class="white-block">
                    <span v-if="currentConv.name" class="">{{ "conversation with " + currentConv.name }}</span>
                    <span v-else class="">{{ $t("messagerie.messagerie.no_conversation_selected") }}</span>
                    <messagerie-thread :thread-id="currentConv.threadId"></messagerie-thread>
                </div>
            </div>
        </div>
    </div>

</template>

<style>

    .newcontact-input {
        width: 100%;
        margin-bottom: 10px;
    }

    .newcontact {
        margin-bottom: 10px;
    }

    .delete-button {
        cursor: pointer;
    }

    .delete-button:hover {
        color: var(--blue-modimo);
    }

    .contact-container {
        cursor: pointer;
    }
</style>

<script>

    import messagerieThread from './thread.vue'

    export default {

        sockets:{
            connect: function(){
                console.log('socket connected')
            },

            conversationListUpdateChannel: function(){
                this.conversations = [];
                this.getConversations();
            }
        },

    data() {
            return {
                conversations: [],
                currentConv: {},
                contact: ""
            }
        },

        created: function() {
            this.getConversations();
        },

        methods: {

            getConversations: function() {
                this.conversations = [];
                this.$http.get(
                    this.$config.api + '/messagerie/conversations',
                        {headers: {'x-access-token': this.$cookies.get('dev-api-token')}}).then(response => {
                    this.conversations = [];

                    for (let i = 0; i < response.body.conversations.length; i++){
                                this.conversations.push(response.body.conversations[i])
                        }
                    for (let i = 0; i < this.conversations.length; i++){
                        //assign a name and an ID
                        for (let j = 0; j < this.conversations[i].with.length; j++)
                            if (this.$parent.currentUser._id != this.conversations[i].with[j]){
                                this.$http.get(
                                    this.$config.api + '/user',
                                    {headers: {'x-access-token': this.$cookies.get('dev-api-token'),
                                                'user_id': this.conversations[i].with[j]}}).then(resp => {
                                    this.$set(this.conversations[i], 'name', resp.body.user["name"])
                                })
                            }
                        this.$set(this.conversations[i], 'threadId', this.conversations[i]._id)
                    }
                    }, response => {
                        alert("Error: " + response.body.message)
                    });
            },

            addContact(contact) {
                this.$http.get(
                    this.$config.api +  '/user',
                    {headers: {'x-access-token': this.$cookies.get('dev-api-token'),
                                'email': contact}}
                ).then(response => {
                    if (response.body.success == true) {
                        let users = [];
                        users.push(response.body.user._id);
                        this.$http.post(
                            this.$config.api +  '/messagerie/conversation',
                            {'users': users},
                            {headers: {'x-access-token': this.$cookies.get('dev-api-token')}}
                        ).then(response => {
                            if (response.body.success == true) {
                                this.conversations = [];
                                this.getConversations()
                            } else {
                                alert("Error: " + response.body.message)
                            }
                        });
                    } else {
                        alert("User does not exist")
                    }
                });
            },

            deleteContact(id) {
                this.$http.delete(this.$config.api +  '/messagerie/conversation',
                    {headers: {'x-access-token': this.$cookies.get('dev-api-token')},
                    body: {'id':id}}).then(response => {
                    // refresh
                    this.getConversations();
                }, response => {
                    alert("Error: " + response.body.message)
                });
            }
        },

        components: {
            'messagerie-thread': messagerieThread
        }
    }
</script>