<template>
    <div v-if="notification" class="notification-block" :class="notification.type">
        <p class="notificaiton-text">{{notification.message}}</p>
    </div>
</template>

<style lang="scss" scoped>
.notification-block {
    padding: 7px 20px;
    margin-top: 60px;
    align-self: center !important;
    border-radius: 5px;
    display: inline-block;
    max-width: 95%;
}

.success {
    background-color: #5cd65c;
}

.failure {
    background-color: #ff4d4d;
    color: black;
}

</style>

<script>
export default {
    name: 'notification',
    data () {
        return {
            notification: undefined,
            notifications: [],
            running: false
        }
    },

    watch: {
        'new_notification': function(notification) {
            this.addNotif(notification)
        }
    },

    created: function() {
        this.addNotif(this.new_notification)
    },

    methods: {
        addNotif: function (notification) {
            if (this.notifications.find((notif) => notif.message == notification.message) === undefined) {
                this.notifications.push(notification)
                if (!this.running) {
                    this.updateNotification()
                }
            }
        },

        showNotif: function (tmp) {
            this.notification = tmp.shift()
            this.notifications = tmp || []
            this.running = true
            this.timeout = setTimeout(this.updateNotification, 3000);
        },

        updateNotification: function() {
            var tmp = this.notifications

            clearTimeout(this.timeout)
            if (tmp && tmp.length) {
                this.showNotif(tmp)
            }
            else {
                this.notification = undefined
                this.notifications = []
                this.running = false
            }
        }
    },
    props: ['new_notification']
}
</script>
