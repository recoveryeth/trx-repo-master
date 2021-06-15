import TronWeb from 'tronweb';
import store from '@/store'
import BigNumber from 'bignumber.js'
import Timer from 'timer.js'
import _ from 'lodash'
import InputDataDecoder from 'ethereum-input-data-decoder'
import Tx from '@/model/tx'
import { CONTARCT_TRX_REPO,CONTARCT_TRX_USDT, CONTARCT_DATA} from '../config/wallet';
import { UPDATE, APPEND_PENDING_HISTORY_LIST,SET_HISTORY_ADDRESS } from '../store/mutation-types';


const MAX_REQUEST_TIME = 20000

export let tronWeb = null,
    eminfo_update_timer = null;

const avg_time = 15
let current_block = 0
let current_time = 0

export async function initBlockInfo(){
  let current_block_info = await tronWeb.trx.getCurrentBlock();
  current_block = current_block_info.block_header.raw_data.number;
  current_time = parseInt(Date.now()/1000)
}

export function calcTime(blockNumer){
  return parseInt(current_time) - (current_block - parseInt(blockNumer))* 15
}

export function calcBlock(time = 86400){
  return parseInt(current_block) - time / 15
}

export async function initConnection() {
  if(store.state.app.is_wallet){
    if(typeof window.tronWeb != 'undefined'){
      tronWeb = window.tronWeb
    }
  }else{
    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider('https://api.trongrid.io');
    const solidityNode = new HttpProvider('https://api.trongrid.io');
    const eventServer = 'https://api.rongrid.io/';
    tronWeb = new TronWeb(
        fullNode,
        solidityNode,
        eventServer,
    );
  }
  await initBlockInfo()
  return tronWeb
}


export function initTimer() {
  eminfo_update_timer = new Timer({
    tick: 15,
    ontick: _.throttle(() => {
      updateEmInfo()
    }, 10000)
  })
}

export function startTimer() {
  if(eminfo_update_timer != null && eminfo_update_timer.getStatus() != 'started'){
    eminfo_update_timer.start(99999999)
  }
}

export async function initData() {
  try {
    await updateEmInfo()
  }catch(e){
    alert(e);
    console.log(e)
  }
}

export async function init() {
  try {
    await initConnection()
    await updateEmInfo()
    initTimer()
    startTimer()
  }catch(e){
    console.log(e)
  }
}

export function getContract(contract = CONTARCT_TRX_REPO) {
  const contract_info = CONTARCT_DATA[contract]
  return tronWeb.contract(contract_info.abi,contract_info.address)
}

export function getContractAddress(contract) {
  const contract_info = CONTARCT_DATA[contract]
  return contract_info.address
}

export function getContractByAddress(address) {
  let contract_list = []
  for (const contract in CONTARCT_DATA) {
    if (address.toLocaleLowerCase() == CONTARCT_DATA[contract].address.toLocaleLowerCase()    ) {
      contract_list.push(contract)
    }
  }
  return contract_list
}

