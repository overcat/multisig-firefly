const StellarSdk = require("vii-sdk")

/**
 * @return {string}
 */
export function urlToXDR(url) {
    const [_, queryString] = url.replace(/^web\+stellar:/, "").split("?", 2);
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("xdr")
}

export function parseXDR(xdr) {
    const ops = []
    const transaction = new StellarSdk.Transaction(xdr)
    const operations = transaction.operations
    operations.forEach(op => {
        switch (op.type) {
            case 'createAccount':
                ops.push({
                    type: 'createAccount',
                    destination: op.destination,
                    amount: op.startingBalance,
                    asset: {
                        code: 'XLM',
                        issuer: undefined
                    }
                })
                break
            case 'payment':
                ops.push({
                    type: 'payment',
                    destination: op.destination,
                    amount: op.amount,
                    asset: op.asset
                })
                break
            default:
                ops.push({type: 'unknown'})
        }
    })
    return {
        source: transaction.source,
        operations: ops
    }
}