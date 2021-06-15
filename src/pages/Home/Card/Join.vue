<template>
  <div id="join">
    <Card :title="$t('dialog.join.content_0')" :sub_title="$t('dialog.join.content_1')" icon="icon-4"
     :msg="$t('JOIN.MSG')">
      <div slot="content">
        <div class="content">
            <div class="btn-group">
              <van-slider class="slider" v-model="input_amount" :min='50' :max='50000' step="50" />
            </div>
            <div class="counter">
              <div class="minus" @click="minus">-</div>
              <div class="input-box">
                <div class="input label">
                  <input type="number" step="1" v-model="input_amount" @input="onChange" :placeholder="$t('dialog.join.content_5')"/>
                </div>
              </div>
              <div class="plus" @click="plus">+</div>
            </div>
            <div class="btn" :class="{ disable: (!can_join || investment * 2.5 > r7)}" @click="confirm">{{$t('dialog.join.content_3')}}</div>
            <div class="bottom">
              <div class="link" @click="quit">{{$t('dialog.join.content_4')}}</div>
            </div>
        </div>
      </div>
    </Card>
    <Quit ref="quit"></Quit>
    <Approve ref="approve"></Approve>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatWei} from '@/utils/Wallet.js'
import { play,usdtApprove} from '@/utils/Wallet.js'
import store from '@/store'
import Card from '@/components/common/Card'
import Quit from '@/pages/Dialog/Quit'
import Approve from '@/pages/Dialog/Approve'
import accounting from 'accounting'
import _ from 'lodash'

export default {
  name: 'Join',
  components: {
    Card,
    Quit,
    Approve
  },
  created() {
  },
  data() {
    return {
      input_amount: 50
    }
  },
  watch: {
  },
  mounted() {

  },
  filters: {
    floor: function(value, decimal = 2) {
      if(store.state.wallet.address == null){
        return '-'
      }
      if (value == 0) {
        return 0
      }
      return accounting.accounting.formatNumber(_.floor(value, decimal), decimal)
    },
  },
  
  computed: {
    can_join: function() {
      return parseInt(this.boxExpire) > parseInt(Date.now()/1000)
    },
    ...mapState({
      investment: state => formatWei(state.wallet.investment), // 参与数量
      investmentPre: state => formatWei(state.wallet.investmentPre), // 上一轮参与数量
      usdtBalance: state => formatWei(state.wallet.usdtBalance), // USDT余额
      contractBalance: state => formatWei(state.wallet.contractBalance), // USDT合约余额
      usdtAllowance: state => formatWei(state.wallet.usdtAllowance), // USDT授权额度
      boxExpire: state => state.wallet.boxExpire, // 宝箱到期
      r7: state => formatWei(state.wallet.r7), // 全部奖励
    })
  },
  methods: {
    onChange: function(e) {
      let value = isNaN(value)?0:parseInt(e.target.value)
      if(!isNaN(value)){
        if(value >= 50000){
          this.input_amount = 50
        }else if(value < 0){
          this.input_amount = 50
        }else{
          this.input_amount = value
        }
      }
    },
    minus: function() {
      if(this.input_amount - 50 > 0) {
        this.input_amount-=50;
      }
    },
    plus: function() {
      if(this.input_amount < 50000) {
        this.input_amount+=50;
      }
    },
    confirm:async function() {
      if(this.investment * 2.5 > this.r7 || !this.can_join){
        return false
      }
      if(this.usdtBalance < this.input_amount ){
        this.$toast(this.$t("Toast.usdt_content_0"));
        return false
      }
      if(this.input_amount % 50 !=0 ){
        this.$toast(this.$t("Toast.usdt_content_2"));
        return false
      }
      if(this.usdtAllowance < this.input_amount){
        this.approve();
        return false
      }
      if(this.input_amount < (this.investment - this.investmentPre)){
        this.$toast(this.$t("Toast.usdt_content_3"));
        return false
      }
      play(this.input_amount)
    },
    quit: function() {
      this.$refs.quit.open()
    },
    approve: function() {
      this.$refs.approve.open()
    }
  }
}
</script>

<style lang='scss' src='@/assets/css/pages/home/card/join.scss' scoped></style> 