import _ from 'lodash'
import store from '@/store'
import Data from '@/api/Data'
import InputDataDecoder from 'ethereum-input-data-decoder'
import Tx from '@/model/tx'
import {getContractByAddress,getAddress,getContractAddress} from '@/utils/Wallet'
import { CONTARCT_TRX_REPO,CONTARCT_TRX_USDT} from '../config/wallet';
import { CONTARCT_DATA } from '../config/wallet'
import { SET_HISTORY_LIST, REMOVE_PENDING_HISTORY_LIST } from '../store/mutation-types'

const SUPPORT_METHOD = [
  'play',
  'redeem',
  'purchase',
  'quit',
  'stake',
  'unstake',
  'divideprofit',
  'getboxreward',
  'distributionreward',
  'transfer',
  'gettop3reward',
  'approve',
]

let is_updatding = false

export async function initHistory(){
  is_updatding = true
  await updateHistoryList()
  is_updatding = false

  setInterval(async () => {
    if(is_updatding){
      return false
    }
    is_updatding = true
    await updateHistoryList()
    is_updatding = false
  }, 15000)
}

export async function getHistoryList(address,repo_contract,usdt_contract){
  const history_list = []
  let transactionList = await Data.transactionList(address)
  if (parseInt(transactionList.data.status) == 0) {
    return history_list
  }
  const list = transactionList.data.data
  if(list==null||list.length==0)  return history_list;
  for (let i = 0; i < list.length; i++) {
    if(list[i].toAddress == repo_contract){
      //console.log(list[i]);
      const transactionDetail = await Data.getTransactionDetail(list[i].hash)
      if (parseInt(transactionDetail.data.status) == 0) {
        continue
      }
      const triggerInfo = transactionDetail.data.trigger_info;
      //console.log(triggerInfo);
      if(Object.keys(triggerInfo).length > 0){
        let methodName =  triggerInfo.method.substring(0,triggerInfo.method.indexOf("("));
        if (typeof triggerInfo.method == 'undefined') continue
        if (SUPPORT_METHOD.indexOf(methodName.toLowerCase()) ==-1) {
          continue
        }

        const tx = new Tx()
        tx.method = methodName
        tx.block = transactionDetail.data.block
        //tx.amount = detail.value
        tx.timestamp = transactionDetail.data.timestamp /1000

        tx.status = transactionDetail.data.contractRet == "SUCCESS" ? 1 : 0
        tx.fee = list[i].fee
        tx.hash = transactionDetail.data.hash
        tx.confirm_block = transactionDetail.data.confirmations
        tx.from = list[i].ownerAddress
        tx.to = list[i].toAddress
        tx.contract = tx.to
        history_list.push(tx)
      }
    }
  }
  return history_list
}

export async function updateHistoryList(){
  const list =await getHistoryList(store.state.wallet.address,getContractAddress(CONTARCT_TRX_REPO),getContractAddress(CONTARCT_TRX_USDT))
  _.forEach(store.state.wallet.pending_history_list, (tx) => {
    if(_.findIndex(list, {hash: tx.hash}) > -1){
      store.commit(REMOVE_PENDING_HISTORY_LIST, tx.hash)
    }
  })
  store.commit(SET_HISTORY_LIST, list)
}