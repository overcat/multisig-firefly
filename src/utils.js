/**
 * @return {string}
 */
export function urlToXDR(url) {
    const [_, queryString] = url.replace(/^web\+stellar:/, "").split("?", 2);
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("xdr")
}