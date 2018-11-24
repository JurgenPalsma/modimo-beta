<template>
    <section class="hero modimo-dark is-fullheight">
        <div class="hero-body">
            <div class="container">
                <div class="columns">
                    <div class="column">
                        <br/>
                        <h1 class="title white-title is-1">
                            Messaging
                        </h1>
                    </div>
                </div>
                <div class="columns is-multiline is-mobile">
                    <div class="column">
                        <h2 class="title white-title is-4">
                            Conversations
                        </h2>
                        <div class="row">
                            <div v-for="conv in conversations" :key="conv._id" @click="switchToConversation(conv)" class="column card is-full" style="border-radius: 3px; position: relative; cursor: pointer"> 
                                <h1 style="font-weight: bold;">{{conv.name}}</h1>
                                <p class="conv-date">{{dateFormater(new Date(conv.messages[conv.messages.length - 1].timestamp).toString())}}</p>
                                <p>{{conv.messages[conv.messages.length - 1].author == $parent.currentUser._id ? 'Vous' : conv.name }}: {{conv.messages[conv.messages.length - 1].content}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="column">
                        <h2 class="title white-title is-4">
                            Messages
                        </h2>
                        <div>
                            <div id="thread-content" class="thread-container">
                                <div v-for="message in currentConv.messages" :key="message.timestamp" :class="message.author != $parent.currentUser._id ? 'message-block' : 'message-block-yours'" >
                                    <p :class="message.author != $parent.currentUser._id ? 'message' : 'message-yours'" >{{ message.content }}</p>
                                </div>
                                <span v-if="currentConv && !currentConv.messages.length">{{ $t("messagerie.thread.no_messages") }}</span>
                            </div>
                            <div v-if="currentConv" class="columns">
                                <div class="column is-12-mobile is-8-tablet">
                                    <input class="input-message" @keyup.enter="sendMessage()" v-model="message" placeholder="Message">
                                </div>
                                <div class="column is-12-mobile is-4-tablet">
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
        dateFormater(unFormatedDate) {
        var date = moment(String(unFormatedDate)).format("DD MMMM YYYY, h:mm:ss");
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