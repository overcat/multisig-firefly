<template>
    <div>
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
    </div>
</template>


<script>
    import state from '../state'
    import stellar from '../api/stellar'
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
                console.log(this.assets)

            }).catch(err => {
                console.error(err);
            })
        },
        methods: {
            submit: function () {
                console.log("submit")
                console.log(this.asset)
                stellar.loadAccount(state.accountId).then(sourceAccount => {
                    let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
                        fee: 100,
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
                        submitNewTransaction(signedXDR).then(resp => console.log(resp)).catch(err => console.log(err))
                    })
                }).catch(err => console.log(err))

            }
        },
    }
</script>