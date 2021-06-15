<template>
  <div id="app">
    <div class="view">
      <Top ref="top" v-if="is_top"></Top>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      <Loading></Loading>
      <NoWallet></NoWallet>
      <LoadingError></LoadingError>
      <Guide></Guide>
    </div>
    <van-tabbar v-model="active" route>
      <van-tabbar-item replace to="/" name="home">
        <div slot="icon" class="tabbar-icon">
          <img v-if="active == 'home'" src="../src/assets/img/about-active.png"/>
          <img v-else src="../src/assets/img/about.png"/>
        </div>
        <span class="tabber-text">{{$t('app.content_1')}}</span>
      </van-tabbar-item>
      <van-tabbar-item replace to="/usdt" name="usdt">
        <div slot="icon" class="tabbar-icon">
          <img v-if="active == 'usdt'" src="../src/assets/img/usdt-active.png"/>
          <img v-else src="../src/assets/img/usdt.png"/>
        </div>
        <span class="tabber-text">USDT</span>
      </van-tabbar-item>
      <van-tabbar-item replace to="/repo" name="repo">
        <div slot="icon" class="tabbar-icon">
          <img v-if="active == 'repo'" src="../src/assets/img/repo-active.png"/>
          <img v-else src="../src/assets/img/repo.png"/>
        </div>
        <span class="tabber-text">REPO</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Top from '@/components/layout/Top'
  import Loading from '@/components/common/Loading'
  import LoadingError from '@/components/common/LoadingError'
  import Guide from '@/components/common/Guide'
  import NoWallet from '@/pages/Dialog/NoWallet'
  import { ethers } from "ethers";

  const NO_TOP_PAGE = ['reward', 'DirectPush']

  export default {
    name: 'App',
    metaInfo() {
      return {
        title: this.$t('META.TITLE')
      }
    },
    data() {
      return {
        is_top: true,
        active: 'home'
      }
    },
    created() {
      // console.log(ethers.utils.parseUnits("1000000000000000000"),"ether");
      // console.log(ethers.utils.parseUnits("50000000000000000"),"ether");
      // console.log(ethers.utils.formatUnits("360000000000000000","ether"));
      // console.log(ethers.utils.formatUnits("18000000000000000000","ether"));
      switch(true){
        case window.location.hash.toLowerCase().search('usdt') > -1:
          this.active = 'usdt'
          break;
        case window.location.hash.toLowerCase().search('epro') > -1:
          this.active = 'epro'
          break;
        default:
          this.active = 'home'
      }
    },
    components: {
      Top,
      Loading,
      LoadingError,
      Guide,
      NoWallet
    },
    watch: {

    },
    computed: {
      ...mapState({

      })
    },
    mounted() {

    },
    methods: {
      checkEnable: function(){
        if(!this.dapp_enable){
          if(document.location.href.indexOf('/404') == -1){
            this.$router.push('/404')
          }
        }else{
          if(document.location.href.indexOf('/404') > -1){
            this.$router.push('/')
          }
        }
      },
      isTop: function() {
        const hash = window.location.hash.split('/')[1]
        this.is_top = (NO_TOP_PAGE.indexOf(hash) <= -1)
      },
    }
  }
</script>
