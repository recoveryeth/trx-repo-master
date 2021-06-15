const ETHSCANIO =  'https://api-cn.etherscan.com'

const TRONGRID =  BUILD_TYPE == 'PROD' ? "https://api.trongrid.io" : "https://api.shasta.trongrid.io"
const TRONSCAN =  BUILD_TYPE == 'PROD' ? "https://apilist.tronscan.io" : "https://apilist.tronscan.io"

// const TRONGRID =  BUILD_TYPE == 'PROD' ? "https://api.shasta.trongrid.io" : "https://api.trongrid.io"
// const TRONSCAN =  BUILD_TYPE == 'PROD' ? "https://apilist.tronscan.io"  : "https://apilist.tronscan.io"

export const TRONGRID_API = TRONGRID
export const TRONGRID_EVENTS_CONTRACT_API = TRONGRID + "/events/contract/{0}/{1}?"
export const TRONSCAN_TRANSACTIONList_CONTRACT_API = TRONSCAN + "/api/contracts/transaction?"
export const TRONSCAN_TRANSACTIONList_API = TRONSCAN + "/api/transaction?"
export const TRONSCAN_TRANSACTIONNFO_API = TRONSCAN + "/api/transaction-info?"
//https://apilist.tronscan.io/api/contracts/transaction?sort=-timestamp&count=true&limit=20&start=0&start_timestamp=1599363767212&end_timestamp=1599968567212&contract=TGhS32avQPp1pnAfgLMEiYEff1zYWyK9Sd
//https://apilist.tronscan.io/api/transaction-info?hash=6c45a96341d8b45851ac7fc26a7bc511fbd4feb038de024b9c31def0eeeeb6a6



//TXC8GGa1xJ9L5gMyd6mz7FPhijYo3BhnBG  TNJ4LVgtv7yam88E4kS5HLa5f9ZnFngFj6