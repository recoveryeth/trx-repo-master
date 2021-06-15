export const WALLET_TRONLINK = 'tronlink'
export const WALLET_OTHER = 'other'

export const CONTARCT_TRX_REPO = 'trx_repo'
export const CONTARCT_TRX_USDT = 'trx_usdt'

let contarct_data = null
export const RPC = BUILD_TYPE == "PROD" ? 'https://mainnet.infura.io/v3/4bee79250a3148f3a4f9df00ed6a742b' : 'https://ropsten.infura.io/v3/4bee79250a3148f3a4f9df00ed6a742b'
contarct_data = BUILD_TYPE == 'PROD' ? require('./mainnet.json') : require('./ropsten.json')
export const CONTARCT_DATA = contarct_data
