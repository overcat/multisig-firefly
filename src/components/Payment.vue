<template>
    <v-container>
        <h1>Payment</h1>

        <form data-app>
            <v-text-field
                    type="text"
                    v-model="destination"
                    label="Destination"
                    required
            ></v-text-field>
            <v-select
                    name="asset"
                    v-model="asset"
                    item-text="asset.asset_code"
                    item-value="asset"
                    :items="assets"
                    label="Asset"
            ></v-select>
            <v-text-field
                    type="number"
                    v-model="amount"
                    label="Amount"
                    required
            ></v-text-field>
        </form>
        <v-btn block color="secondary" dark @click="submit">Submit</v-btn>
    </v-container>
</template>


<script>
    import state from '../state'
    import {getServer} from '../api/stellar'
    import firefly from '../api/firefly'
    import StellarSdk from 'stellar-sdk'
    import {submitNewTransaction} from '../api/multisig'

    export default {
        data() {
            return {
                state,
                destination: null,
                amount: null,
                assets: [],
                asset: null,

            }
        },
        created() {
            this.state.loading = true
            firefly.getBalances().then(balances => {
                balances.forEach(balance => {
                    const isNative = balance.asset_type === 'native';
                    this.assets.push({
                        asset: {
                            asset_code: isNative ? 'XLM' : balance.asset_code,
                            asset_issuer: isNative ? null : balance.asset_issuer,
                        }
                    })
                })
                this.state.loading = false

            }).catch(err => {
                console.error(err);
            })
        },
        methods: {
            submit: function () {
                this.state.loading = true
                getServer().loadAccount(state.accountId).then(sourceAccount => {
                    let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
                        fee: 100, // TODO
                        timebounds: {minTime: 0, maxTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 120}
                    }).addOperation(StellarSdk.Operation.payment({
                        destination: this.destination,
                        amount: this.amount,
                        asset: new StellarSdk.Asset(this.asset.asset_code, this.asset.asset_issuer)
                    }))

                    transaction = transaction.build();
                    let xdr = transaction.toXDR("base64")
                    console.log(xdr)
                    firefly.signXDR(xdr).then(signedXDR => {
                        submitNewTransaction(signedXDR).then(resp => {
                            this.state.loading = false
                            this.$router.push({
                                    name: 'detail',
                                    params: {
                                        txId: resp.data.id
                                    },
                                }
                            )
                        }).catch(err => {
                            console.log(err)
                            this.state.loading = false
                        })
                    })
                }).catch(err => {
                    this.state.loading = false
                    console.log(err)
                })
            }
        },
    }
</script>