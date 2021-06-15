import _ from 'lodash'
import Base from './Base'
import {TRONSCAN_TRANSACTIONList_CONTRACT_API,TRONSCAN_TRANSACTIONList_API,TRANSACTIONINFO_TRANSACTION_CONTRACT_API,TRONSCAN_TRANSACTIONNFO_API,TRONGRID_API,TRONGRID_EVENTS_CONTRACT_API} from '@/config/url'

export default class Data extends Base {

  static async transactionList(address) {
    return await this.request(TRONSCAN_TRANSACTIONList_API, {
      sort: '-timestamp',
      count: true,
      limit: 100000,
      total: 0,
      start: 0,
      start_timestamp: 0,
      end_timestamp: Date.parse(new Date()),
      address:address
    })
  }

  static async getTransactionDetail(hash) {
    return await this.request(TRONSCAN_TRANSACTIONNFO_API, {
      hash: hash
    })
  }

  static async eventList(contract,eventName,size, sort,since,start) {
    // console.log({
    //   address: contract,
    //   eventName: eventName,
    //   limit: limit,
    //   sort: sort,
    //   since: since,
    //   start: start,
    // })
    //console.log(this.stringFormat(TRONGRID_EVENTS_CONTRACT_API,[contract,eventName]));
    return await this.request(this.stringFormat(TRONGRID_EVENTS_CONTRACT_API,[contract,eventName]), {
      size: size,
      sort: sort,
      since: since,
      start: start,
    })
  }

  //https://api-cn.etherscan.com/api?action=txlist&address=0xc13e8430967c5305cf18031c44381bc49ca65db8&apikey=YDTMKH534N4G4KN2QF3WN3Z3A1PDCAPR8S&endblock=99999999&module=account&sort=desc&startblock=0
  static async request(url, params = {}, type = 'get', config = {}) {
    const response = await this.call(url, params, type, config)
    return response
  }

  static stringFormat (formatted, args) {
    for (let i = 0; i < args.length; i++) {
      let regexp = new RegExp('\\{' + i + '\\}', 'gi')
      formatted = formatted.replace(regexp, args[i])
    }
    return formatted
  }
  
}
