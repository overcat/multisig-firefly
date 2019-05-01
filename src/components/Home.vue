<template>
    <div>
        <h1>Home</h1>
        {{state.accountName}}
        {{state.appVersion}} <br>
        {{state.enabledMulti}}<br>
        <hr>
        <span v-for="transaction of transactions">{{transaction.id}}</span>
    </div>
</template>


<script>
    import state from '../state'
    import {getServer} from '../api/stellar'
    import {fetchTransactions} from '../api/multisig'

    export default {
        data() {
            return {
                state,
                transactions: null
            }
        },
        mounted() {
            console.log("Main")
            this.fetchAccount()
            fetchTransactions(state.accountId).then(resp => {
                this.transactions = resp.data
                console.log(resp.data)
            }).catch(err => console.log(err))
        },
        methods: {
            fetchAccount: function () {
                getServer().loadAccount(state.accountId).then(resp => {
                    const public_key_signers = resp.signers.filter(signer => signer.type === 'ed25519_public_key');
                    console.log(public_key_signers)
                    state.enabledMulti = !(public_key_signers.length === 1 && public_key_signers[0].key === state.accountId);
                })
            },

        }
    }
</script>

<style>

</style>