export async function updateEmInfo() {

  let data = await Promise.all([getInfo(), getUserInfo(getAddress()), getAddress(), getBalance(getAddress()), getUsdtBalance(getAddress()),getUsdtBalance(getContractAddress(CONTARCT_TRX_REPO)),getUsdtAllowance(getAddress()) ])
  //console.log(data)
  const [
    [
      distributePool,
      top3Pool,
      boxPool,
      insuranceFund,
      devFund,
      totalInvestment,
      lastSeriesNo,
      restartNo,
      boxExpire,
      boxLastSeriesNo,
      ethTax,
      invite_top1_address,
      invite_top1_total,
      invite_top1_reward,
      invite_top2_address,
      invite_top2_total,
      invite_top2_reward,
      invite_top3_address,
      invite_top3_total,
      invite_top3_reward,

      m_totalSupply,
      reserve,
      profitPool,
      totalProfited,
      totalDestroyed,
      price,
      totalStaking,
      owner,
      weight,
      lastTotalInvestment,
      currTotalInvestment,
      issueInvest,
      issueSubscription,
      maxTotalIssue,
      ...args
    ],
    [
      seriesNo,
      investment,
      eth,
      ethDone,
      distributeLastTime,
      quitted,

      parent,
      sonCount,
      sonNodeCount,
      sonAmount,
      sonAmountPre,
      sonAmountDate,
      boxReward,

      roundFirstDate,
      quitable,
      subCoin,
      balanceOfToken,
      stakingOf,
      profitedOf,

      r0,
      r1,
      r2,
      r3 ,
      r4,
      r5,
      r6,
      r7,
      r8,
      r9,
      profitingOf,
      top3_last_reward,
      top3_is_get,
      r10,
      investmentPre,
      times,
      sonTotalAmount1,
      sonTotalAmount15,
    ],
    address,
    balance,
    usdtBalance,
    contractBalance,
    usdtAllowance,
  ] = data

  store.commit(UPDATE, {
    balance,
    usdtBalance,
    contractBalance,
    usdtAllowance,
    address,

    distributePool,
    top3Pool,
    boxPool,
    insuranceFund,
    devFund,
    totalInvestment,
    lastSeriesNo,
    restartNo,
    boxExpire,
    boxLastSeriesNo,
    ethTax,

    invite_top1_address: fromHex(toHex(invite_top1_address.toString())),
    invite_top1_total,
    invite_top1_reward,
    invite_top2_address: fromHex(toHex(invite_top2_address.toString())),
    invite_top2_total,
    invite_top2_reward,
    invite_top3_address: fromHex(toHex(invite_top3_address.toString())),
    invite_top3_total,
    invite_top3_reward,

    m_totalSupply,
    reserve,
    profitPool,
    totalProfited,
    totalDestroyed,
    price,
    totalStaking,
    owner,
    weight,
    lastTotalInvestment,
    currTotalInvestment,
    issueInvest,
    issueSubscription,


    seriesNo,
    investment,
    eth,
    ethDone,
    distributeLastTime,
    quitted,

    parent,
    sonCount,
    sonNodeCount,
    sonAmount,
    sonAmountPre,
    sonAmountDate,
    boxReward,

    roundFirstDate,
    quitable,
    subCoin,
    balanceOfToken,
    stakingOf,
    profitedOf,
    profitingOf,

    r0,
    r1,
    r2,
    r3 ,
    r4,
    r5,
    r6,
    r7,
    r8,
    r9,
    top3_last_reward,
    top3_is_get,
    r10,
    investmentPre,
    times,
    sonTotalAmount1,
    sonTotalAmount15,
    maxTotalIssue
  })
}

export function getInfo() {
  return new Promise((resolve, reject) => {
    const contract_obj = getContract(CONTARCT_TRX_REPO)
    contract_obj.methods.getInfo().call().then((data) => {
      resolve(data)
    }).catch(error => {
      console.log(error)
      reject(error)
    })
    setTimeout(() => {
      reject('timeout')
    }, MAX_REQUEST_TIME)
  })
}

export function getUserInfo(address) {
  return new Promise((resolve, reject) => {
    const contract_obj = getContract(CONTARCT_TRX_REPO)
    contract_obj.methods.getUserInfo(address).call().then((data) => {
      resolve(data.ret)
    }).catch(error => {
      console.log(error)
      reject(error)
    })
    setTimeout(() => {
      reject('timeout')
    }, MAX_REQUEST_TIME)
  })
}

export function getAddress() {
  if(!store.state.app.is_wallet){
    return '0x0000000000000000000000000000000000000000'
  }
  let address = tronWeb.defaultAddress.base58
  return address
}

export async function getBlock(number) {
  return await tronWeb.trx.getBlock(number)
}

export async function getTransaction(hash){
  return await tronWeb.trx.getTransaction(hash)
}

export async function getBlockTimestamp(number) {
  const {timestamp} = await getBlock(number)
  return timestamp
}

export async function getBalance(address) {
  let balance = 0
  try {    balance = await tronWeb.trx.getBalance(address)  } catch (e) {}
  return balance
}

