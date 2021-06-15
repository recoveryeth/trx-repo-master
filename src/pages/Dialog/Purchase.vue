
<template>
  <Dialog id="redeem" ref="dialog" :title="$t('dialog.purchase.content_0')" :closeable="true" @closed="closed">
    <div slot="content" class="content">
      <div class="form">
        <div class="input-group">
          <input v-model="amount" :placeholder="$t('dialog.purchase.content_1')" />
          <div class="symbol">USDT</div>
        </div>
      </div>
      <div class="tips-group">
        <div class="tip">{{$t('dialog.redeem.content_6')}}: {{calcData == null ? 0 : calcData.amount | floor}} REPO</div>
      </div>
      <div class="btn-group">
        <div class="btn confirm" @click="confirm">{{$t('dialog.purchase.content_2')}}</div>
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from "@/components/common/Dialog";
import { mapState } from "vuex";
import { calcPurchaseRet, formatWei, purchase } from "@/utils/Wallet.js";
import { SET_INCOME_DIALOG_SHOW } from "@/store/mutation-types.js";

export default {
  components: {
    Dialog
  },
  data() {
    return {
      amount: ''
    };
  },
  mounted() {
    
  },
  asyncComputed: {
    calcData:async function(){
      if(this.amount == '') return null
      const {amount, price_, tax_} = await calcPurchaseRet(this.amount)
      
      return {
        amount: formatWei(amount),
        tax: formatWei(tax_)
      }
    }
  },
  computed: {
    total_issue: function() {
      return parseFloat(this.issueInvest) + parseFloat(this.issueSubscription)
    },
    total_dugout: function() {
      return parseFloat(this.maxTotalIssue)-(parseFloat(this.issueInvest) + parseFloat(this.issueSubscription))
    },
    ...mapState({
      investment: state => formatWei(state.wallet.investment),
      m_totalSupply: state => formatWei(state.wallet.m_totalSupply),
      price: state => formatWei(state.wallet.price),
      balanceOfToken: state => formatWei(state.wallet.balanceOfToken),
      issueInvest: state => formatWei(state.wallet.issueInvest),
      issueSubscription: state => formatWei(state.wallet.issueSubscription),
      maxTotalIssue: state => formatWei(state.wallet.maxTotalIssue),
      usdtAllowance: state => formatWei(state.wallet.usdtAllowance), // USDT授权额度
      usdtBalance: state => formatWei(state.wallet.usdtBalance), // USDT余额
    })
  },
  methods: {
    floor: function(value, decimal = 6) {
      if (value == 0) {
        return 0;
      }
      return _.floor(value, decimal);
    },
    approve: function() {
      this.$refs.approve.open()
    },
    open: function() {
      this.amount = ''
      this.$refs.dialog.open();
      return new Promise(resolve => {
        this.resolve = resolve;
      });
    },
    close: function() {
      this.$refs.dialog.close();
    },
    closed: function() {
      this.resolve();
    },
    confirm: function() {
      if(parseFloat(this.amount) != this.amount){
        this.$toast(this.$t('dialog.purchase.content_3'))
        return false
      }
      if(this.amount <= 0){
        this.$toast(this.$t('dialog.purchase.content_4'))
        return false
      }
      if(this.usdtBalance < this.amount ){
        this.$toast(this.$t("Toast.usdt_content_0"));
        return false
      }
      if(this.investment <= 0 ){
        this.$toast(this.$t('dialog.purchase.content_6'))
        return false
      }
      // if(this.usdtAllowance < this.amount){
      //   this.$parent.approve();
      //   return false
      // }
      if((parseFloat(this.balanceOfToken) + parseFloat(this.calcData.amount)) >= 100){
        this.$toast(this.$t('dialog.purchase.content_5'))
        return false
      }
      purchase(this.amount);
      this.close();
    }
  }
};
</script>
<style lang="scss" scoped>
#redeem {
  .content {
    width: 80%;
    margin: 80px auto 0 auto;
    padding-bottom: 41px;
    h3 {
      font-size: 36px;
      color: #3b3b3b;
    }
    .tips-group {
      margin-top: 30px;
      text-align: left;
      .tip {
        font-size: 22px;
        line-height: 44px;
        color: #fff;
        span {
          color: #ed1b26;
        }
      }
    }

    .form {
      .input-group {
        position: relative;
        font-size: 24px;
        height: 64px;
        line-height: 64px;
        border-bottom: 1Px solid #eaeaea;
        input {
          width: 100%;
          height: 64px;
          line-height: 64px;
          background: none;
          border: none;
          text-align: left;
          text-indent: 24px;
        }

        .symbol {
          position: absolute;
          color: #eaeaea;
          right: 0;
          top: 0;
        }
      }
      
    }

    .btn-group {
      margin-top: 58px;
      display: flex;
      justify-content: space-around;
      .btn {
        width: 100%;
        height: 76px;
        line-height: 76px;
        font-size: 30px;
        border-radius: 30px;
        &.confirm {
          background-color: #ed1b26;
        }
      }
    }

    .notice {
      margin-top: 24px;
      text-align: center;
      font-size: 20px;
      color: #979ea5;
    }
  }
}
</style>