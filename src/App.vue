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
            firefly.ready().then(api => {
                console.log('firefly wallet is ready!')
                this.state.appVersion = firefly.version
                this.state.accountId = firefly.accountId
                console.log(firefly.accountId)
                // setTimeout(() => {
                //     this.state.appVersion = '10'
                //     console.log(state)
                // }, 5000)
                this.$router.replace({name: 'home'})
            }).catch(err => {
                console.error(err)
            });
        }
    }
</script>
