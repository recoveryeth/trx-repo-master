
import _ from 'lodash'
import {getContractAddress, formatWei, tronWeb} from './Wallet'
import store from '@/store'
import Data from '@/api/Data'
import Timer from 'timer.js'
import { reject } from 'any-promise';
import { CONTARCT_MININGSHARESIMPL, EVENT_PURCHASE_TIPIC, CONTARCT_DATA, CONTARCT_XCOINCONVERTER, EVENT_EXCHANGE_TIPIC, CROPTY_ETH, CROPTY_MS, EVNET_ADDRESS, CONTARCT_MININGSHARES, CONTARCT_EVENTER, CONTARCT_TRX_REPO } from '../config/wallet';
import { STATISTIC_UPDATE_DATA } from '../store/mutation-types';

export default class Statistic {
  constructor() {
    this.instance = null
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Statistic()
    }
    return this.instance
  }

  //时间戳转换方法    date:时间戳数字
  formatDate(timestamp) {
    let date = new Date(timestamp);
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return YY + MM + DD +" "+hh + mm + ss;
  }

  async init() {
    this.update_timer = new Timer({
      tick: 300,
      ontick: _.throttle(() => {
        this.update()
      }, 300000)
    })
    await this.update()
    this.update_timer.start(3600)
  }


  async update() {
    //https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=379224&toBlock=latest&address=0x33990122638b9132ca29c723bdf037f1a891a70c&topic0=0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545&apikey=YDTMKH534N4G4KN2QF3WN3Z3A1PDCAPR8S

    const event_list = await Data.eventList(getContractAddress(CONTARCT_TRX_REPO), "Price", 200,"timeStamp",0,0)
    const price_data = []

    for(let i = 0; i < event_list.data.length; i++){
      const timestamp = event_list.data[i].block_timestamp
      const price = event_list.data[i].result._price
      price_data.push({
        timestamp: timestamp,
        price: price
      })
    }
    price_data.reverse();
    //https://api.trongrid.io/events/contract/TPBCykK86nm3U9hKfN4NHdRasgq3Bw4MJ6/Price?limit=1&sort=timeStamp&since=1&start=0

    const timestamp = new Date(new Date().toLocaleDateString()).getTime() + new Date().getHours() * 3600 * 1000
    const last_week = timestamp - 7 * 24 * 3600 * 1000
    let is_show_exchange = false
    const start_timestamp = new Date('2019-08-29 00:00').getTime()
    if(start_timestamp <= last_week && false){
      is_show_exchange = true
    }
    const chart_data = []
    let price_data_index = 0
    let last_price = 0.01
    let price_24h = 0
    let price_7days = 0
    let max_price = last_price
    let min_price = 999999

    for(let hour = 0; last_week + hour * 3600 * 1000 <= timestamp; hour++){
      let point_timestamp = last_week + hour * 3600 * 1000

      if(typeof price_data[price_data_index] != 'undefined'){
        while(typeof price_data[price_data_index] != 'undefined' && point_timestamp >= price_data[price_data_index].timestamp){
          last_price = parseFloat(_.floor(formatWei(price_data[price_data_index].price), 6))
          if(last_price > max_price){
            max_price = last_price
          }
          if(min_price > last_price){
            min_price = last_price
          }
          price_data_index++
        }
      }
      
      if(point_timestamp + 24 * 3600 * 1000 >= timestamp && point_timestamp + 23 * 3600 * 1000 <= timestamp){
        price_24h = last_price
      }
      chart_data.push([point_timestamp, last_price])
    }

    if(price_data.length > 0 && chart_data[chart_data.length - 1][0] < price_data[price_data.length - 1].timestamp){
      last_price = parseFloat(_.floor(formatWei(price_data[price_data.length - 1].price), 6))
    }
    
    price_7days = chart_data[0][1]
    
    let block_increase = price_24h == 0 ? 0 : (last_price - price_24h) / price_24h
    let block_increase7_day = price_7days == 0 ? 0 : (last_price - price_7days) / price_7days

    const last_update = parseInt(Date.now() / 1000) * 1000

    store.commit(STATISTIC_UPDATE_DATA, {
      chart_data,
      last_price,
      price_24h,
      price_7days,
      block_increase,
      block_increase7_day,
      last_update,
      max_price,
      min_price
    })
  }
}
