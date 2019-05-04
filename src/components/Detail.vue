<template>
    <v-container>
        <h1>Detail</h1>
        <h2>Info</h2>
        ID: {{handleTxId(this.data.id)}}<br>
        Created at: {{handleTime(this.data.created_at)}}<br>
        Updated at: {{handleTime(this.data.updated_at)}}<br>
        <span class="address">Source: {{source}}</span><br>
        Status: <strong>{{handleStatus(this.status)}}</strong><br>
        <h2>XDR Info</h2>
        <div v-for="(op, index) of operations">
            <h3>Operation {{index + 1}}</h3>
            Type: {{op.type}}<br>
            <div v-if="op.type !== unkown">
                <span class="address">Destination: {{op.destination}}</span><br>
                Asset: {{op.asset.code}}
                <span v-if="op.asset.issuer">({{op.asset.issuer}})</span><br>
                Amount: {{op.amount}}
            </div>
        </div>
        <h2>Signers</h2>
        <div v-for="(signer, index) of data.signers">
            <h3>Signer {{index + 1}}<span v-if="signer.key === state.accountId">(Me)</span></h3>
            <span class="address">Address: {{signer.key}}
            </span><br>
            Weight: {{signer.weight}}<br>
            Signed: {{signer.signed}}
        </div>
        <v-btn block color="blue" @click="submit" :disabled="status !== 0 || signed">{{btnMsg}}</v-btn>
    </v-container>
</template>


<script>
    import state from '../state'
    import {fetchTransaction, updateTransaction} from '../api/multisig'
    import firefly from '../api/firefly'
    import StellarSdk from 'stellar-sdk'
    import {urlToXDR, parseXDR} from '../utils'
    import dayjs from 'dayjs'

    export default {
        data() {
            return {
                state,
                txId: this.$route.params.txId,
                data: null,
                status: null, // 0-pending 1-successful 2-failed
                signed: false,
                xdr: null,
                btnMsg: "Sign",
                operations: null,
                source: null
            }
        },
        mounted() {
            this.fetchTx()
        },
        methods: {
            fetchTx: function () {
                this.state.loading = true
                fetchTransaction(this.txId).then(resp => {
                    this.data = resp.data
                    this.handleRequestUri()
                    this.signed = this.data.signers.filter(signer => signer.key === state.accountId)[0].signed
                    if (this.signed) {
                        this.btnMsg = "Signed"
                    }
                    this.xdr = urlToXDR(this.data.request_uri)
                    if (this.data.horizon_response === null) {
                        this.status = 0
                    } else {
                        if (this.data.horizon_response) {
                            if (this.data.horizon_response.status !== 200) {
                                this.status = 2
                            } else {
                                this.status = 1
                            }
                        }
                    }
                    this.state.loading = false
                }).catch(err => {
                    this.state.loading = false
                    console.log(err)
                })
            },
            submit: function () {
                this.state.loading = true
                firefly.signXDR(this.xdr).then(signedXDR => {
                    const newTransaction = new StellarSdk.Transaction(signedXDR);
                    const newXDR = newTransaction.toEnvelope().toXDR('base64')
                    console.log(newXDR)
                    updateTransaction(this.txId, newXDR).then(resp => {
                        this.fetchTx()
                        this.status.loading = false
                        this.fetchTx()
                    }).catch(err => {
                        this.status.loading = false
                        this.fetchTx()
                        console.log(err)
                    })
                })

            },
            handleTime: function (time) {
                return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
            },
            handleStatus: function (status) {
                switch (status) {
                    case 0:
                        return "Panding"
                    case 1:
                        return "Success"
                    case 2:
                        return "Failed"
                }
            },
            handleRequestUri: function () {
                const data = parseXDR(urlToXDR(this.data.request_uri))
                this.source = data.source
                this.operations = data.operations
            },
            handleTxId: function (id) {
                return `${id.substr(0, 12)}...${id.substr(-12)}`
            }
        },
    }
</script>
<style scoped>
    .address {
        word-wrap: break-word;
    }

    h2 {
        margin-top: 0.5rem;
    }

</style>