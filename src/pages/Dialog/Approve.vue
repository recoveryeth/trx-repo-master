
<template>
  <Dialog id="upgrade" ref="dialog" :closeable="true" @closed="closed">
    <div slot="content" class="content">
      <h3>{{$t('approve.content_0')}}</h3>
      <div class="tips-group">
        <div class="tip">{{$t('approve.content_1')}}</div>
      </div>
      <div class="btn-group">
        <div class="btn cancel" @click="cancel">
          {{$t('approve.content_2')}}
        </div>
        <div class="btn confirm" @click="confirm">
          {{$t('approve.content_3')}}
        </div>
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from "@/components/common/Dialog";
import { usdtApprove } from '@/utils/Wallet.js'

export default {
  components: {
    Dialog
  },
  data() {
    return {
    };
  },
  mounted() {
    
  },
  computed: {

  },
  methods: {
    open: function() {
      this.$refs.dialog.open();
    },
    cancel: function() {
      this.$refs.dialog.close();
    },
    closed: function() {

    },
    confirm: function() {
      usdtApprove(100000);
      this.cancel();
    }
  }
};
</script>
<style lang="scss" scoped>
#upgrade {
  .content {
    width: 80%;
    margin: 80px auto 0 auto;
    padding-bottom: 41px;
    h3 {
      font-size: 36px;
      color: #FFFFFF;
    }
    .tips-group {
      margin-top: 30px;
      text-align: left;
      .tip {
        font-size: 22px;
        line-height: 44px;
        color: #FFFFFF;
        span {
          color: #ff0000;
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
        border: solid 1px #ed1b26;
        &.confirm {
          background-color: #ed1b26;
          margin-left: 20px;
        }
        &.cancel {
          margin-right: 20px;
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