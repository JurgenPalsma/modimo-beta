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
                            <div v-for="conv in conversations" :key="conv._id" @click="switchToConversation(conv)" class="column card is-one-quarter-widescreen is-one-third-desktop is-full-mobile is-half-tablet"> 
                                {{conv.name}}
                            </div>
                        </div>
                    </div>
                    <div class="column">
                        <h2 class="title white-title is-4">
                            Messages
                        </h2>
                        <div>
                            <div v-for="message in currentConv.messages" :key="message._id" class="card rows">
                                <div class="columns" v-if="message.author == $parent.currentUser._id">
                                    <div class="column card">  {{message.content}} </div>
                                    <div class="column card is-2"> {{message.author == $parent.currentUser._id ? 'Vous' : currentConv.name }} </div> 
                                </div>
                                <div class="columns" v-else>
                                    <div class="column card is-2"> {{message.author == $parent.currentUser._id ? 'Vous' : currentConv.name }} </div> 
                                    <div class="column card">  {{message.content}} </div>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div class="field">
                            <label class="label">New message</label>
                            <div class=" control">
                                <textarea class="textarea" v-model="message" placeholder="Enter your message"></textarea>
                            </div>
                            <button class="button is-success" @click="sendMessage">Send</button>
                        </div>   
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import MessagingService from '@/services/MessagingService'

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