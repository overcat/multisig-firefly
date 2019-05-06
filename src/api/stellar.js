import StellarSdk from 'stellar-sdk'
import state from '../state'

let server = null

export function setServer() {
    console.log("initServer: " + state.networkPassphrase + " " + state.horizonUrl)
    if (state.networkPassphrase === 'test' || state.networkPassphrase === 'Public Global Stellar Network ; September 2015') {
        StellarSdk.Network.usePublicNetwork()
    } else {
        StellarSdk.Network.useTestNetwork()

    }
    server = new StellarSdk.Server(state.horizonUrl)

}

export function getServer() {
    return server
}
