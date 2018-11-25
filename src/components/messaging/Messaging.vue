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
                            <input class="input-add-contact" @keyup.enter="addContact()" v-model="contact" placeholder="Rechercher un contact">
                            <div v-for="conv in conversations" :key="conv._id" @click="switchToConversation(conv)" class="column card is-full" style="border-radius: 3px; position: relative; cursor: pointer; margin-bottom: 10px"> 
                                <h1 style="font-weight: bold;">{{conv.name}}</h1>
                                <p class="conv-date">{{dateFormater(new Date(conv.messages[conv.messages.length - 1].timestamp).toString())}}</p>
                                <p class="conv-last-message">{{conv.messages[conv.messages.length - 1].content}}</p>
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
            currentConv: {},
            contact: "",
            message: ""
        }
    },

    created: function () {
        this.$parent.getCurrentUser()
        this.getConversations();
        this.getAllContacts();
    },
    watch: {
        'conversations': function(newConv) {
            this.currentConv = newConv[0]
            this.$nextTick(() => {
                let objDiv = document.getElementById("thread-content");
                objDiv.scrollTop = 100000;
            });
        },
        'threadId': function(newThreadId) {
            if (newThreadId)
                this.getMessages();
        }
    },
    methods: {
        async getConversations () {
            const res = await MessagingService.getConversations(this.$cookies.get('api_token'));
            if (res) {
                this.conversations = res;
                this.currentConv = this.conversations[0];
            }
        },

        switchToConversation (conversation) {
            this.currentConv = conversation;
        },

        sendMessage () {
            let res = MessagingService.postMessage(this.$cookies.get('api_token'), this.currentConv.threadId, this.message);
            this.message = ""
            this.getConversations();
        },

        async getAllContacts() {
            let resp = await MessagingService.getAllContacts(this.$cookies.get('api_token'));
            console.log(resp);
        },

        dateFormater(unFormatedDate) {
            var date = moment(String(unFormatedDate)).format("DD/MM/YYYY, HH:mm");
            return date;
        }
    },
    sockets:{
        connect: function(){
            console.log('socket connected')
        },

        conversationListUpdateChannel: function(){
            this.conversations = [];
            this.getConversations();
        }
    },
}

</script>

<style lang="scss">
@import './scss/Messaging.scss';
@import '../../styles/global.scss';
</style>