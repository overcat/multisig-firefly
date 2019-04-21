import axios from 'axios'


const API = axios.create({
    baseURL: 'https://testnet.multisig.tools/',
    timeout: 10000,
    transformRequest(data, headers) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded'

        const str = [];
        for (const p in data)
            if (data.hasOwnProperty(p) && data[p] !== undefined) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]))
            }
        return str.join("&")
    }
});

export function fetchTransactions(accountId, limit = 10, offset = 0) {
    return API.get(`/transactions/${accountId}?limit=${limit}&offset=${offset}`)
}

export function submitNewTransaction(xdr) {
    return API.post('/transactions', {tx: xdr})
}