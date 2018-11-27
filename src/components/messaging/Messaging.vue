<template>
    <section class="hero modimo-dark is-fullheight">
        <div class="hero-body">
            <div class="container">
                <div class="columns">
                    <div class="column">
                        <br/>
                        <h1 class="title white-title is-1">
                            Messages
                        </h1>
                    </div>
                </div>
                <div class="columns is-multiline is-mobile">
                    <div class="column is-6-tablet is-12-mobile" style="position: relative">
                        <div class="modimo-conversations">
                            <input class="input-add-contact" v-model="contact" placeholder="Rechercher un contact">
                            <div class="modimo-conversations-container">
                                <div v-for="conv in conversations" :key="conv._id" @click="switchToConversation(conv)" class="column card is-full" style="border-radius: 3px; position: relative; cursor: pointer; margin-bottom: 10px; height: auto"> 
                                    <h1 style="font-weight: bold;">{{conv.name}}</h1>
                                    <p class="conv-date">{{conv.messages.length ? dateFormater(new Date(conv.messages[conv.messages.length - 1].timestamp).toString()) : ""}}</p>
                                    <p class="conv-last-message">{{conv.messages.length ? conv.messages[conv.messages.length - 1].content : "Aucun message"}}</p>
                                </div>
                            </div>
                            <div v-if="contactsFiltered && contactsFiltered.length" class="modimo-contact-search">
                                <div v-for="contact in contactsFiltered" :key="contact._id" @click="addContact(contact)" class="column modimo-conctact-choose is-full" style="border-radius: 3px; position: relative; cursor: pointer; height: auto"> 
                                    <h1 style="font-weight: bold;">{{contact.name}}</h1>
                                    <p class="conv-last-message">{{contact.email}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modimo-messages">
                        <div>
                            <div id="thread-content" class="thread-container">
                                <div v-for="message in currentConv.messages" :key="message.timestamp" :class="message.author != $parent.currentUser._id ? 'message-block' : 'message-block-yours'" >
                                    <p :class="message.author != $parent.currentUser._id ? 'message' : 'message-yours'" >{{ message.content }}</p>
                                </div>
                                <span v-if="currentConv && (!currentConv.messages || !currentConv.messages.length)" style="color: gray">Aucun message</span>
                            </div>
                            <div v-if="currentConv" class="columns is-mobile">
                                <div class="column is-8">
                                    <input class="input-message" @keyup.enter="sendMessage()" v-model="message" placeholder="Message">
                                </div>
                                <div class="column is-4">
                                    <div class="button" style="width: 100%" @click="sendMessage()">Envoyer</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import MessagingService from '@/services/MessagingService'
import moment from "moment";

export default {
    name: 'Messaging',
    data () {
        return {
            conversations: [],
            contacts: [],
            currentConv: {},
            contact: "",
            message: "",
            contactsFiltered: []
        }
    },
    created: function () {
        this.$parent.getCurrentUser()
        this.getConversations();
    },
    watch: {
        'conversations': function(newConv) {
            newConv.forEach(conv => {
                if (conv._id === this.currentConv._id)
                    this.currentConv = conv;
            })
            this.$nextTick(() => {
                let objDiv = document.getElementById("thread-content");
                objDiv.scrollTop = 100000;
            });
        },
        'threadId': function(newThreadId) {
            if (newThreadId)
                this.getMessages();
        },
        contact: function(newContact) {
            this.contactsFiltered = this.searchContact(newContact);
        }
    },
    methods: {
        async getConversations () {
            const resp = await MessagingService.getConversations(this.$cookies.get('api_token'));
            if (resp) {
                this.conversations = resp.sort((convA, convB) => {
                    if (convA.messages[convA.messages.length - 1].timestamp < convB.messages[convB.messages.length - 1].timestamp)
                        return 1;
                    else if (convB.messages[convB.messages.length - 1].timestamp > convA.messages[convA.messages.length - 1].timestamp)
                        return -1;
                    return 0;
                });
                this.conversations.forEach(conv => {
                    if (conv._id === this.currentConv._id) {
                        this.currentConv = conv;
                        this.$nextTick(() => {
                            let objDiv = document.getElementById("thread-content");
                            objDiv.scrollTop = 100000;
                        });
                    }
                })
                this.getAllContacts();
            }
        },

        switchToConversation (conversation) {
            this.currentConv = conversation;
            this.$nextTick(() => {
                let objDiv = document.getElementById("thread-content");
                objDiv.scrollTop = 100000;
            });
        },

        async sendMessage () {
            let res = await MessagingService.postMessage(this.$cookies.get('api_token'), this.currentConv.threadId, this.message);
            if (res.data.success) {
                this.message = "";
            }
            else {
                this.$parent.notification = {type: 'failure', message: "Votre message n'a pas pu être envoyé."}
            }
        },

        async getAllContacts() {
            let resp = await MessagingService.getContacts(this.$cookies.get('api_token'));
            if (resp.data.success) {
                this.contacts = resp.data.contacts.filter(contact => {
                    if (contact.name != this.$parent.currentUser.name && this.conversations.findIndex(conv => conv.name === contact.name) === -1) {
                        return true
                    }
                    return false
                })
            }
            else {
                this.$parent.notification = {type: 'failure', message: "Impossible de récupérer les contacts de cette résidence."}
            }
        },

        dateFormater(unFormatedDate) {
            var date = moment(String(unFormatedDate)).format("DD/MM/YYYY, HH:mm");
            return date;
        },

        searchContact(contactSearch) {
            if (!contactSearch.length) {
                return []
            }
            return this.contacts.filter(contact => {
                if (contact.name.toLowerCase().search(contactSearch.toLowerCase()) != -1 ||
                    contact.email.toLowerCase().search(contactSearch.toLowerCase()) != -1)
                    return true
                return false
            })
        },

        async addContact(contact) {
            let resp = await MessagingService.postConversation(this.$cookies.get('api_token'), contact._id)
            if (resp.data.success) {
                this.conversations.push({...resp.data.conversation, name: contact.name, threadId: resp.data.conversation._id});
            }
            else {
                this.$parent.notification = {type: 'failure', message: "Erreur lors de l'ajout du contact."}
            }
        }
    },
    sockets: {
        connect: function() {
            console.log('socket connected')
        },
        messageChannel: function(){
            console.log("socket ok")
            this.getConversations();
        }
    },
}

</script>

<style lang="scss">
@import './scss/Messaging.scss';
@import '../../styles/global.scss';
</style>