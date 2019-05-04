<template>
    <div>
        <v-card>
            <v-img
                    class="white--text"
                    height="200px"
                    src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            >
                <v-container fill-height fluid>
                    <v-layout fill-height>
                        <v-flex xs12 align-end flexbox>
                            <span class="headline">{{state.accountName}}</span>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-img>
            <v-card-actions>
                <v-btn v-if="state.enabledMulti" flat color="orange" v-on:click="goToPayment">New Payment</v-btn>
                <v-btn v-else flat color="orange" v-on:click="goToEnable">Enable Multi-signature Service</v-btn>
            </v-card-actions>
        </v-card>

        <v-list two-line>
            <template v-for="item in handledTransactions">
                <v-list-tile
                        :key="item.id"
                        avatar
                        ripple
                        @click="goToDetail(item.realId)"
                >
                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.id }}</v-list-tile-title>
                        <v-list-tile-sub-title class="text--primary">{{ item.source }}</v-list-tile-sub-title>
                        <v-list-tile-sub-title>{{ item.info }}</v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                        <v-list-tile-action-text>{{ item.time }}</v-list-tile-action-text>
                        <v-icon>{{item.status}}</v-icon>
                    </v-list-tile-action>

                </v-list-tile>
            </template>
        </v-list>
    </div>
</template>


<script>
    import state from '../state'
    import {getServer} from '../api/stellar'
    import {fetchTransactions} from '../api/multisig'
    import {parseXDR, urlToXDR} from '../utils'
    import dayjs from 'dayjs'


    export default {
        data() {
            return {
                state,
                transactions: null,
                handledTransactions: null,
            }
        },
        mounted() {

            fetchTransactions(state.accountId, 100).then(resp => {
                this.transactions = resp.data
                this.handleTransactions()
            }).catch(err => console.log(err))
            if (this.state.enabledMulti !== null) {
                this.fetchAccount()
            }
        },
        methods: {
            fetchAccount: function () {
                this.state.loading = true
                getServer().loadAccount(state.accountId).then(resp => {
                    const public_key_signers = resp.signers.filter(signer => signer.type === 'ed25519_public_key');
                    state.enabledMulti = !(public_key_signers.length === 1 && public_key_signers[0].key === state.accountId);
                    this.state.loading = false
                })
            },
            goToPayment: function () {
                this.$router.push({name: 'payment'})
            },
            goToEnable: function () {
                this.$router.push({name: 'enable-multi-signature'})
            },
            handleTransactions: function () {
                const ans = []
                this.transactions.forEach(transaction => {
                    const parsedXdr = parseXDR(urlToXDR(transaction.request_uri))
                    const info = []
                    let status
                    if (transaction.signers.filter(signer => signer.key === state.accountId)[0].signed) {
                        status = 'done'
                    } else {
                        status = 'add'
                    }
                    if (transaction.horizon_response !== null) {
                        if (transaction.horizon_response.status !== 200) {
                            status = 'block'
                        } else {
                            status = 'done_all'
                        }
                    }
                    parsedXdr.operations.forEach(op => {
                        if (op.type !== 'unknown') {
                            info.push(`${op.asset.code}(${parseFloat(op.amount).toFixed(2)})`)
                        }
                    })
                    ans.push({
                        time: dayjs(transaction.created_at).format('YYYY-MM-DD HH:mm:ss'),
                        source: parsedXdr.source,
                        id: `${transaction.id.substr(0, 12)}...${transaction.id.substr(-12)}`,
                        info: info.join(" "),
                        realId: transaction.id,
                        status: status
                    })
                })

                this.handledTransactions = ans
            },
            goToDetail: function (id) {
                this.$router.push({
                        name: 'detail',
                        params: {
                            txId: id
                        },
                    }
                )
            },
        }
    }
</script>