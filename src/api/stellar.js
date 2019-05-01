import StellarSdk from 'stellar-sdk'
import state from '../state'

let server = null

export function setServer() {
    console.log("initServer: " + state.networkPassphrase + " " + state.horizonUrl)
    if (state.networkPassphrase === 'main') {
        // TODO: api bug
        StellarSdk.Network.useTestNetwork()
    } else {
        StellarSdk.Network.usePublicNetwork()

    }
    server = new StellarSdk.Server(state.horizonUrl)

}

export function getServer() {
    console.log("getServer")
    console.log(server)
    return server
}
