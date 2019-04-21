import StellarSdk from 'stellar-sdk'

StellarSdk.Network.useTestNetwork();
const url = 'https://horizon-testnet.stellar.org'
const server = new StellarSdk.Server(url)

export default server