export function getUsdtBalance(address) {
  return new Promise((resolve, reject) => {
    const contract_obj = getContract(CONTARCT_TRX_USDT)
    contract_obj.methods.balanceOf(address).call().then((data) => {
      resolve(data)
    }).catch(error => {
      console.log(error);
      reject(error)
    })
    setTimeout(() => {
      reject('timeout')
    }, MAX_REQUEST_TIME)
  })
}

export function getUsdtAllowance(address) {
  return new Promise((resolve, reject) => {
    const contract_obj = getContract(CONTARCT_TRX_USDT)
    contract_obj.methods.allowance(address,getContractAddress(CONTARCT_TRX_REPO)).call().then((data) => {
      resolve(data.remaining)
    }).catch(error => {
      console.log(error);
      reject(error)
    })
    setTimeout(() => {
      reject('timeout')
    }, MAX_REQUEST_TIME)
  })
}




export function formatWei(amount) {
  return tronWeb!=null?tronWeb.fromSun(amount):0;
}

export function toWei(amount) {
  return tronWeb!=null?tronWeb.toSun(amount):0;
}

export function isAddress(address) {
  return tronWeb!=null?tronWeb.isAddress(address):"0x0000000000000000000000000000000000000000"
}

export function toAscii(value) {
  return tronWeb!=null?tronWeb.toAscii(value):""
}

export function toUtf8(value) {
  return tronWeb!=null?tronWeb.toUtf8(value):""
}

export function toDecimal(value) {
  return tronWeb!=null?tronWeb.toDecimal(value):""
}

export function fromHex(value) {
  return tronWeb!=null?tronWeb.address.fromHex(value):""
}

export function toHex(value) {
  return tronWeb!=null?tronWeb.toHex(value):""
}


export function trim(value) {
  return value.trim().replace(/[\0\s]*/g, '')
}

/**
 * USDT授权
 */
