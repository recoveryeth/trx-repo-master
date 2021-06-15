<template>
  <div id="about">
    <div class="banner">
      <img v-if="$i18n.locale == 'en'" src='@/assets/img/about/banner_en.png' />
      <img v-else-if="$i18n.locale == 'ko'" src='@/assets/img/about/banner_ko.png' />
      <img v-else-if="$i18n.locale == 'ru-RU'" src='@/assets/img/about/banner_ru-RU.png' />
      <img v-else src='@/assets/img/about/banner_tw.png' />
    </div>
    <div class="block">
      <h2>{{$t('about.content_1')}}</h2>
      <h2>{{$t('about.content_2')}}</h2>
      <div class="gap">
        <p>{{$t('about.content_3')}}</p>
        <p>{{$t('about.content_4')}}</p>
        <img src='@/assets/img/about/usdt.png' style="width: 68px;height: 68px" />
      </div>
    </div>
    <vue-particles
        id="particles-js"
        color="#ed1B26"
        :particleOpacity="0.7"
        :particlesNumber="60"
        shapeType="circle"
        :particleSize="4"
        linesColor="#ed1B26"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="2"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
        class="lizi"
    >
    </vue-particles>

    <div class="block">
      <h2>{{$t('about.content_5')}}</h2>
      <div class="gap">
        <img class="pie" v-if="$i18n.locale == 'en'" src='@/assets/img/about/pie_en.png' />
        <img class="pie" v-else-if="$i18n.locale == 'ko'" src='@/assets/img/about/pie_ko.png' />
        <img class="pie" v-else-if="$i18n.locale == 'ru-RU'" src='@/assets/img/about/pie_ru-RU.png' />
        <img class="pie" v-else src='@/assets/img/about/pie_tw.png' />
      </div>
      <div class="gap">
        <p>{{$t('about.content_6')}}</p>
        <p>{{$t('about.content_7')}}</p>
        <p>{{$t('about.content_8')}}</p>
      </div>
    </div>

    <div class="block">
      <h2>{{$t('about.content_9')}}</h2>
      <div class="gap">
        <p>{{$t('about.content_10')}}</p>
      </div>
    </div>
    <div class="bottom">
      &copy;2019-2020 REPO.All Rights Reserved
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  export default {
    name: 'About',
    components: {
    },
    data() {
      return {
      }
    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    methods: {
    }
  }
</script>

<style lang='scss' src='@/assets/css/pages/about.scss' scoped></style>