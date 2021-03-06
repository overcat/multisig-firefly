<template>
    <v-container>
        <h1>Settings</h1>
        <form>
            <h2>Signers</h2>
            <span v-for="(signer, index) in signers">
                <h4>Signer {{index+1}}</h4>
                <span class="address">AccountID: {{signer.signer_address}}</span><br>
                Weight: {{signer.signer_weight}}<br>
            </span>
            <v-text-field
                    type="text"
                    v-model="signer_address"
                    label="Account ID"
                    required
            ></v-text-field>
            <v-text-field
                    type="number"
                    v-model.number="signer_weight"
                    label="Weight"
                    required
            ></v-text-field>

        </form>
        <v-btn block color="secondary" dark @click="addSigner">Add Signer</v-btn>

        <form>
            <h2>Thresholds</h2>
            <v-text-field
                    type="number"
                    v-model.number="master_key_weight"
                    label="master_key_weight"
                    required
            ></v-text-field>
            <v-text-field
                    type="number"
                    v-model.number="high_threshold"
                    label="high_threshold"
                    required
            ></v-text-field>
            <v-text-field
                    type="number"
                    v-model.number="med_threshold"
                    label="med_threshold"
                    required
            ></v-text-field>
            <v-text-field
                    type="number"
                    v-model.number="low_threshold"
                    label="low_threshold"
                    required
            ></v-text-field>
            <v-btn block color="blue" @click="submit">Submit</v-btn>
        </form>


        <v-dialog
                v-model="errorDialog"
                max-width="290"
        >
            <v-card>
                <v-card-title class="headline">Error</v-card-title>

                <v-card-text>
                    {{errorMsg}}
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="green darken-1"
                            flat="flat"
                            @click="errorDialog = false"
                    >
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>


<script>
    import state from '../state'
    import {getServer} from '../api/stellar'
    import firefly from '../api/firefly'
    import StellarSdk from 'stellar-sdk'

    export default {
        data() {
            return {
                state,
                master_key_weight: 1,
                high_threshold: 2,
                med_threshold: 2,
                low_threshold: 2,
                signers: [],
                signer_address: null,
                signer_weight: 1,
                errorDialog: false,
                errorMsg: null
            }
        },
        methods: {
            addSigner: function () {
                this.signers.push({
                    signer_address: this.signer_address,
                    signer_weight: this.signer_weight
                })
                this.signer_address = null
                this.signer_weight = 1

            },
            submit: function () {
                if (!this.checkWeightAndThreshold()) {
                    console.log("checkWeightAndThreshold == false")
                    this.errorMsg = "The sum of the Weights must be greater than high_threshold."
                    this.errorDialog = true
                    return  // TODO
                }
                this.state.loading = true
                getServer().loadAccount(state.accountId).then(sourceAccount => {
                    let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
                        fee: 100,  // TODO
                        timebounds: {minTime: 0, maxTime: Math.floor(Date.now() / 1000) + 60 * 60 * 12}
                    })
                    this.signers.forEach(signer => {
                        transaction = transaction.addOperation(StellarSdk.Operation.setOptions({
                            signer: {
                                weight: signer.signer_weight,
                                ed25519PublicKey: signer.signer_address
                            }
                        }))
                    })
                    transaction = transaction.addOperation(StellarSdk.Operation.setOptions({
                        masterWeight: this.master_key_weight,
                        lowThreshold: this.low_threshold,
                        medThreshold: this.med_threshold,
                        highThreshold: this.high_threshold,
                    }))

                    transaction = transaction.build();
                    let xdr = transaction.toXDR("base64")

                    firefly.signXDR(xdr).then(signedXDR => {
                        const newTransaction = new StellarSdk.Transaction(signedXDR);
                        getServer().submitTransaction(newTransaction).then(resp => {
                            this.state.loading = false
                            this.state.enabledMulti = true
                            this.$router.push({name: 'home'})
                        }).catch(err => {
                            console.log(err)
                            this.state.loading = false
                            this.errorMsg = "It looks like the submission failed. Please try again later."
                            this.errorDialog = true
                        })
                    })

                }).catch(err => {
                    console.log(err)
                    this.state.loading = false
                    this.errorMsg = "Load account failed. Please try again later."
                    this.errorDialog = true
                })

            },
            checkWeightAndThreshold: function () {
                const totalWeight = this.master_key_weight + this.signers.reduce((x, y) => x + y.signer_weight, 0)
                return totalWeight >= this.high_threshold;
            },
        },
    }
</script>
<style scoped>
    .address {
        word-wrap: break-word;
    }
</style>