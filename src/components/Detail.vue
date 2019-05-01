<template>
    <div>
        <h1>Detail</h1>
        created_at: {{this.data.created_at}}<br>
        updated_at: {{this.data.updated_at}}<br>

        status: {{this.status}}<br>
        signed: {{this.signed}}<br>
        <!--        xdr: {{xdr}}-->

        <v-btn block color="blue" @click="submit">Submit</v-btn>


    </div>
</template>


<script>
    import state from '../state'
    import stellar from '../api/stellar'
    import {fetchTransaction, updateTransaction} from '../api/multisig'
    import firefly from '../api/firefly'
    import StellarSdk from 'stellar-sdk'
    import {urlToXDR} from '../utils'

    export default {
        data() {
            return {
                state,
                txId: "5e836856888a5fbe9bd9b0504b604091f420d458e4546924a3c429e211f14b93",
                data: null,
                status: null, // 0-pending 1-successful 2-failed
                signed: false,
                xdr: null
            }
        },
        created() {
            this.fetchTx()
        },
        methods: {
            fetchTx: function () {
                fetchTransaction(this.txId).then(resp => {
                    this.data = resp.data
                    this.signed = this.data.signers.filter(signer => signer.key === state.accountId)[0].signed
                    console.log(this.data)

                    this.xdr = urlToXDR(this.data.request_uri)
                    if (this.data.horizon_response === null) {
                        this.status = 0
                    } else {
                        if (this.data.horizon_response) {

                        }
                    }
                }).catch(err => console.log(err))
            },
            submit: function () {
                firefly.signXDR(this.xdr).then(signedXDR => {
                    console.log(this.xdr)

                    console.log(signedXDR)
                    const newTransaction = new StellarSdk.Transaction(signedXDR);
                    const newXDR = newTransaction.toEnvelope().toXDR('base64')
                    console.log(newXDR)
                    updateTransaction(this.txId, newXDR).then(resp => {
                        console.log(resp)
                        this.fetchTx()
                    }).catch(err => console.log(err))
                })

            },
        },
    }
</script>
<style scoped>
    span {
        word-wrap: break-word;
    }
</style>