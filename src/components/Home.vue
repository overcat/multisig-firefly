<template>
    <div>
        <h1>Home</h1>
        <!--        {{state.accountId}}-->
        {{state.appVersion}} <br>
        {{state.enabledMulti}}<br>
    </div>
</template>


<script>
    import state from '../state'
    import stellar from '../api/stellar'
    import {fetchTransactions} from '../api/multisig'

    export default {
        data() {
            return {
                state,
                transactions: null

            }
        },
        mounted() {
            this.fetchAccount()
            fetchTransactions(state.accountId).then(resp => console.log(resp)).catch(err => console.log(err))
        },
        methods: {
            fetchAccount: function () {
                stellar.loadAccount(state.accountId).then(resp => {
                    const public_key_signers = resp.signers.filter(signer => signer.type === 'ed25519_public_key');
                    state.enabledMulti = !(public_key_signers.length === 1 && public_key_signers[0].key === state.accountId);
                })
            },

        }
    }
</script>

<style>

</style>