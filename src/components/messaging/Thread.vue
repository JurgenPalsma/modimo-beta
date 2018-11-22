<template>
<div>
    <div id="thread-content" class="thread-container">
        <div v-for="message in messages " :key="message.timestamp" :class="{'message-block' : !message.yours, 'message-block-yours' : message.yours}" >
            <p :class="{'message' : !message.yours, 'message-yours' : message.yours}" >{{ message.content }}</p>
        </div>
        <span v-if="threadId && !messages.length">{{ $t("messagerie.thread.no_messages") }}</span>
    </div>
    <div v-if="threadId" class="row">
        <div class="col-12 col-sm-8">
            <input class="full-width" @keyup.enter="addMessage()" v-model="newMessage" :placeholder="$t('messagerie.thread.send')">
        </div>
        <div class="col-12 col-sm-4">
            <button class="full-width" v-on:click="addMessage()">{{ $t("messagerie.thread.send") }}</button>
        </div>
    </div>
</div>
</template>

<style>
    .thread-container {
        border-radius: 3px;
        background-color: var(--gray-background);
        min-height: 200px;
        margin-bottom: 10px;
        max-height: 500px;
        padding: 10px;
        overflow: auto;
        bottom: 0;
    }
    .conversation-title {
        text-align: center;
        color: #2b5bb2;
    }
    .input-bar {
        position: fixed;
        z-index: 100;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 10px;
    }
    .message-block-yours {
        margin: 2px 0;
        text-align: right;
    }
    .message-block {
        margin: 2px 0;
        text-align: left;
        display: block;
        width: auto;
    }
    .message {
        background-color: white;
        display: inline-block;
        margin-bottom: 0;
        padding: 5px 15px;
        border-radius: 10px;
        color: var(--blue-modimo);
        font-size: 14px;
        line-height: 16px;
        box-sizing: border-box;
        max-width: 400px;
        word-wrap: break-word;
    }
    .message-yours {
        background-color: var(--blue-modimo);
        display: inline-block;
        margin-bottom: 0;
        padding: 5px 15px;
        border-radius: 10px;
        color: white;
        font-size: 14px;
        line-height: 16px;
        box-sizing: border-box;
        max-width: 400px;
    }
</style>

<script>
    export default {
        data() {
            return {
                messages: [], // list of messages in thread
                newMessage: "" // input for message to be sent
            }
        },
        sockets:{
            connect: function(){
                console.log('socket connected')
            },
            messageChannel: function(){
                this.getMessages();
                this.getMessages();
            }
        },
        watch: {
            'threadId': function(newThreadId) {
                if (newThreadId)
                    this.getMessages();
            },
            'messages': function(newMessages) {
                if (newMessages)
                    this.$nextTick(() => {
                        let objDiv = document.getElementById("thread-content");
                        objDiv.scrollTop = 100000;
                    });
            }
        },
        methods: {
            getMessages: function() { // get list of messages in thread and set them in list
                this.$http.get(
                    this.$config.api + '/messagerie/conversation',
                    {headers: {'x-access-token': this.$cookies.get('dev-api-token'),
                        'id': this.threadId}}).then(response => {
                        this.messages = [];
                        let i = 0;
                        while (i < response.body.conversation.messages.length + 1) {
                            this.messages.push({
                                yours: this.$parent.$parent.currentUser._id == response.body.conversation.messages[i].author,
                                content: response.body.conversation.messages[i].content,
                                timestamp: response.body.conversation.messages[i].timestamp });
                            i += 1;
                        }
                        this.$set(this.messages = this.messages.sort(function(a, b) {
                            return a.timestamp > b.timestamp;}));
                        }, response => {
                        alert("Error: " + response.body.message)
                    });
            },
            addMessage: function() {
                // post new message
                this.$http.post(this.$config.api + '/messagerie/' +  this.threadId + '/message',
                    {'content': this.newMessage}, {headers: {'x-access-token': this.$cookies.get('dev-api-token')}}).then(response => {
                    this.getMessages();
                    this.newMessage = "";
                }, response => {
                    alert("Error: cant send message " + response.body);
                });
            }
        },
        props: ['threadId']
    }
</script>