import axios from 'axios'

let API = null

export function setServer() {
    const baseURL = "https://fe.vii.vip/multisig-server"
    API = axios.create({
        baseURL: baseURL,
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
}

export function fetchTransactions(accountId, limit = 10, offset = 0) {
    return API.get(`/transactions/${accountId}?limit=${limit}&offset=${offset}`)
}

export function fetchTransaction(id) {
    return API.get(`/transaction/${id}`)
}

export function submitNewTransaction(xdr) {
    return API.post('/transactions', {tx: xdr})
}

export function updateTransaction(transactionId, xdr) {
    return API.post(`/transaction/${transactionId}`, {tx: xdr})
}