import _ from 'lodash'
import Data from '@/api/Data'
import { CONTARCT_DATA, CONTARCT_TRX_REPO} from '../config/wallet';
import {trim, formatWei, isAddress, getContractAddress, getAddress,fromHex,toHex} from '@/utils/Wallet'
import store from '../store'
import { calcBlock } from './Wallet';

export async function getLogList_LogAddrAmount_List() {
  const event_list = await Data.eventList(getContractAddress(CONTARCT_TRX_REPO), "logAddrAmount", 100,"timeStamp",0,0)
  const list = []
  for(let i = 0; i < event_list.data.length; i++){
    const amount = formatWei(event_list.data[i].result.amount)
    const logtime = event_list.data[i].result.logtime = event_list.data[i].result.logtime *1000
    const send = fromHex(event_list.data[i].result.send)
    list.push({
      amount,
      logtime,
      send
    })
  }
  return list;
}

export async function getLogList_logProfit_List() {
  const event_list = await Data.eventList(getContractAddress(CONTARCT_TRX_REPO), "logProfit", 100,"timeStamp",0,0)
  const list = []
  for(let i = 0; i < event_list.data.length; i++){
    const profitAmount = formatWei(event_list.data[i].result.profitAmount)
    const invitAmount = formatWei(event_list.data[i].result.invitAmount)
    const addr = fromHex(event_list.data[i].result.addr)

    list.push({
      profitAmount,
      invitAmount,
      addr
    })
  }
  return _.uniqBy(_.sortBy(list, item => parseFloat(item.invitAmount)).reverse(), 'addr').slice(0, 3)
}

export async function getLogList_loglink_List() {

  const event_list = await Data.eventList(getContractAddress(CONTARCT_TRX_REPO), "loglink", 20,"timeStamp",0,0)
  const list = []
  for(let i = 0; i < event_list.data.length; i++){
    const addr = fromHex(event_list.data[i].result.addr)
    const sonCount = event_list.data[i].result.sonCount
    const nodeCount = event_list.data[i].result.nodeCount
    const supNodeCount = event_list.data[i].result.supNodeCount
    const invitAmount = formatWei(event_list.data[i].result.invitAmount)
    const investment = formatWei(event_list.data[i].result.investment)
    const firstTime = event_list.data[i].result.firstTime * 1000

    list.push({
      addr,
      sonCount,
      nodeCount,
      supNodeCount,
      investment,
      invitAmount,
      firstTime
    })
  }
  return _.uniqBy(list, 'addr')
}

export async function getLogList_LogAddrAmount_Box(no) {
  const event_list = await Data.eventList(getContractAddress(CONTARCT_TRX_REPO), "logAddrAmount", 100,"timeStamp",0,0)
  const list = []
  for(let i = 0; i < event_list.data.length; i++){
    const amount = event_list.data[i].result.amount
    const logtime = event_list.data[i].result.logtime = event_list.data[i].result.logtime *1000
    const send = fromHex(event_list.data[i].result.send)
    list.push({
      amount,
      logtime,
      send
    })
  }
  return list
}

export async function getLogList_Profit_List() {
  const event_list = await Data.eventList(getContractAddress(CONTARCT_TRX_REPO), "Profit", 100,"timeStamp",0,0)
  const list = []
  for(let i = 0; i < event_list.data.length; i++){
    const type = event_list.data[i].result.type
    const profit = formatWei(event_list.data[i].result.profit)
    const timestamp = event_list.data[i].result.timeStamp * 1000
    const hash = event_list.data[i].result.transactionHash
    list.push({
      type,
      profit,
      timestamp,
      hash
    })
  }
  return list.reverse()
}


export async function getRecvLuckList(address) {
  const list = []
  return list.reverse()
}