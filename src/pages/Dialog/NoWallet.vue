
<template>
  <Dialog id="no_wallet" ref="dialog" :closeable="true" @closed="closed">
    <div slot="content" class="content">
      <p class="text">{{$t('wallet.text')}}</p>
      <a href="https://www.tronlink.org/" target="_blank">
        <button>{{$t('wallet.download')}}</button>
      </a>
      <p class="tip">{{$t('wallet.tip0')}}</p>
      <p class="tip">
        {{$t('wallet.tip1')}}
        <a href="/">{{$t('wallet.refresh')}}</a>
      </p>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/common/Dialog'
import { mapState } from 'vuex'
import {SET_RUSH_DIALOG_SHOW, SET_IS_NO_WALLET } from '@/store/mutation-types.js'

export default {
  components: {
    Dialog
  },
  data(){
    return {

    }
  },
  watch: {
    is_no_wallet: function() {
      this.check()
    }
  },
  computed: {
    ...mapState({
      is_no_wallet: state => state.app.is_no_wallet
    })
  },
  mounted(){
    this.check()
  },
  beforeDestroy(){
    
  },
  methods: {
    check: function() {
      if(this.is_no_wallet) {
        this.open()
      }
    },
    open: function() {
      this.$refs.dialog.open()
    },
    close: function() {
      this.$refs.dialog.open()
    },
    closed: function() {
      this.$store.commit(SET_IS_NO_WALLET, false)
    },
  }
}
</script>
<style lang="scss"  src='@/assets/css/pages/dialog/noWallet.scss' scoped></style>