export async function usdtApprove(amount) {
  try {
    const contract_obj = getContract(CONTARCT_TRX_USDT)
    contract_obj.approve(getContractAddress(CONTARCT_TRX_REPO),toWei(amount)).send({
      feeLimit:toWei(100),
      shouldPollResponse:false
    }).then((hash) => {
      const tx = new Tx()
      tx.method = 'approve'
      tx.block = 0
      tx.timestamp = parseInt(new Date().getTime() / 1000)
      tx.status = 2
      tx.fee = 0
      tx.hash = hash
      tx.confirm_block = 0
      tx.from = getAddress()
      tx.to = contract_obj.address
      tx.contract = CONTARCT_TRX_REPO
      store.commit(APPEND_PENDING_HISTORY_LIST, tx)
    });
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}


/**
 * 发送token
 */
export async function sendTokenTransaction(to, amount) {
  try {
    const contract_obj = getContract(CONTARCT_TRX_REPO)
    contract_obj.transfer(to,toWei(amount)).send({
      feeLimit:toWei(100),
      shouldPollResponse:false
    }).then((hash) => {
      //console.log("contract_obj  sendTokenTransaction" + hash)

      const tx = new Tx()
      tx.method = 'transfer'
      tx.block = 0
      tx.amount = toWei(amount)
      tx.timestamp = parseInt(new Date().getTime() / 1000)

      tx.status = 2
      tx.fee = 0
      tx.hash = hash
      tx.confirm_block = 0
      tx.from = getAddress()
      tx.to = to
      tx.contract = CONTARCT_TRX_REPO

      store.commit(APPEND_PENDING_HISTORY_LIST, tx)
    });
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 * 卖出
 * @param {} amount
 * @param {*} invite_code
 */
export async function redeem(amount) {
  try {
    const contract_obj = getContract(CONTARCT_TRX_REPO)
    contract_obj.redeem(toWei(amount)).send({
      feeLimit:toWei(100),
      shouldPollResponse:false
    }).then((hash) => {
      console.log("contract_obj  redeem" + hash)
    });
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}


/**
 * 买入
 * @param {*} amount
 */
export async function purchase(amount) {
  try {
    const contract_obj = getContract(CONTARCT_TRX_REPO)
    contract_obj.purchase(toWei(amount)).send({
      feeLimit:toWei(100),
      shouldPollResponse:false
    }).then((hash) => {
      //console.log("contract_obj  purchase" + hash)

      const tx = new Tx()
      tx.method = 'purchase'
      tx.block = 0
      tx.amount = toWei(amount)
      tx.timestamp = parseInt(new Date().getTime() / 1000)
      tx.status = 2
      tx.fee = 0
      tx.hash = hash
      tx.confirm_block = 0
      tx.from = getAddress()
      tx.to = contract_obj.address
      tx.contract = CONTARCT_TRX_REPO

      store.commit(APPEND_PENDING_HISTORY_LIST, tx)
    });
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}


/**
 * 赎回
 * @param {*} amount
 */
export async function quit() {
  try {
    const contract_obj = getContract(CONTARCT_TRX_REPO)
    contract_obj.quit().send({
      feeLimit:toWei(100),
      shouldPollResponse:false
    }).then((hash) => {
      //console.log("contract_obj  quit" + hash)

      const tx = new Tx()
      tx.method = 'quit'
      tx.block = 0
      tx.amount = 0
      tx.timestamp = parseInt(new Date().getTime() / 1000)
      tx.status = 2
      tx.fee = 0
      tx.hash = hash
      tx.confirm_block = 0
      tx.from = getAddress()
      tx.to = contract_obj.address
      tx.contract = CONTARCT_TRX_REPO

      store.commit(APPEND_PENDING_HISTORY_LIST, tx)
    });
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 * stake
 * @param {*} amount
 */
export async function stake(amount) {
  try {
    const contract_obj = getContract(CONTARCT_TRX_REPO)
    contract_obj.stake(toWei(amount)).send({
      feeLimit:toWei(100),
      shouldPollResponse:false
    }).then((hash) => {
      //console.log("contract_obj  stake" + hash)

      const tx = new Tx()
      tx.method = 'stake'
      tx.block = 0
      tx.amount = toWei(amount)
      tx.timestamp = parseInt(new Date().getTime() / 1000)
      tx.status = 2
      tx.fee = 0
      tx.hash = hash
      tx.confirm_block = 0
      tx.from = getAddress()
      tx.to = contract_obj.address
      tx.contract = CONTARCT_TRX_REPO

      store.commit(APPEND_PENDING_HISTORY_LIST, tx)
    });
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}


/**
 * 撤回
 * @param {*} amount
 */
export async function unstake(amount) {
  try {
    const contract_obj = getContract(CONTARCT_TRX_REPO)
    contract_obj.unstake(toWei(amount)).send({
      feeLimit:toWei(100),
      shouldPollResponse:false
    }).then((hash) => {
      //console.log("contract_obj  unstake" + hash)

      const tx = new Tx()
      tx.method = 'unstake'
      tx.block = 0
      tx.amount = toWei(amount)
      tx.timestamp = parseInt(new Date().getTime() / 1000)
      tx.status = 2
      tx.fee = 0
      tx.hash = hash
      tx.confirm_block = 0
      tx.from = getAddress()
      tx.to = contract_obj.address
      tx.contract = CONTARCT_TRX_REPO

      store.commit(APPEND_PENDING_HISTORY_LIST, tx)
    });
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}



/**
 * 领取分润
 * @param {*} amount
 */
export async function divideProfit() {
  try {
    const contract_obj = getContract(CONTARCT_TRX_REPO)
    contract_obj.divideProfit().send({
      feeLimit:toWei(100),
      shouldPollResponse:false
    }).then((hash) => {
      //console.log("contract_obj  divideProfit" + hash)

      const tx = new Tx()
      tx.method = 'divideProfit'
      tx.block = 0
      tx.amount = 0
      tx.timestamp = parseInt(new Date().getTime() / 1000)
      tx.status = 2
      tx.fee = 0
      tx.hash = hash
      tx.confirm_block = 0
      tx.from = getAddress()
      tx.to = contract_obj.address
      tx.contract = CONTARCT_TRX_REPO

      store.commit(APPEND_PENDING_HISTORY_LIST, tx)
    });
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 * 开宝箱
 */
export async function getBoxReward() {
  try {
    const contract_obj = getContract(CONTARCT_TRX_REPO)
    contract_obj.getBoxReward().send({
      feeLimit:toWei(100),
      shouldPollResponse:false
    }).then(hash => {
      //console.log("contract_obj  getBoxReward" + hash)
      const tx = new Tx()
      tx.method = 'getBoxReward'
      tx.block = 0
      tx.amount = 0
      tx.timestamp = parseInt(new Date().getTime() / 1000)
      tx.status = 2
      tx.fee = 0
      tx.hash = hash
      tx.confirm_block = 0
      tx.from = getAddress()
      tx.to = contract_obj.address
      tx.contract = CONTARCT_TRX_REPO

      store.commit(APPEND_PENDING_HISTORY_LIST, tx)
    })
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}




/**
 * 参与
 */
export async function play(amount) {
  try {
    const contract_obj = getContract(CONTARCT_TRX_REPO)
    const address = isAddress(store.state.base.ref_invite_code) ? store.state.base.ref_invite_code : 'TBvu5Bzcx8nFehqvNsh7Fe4MrB6hwRdQtT'
    contract_obj.play(address,toWei(amount)).send({
      feeLimit:toWei(100),
      //callValue:tronWeb.toSun(amount),
      shouldPollResponse:false
    }).then(hash => {
      //console.log("contract_obj  play" + hash)
      let tx = new Tx()
      tx.method = 'play'
      tx.block = 0
      tx.amount = toWei(amount)
      tx.timestamp = parseInt(new Date().getTime() / 1000)
      tx.status = 2
      tx.fee = 0
      tx.hash = hash
      tx.confirm_block = 0
      tx.from = getAddress()
      tx.to = contract_obj.address
      tx.contract = CONTARCT_TRX_REPO
      store.commit(APPEND_PENDING_HISTORY_LIST, tx)
    })
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}



/**
 * 立即结算
 */
export async function distributionReward() {
  try {
    const contract_obj = getContract(CONTARCT_TRX_REPO)
    contract_obj.distributionReward().send({
      feeLimit:toWei(100),
      shouldPollResponse:false
    }).then((hash) => {
      //console.log(hash);
      const tx = new Tx()
      tx.method = 'distributionReward'
      tx.block = 0
      tx.timestamp = parseInt(new Date().getTime() / 1000)
      tx.status = 2
      tx.fee = 0
      tx.hash = hash
      tx.confirm_block = 0
      tx.from = getAddress()
      tx.to = contract_obj.address
      tx.contract = CONTARCT_TRX_REPO
      store.commit(APPEND_PENDING_HISTORY_LIST, tx)
    });
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}


/**
 * 领取奖励
 */
export async function getTop3Reward() {
  try {
    const contract_obj = getContract(CONTARCT_TRX_REPO)
    contract_obj.getTop3Reward().send({
      feeLimit:toWei(100),
      shouldPollResponse:false
    }).then((hash) => {
      const tx = new Tx()
      tx.method = 'getTop3Reward'
      tx.block = 0
      tx.timestamp = parseInt(new Date().getTime() / 1000)
      tx.status = 2
      tx.fee = 0
      tx.hash = hash
      tx.confirm_block = 0
      tx.from = getAddress()
      tx.to = contract_obj.address
      tx.contract = CONTARCT_TRX_REPO
      store.commit(APPEND_PENDING_HISTORY_LIST, tx)
    });
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

export function calcPurchaseRet(amount){
  return new Promise((resolve, reject) => {
    const contract_obj = getContract(CONTARCT_TRX_REPO)
    contract_obj.methods.calcPurchaseRet(toWei(amount)).call().then((data) => {
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
}

export function calcRedeemRet(amount){
  return new Promise((resolve, reject) => {
    const contract_obj = getContract(CONTARCT_TRX_REPO)
    contract_obj.methods.calcRedeemRet(toWei(amount)).call().then((data) => {
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
}


