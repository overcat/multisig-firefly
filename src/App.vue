<template>
    <div id="app">
        <AppLayout/>
    </div>
</template>

<script>
    import AppLayout from './components/AppLayout'
    import firefly from './api/firefly'
    import state from './state'
    import {setServer as setStellarServer} from './api/stellar'
    import {setServer as setMultisigServer} from './api/multisig'

    export default {
        name: 'App',
        components: {
            AppLayout
        },
        data() {
            return {
                state,
            }
        },
        created() {
            this.state.loading = true
            firefly.ready().then(api => {
                console.log('firefly wallet is ready!')
                this.state.appVersion = api.version
                this.state.accountId = api.address
                this.state.horizonUrl = api.horizonUrl
                this.state.networkPassphrase = api.network
                this.state.accountName = api.accountName
                console.log(this.state)
                setStellarServer()
                setMultisigServer()
                this.$router.replace({name: 'home'})
                this.state.loading = false

            }).catch(err => {
                console.error(err)
                // this.$router.replace({name: 'home'})

            });
        }
    }
</script>
