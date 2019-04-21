<template>
    <div id="app">
        <AppLayout/>
    </div>
</template>

<script>
    import AppLayout from './components/AppLayout'
    import firefly from './api/firefly'
    import state from './state'

    export default {
        name: 'App',
        components: {
            AppLayout
        },
        data() {
            return {
                state
            }
        },
        created() {
            // this.$router.replace({name: 'home'})
            firefly.ready().then(api => {
                console.log('firefly wallet is ready!')
                this.state.appVersion = firefly.version
                this.state.accountId = firefly.accountId
                this.$router.replace({name: 'home'})
            }).catch(err => {
                console.error(err)
                // this.$router.replace({name: 'home'})

            });
        }
    }
</script>
