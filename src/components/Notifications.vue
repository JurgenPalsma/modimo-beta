<template>
    <div v-if="notification" class="notification-container" :class="notification.type">
        <p class="notificaiton-text">{{notification.message}}</p>
    </div>
</template>

<style lang="scss" scoped>
.notification-container {
    width: 40px;
    padding: 0 10px;
}

.success {
    background-color: green;
}

.failure {
    background-color: red;
}

</style>

<script>
export default {
    name: 'notification',
    data () {
        return {
            notification: undefined,
            notifications: [],
            running: false,
        }
    },

    watch: {
        'newNotification': function(notification) {
            this.addNotif(notification)
        }
    },

    methods: {
        addNotif: function (notification) {
            if (this.notifications.find((notif) => notif.message == notification.message) === undefined) {
                this.notifications.push(notification)
                if (!this.running) {
                    this.updateNotification();
                }
            }
        },

        showNotif: function (tmp) {
            this.notification = tmp.shift();
            this.notifications = tmp || []
            this.running = true
            // this.timeout = setTimeout(this.updateNotification, 4000);
        },

        updateNotification: function() {
            var tmp = this.notifications;

            clearTimeout(this.timeout);
            if (tmp && tmp.length) {
                this.showNotif(tmp);
            }
            else {
                this.notification = undefined;
                this.notifications = []
                this.running = false;
            }
        }
    },
    props: ['newNotification']
}
</script>
