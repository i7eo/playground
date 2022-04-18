/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const vTabs = Vue.component('v-tabs', {
  template:
  `
    <section class="tabs">
      <ul class="tabs__title">
          <template v-for="(title, idx) in config.titles">
              <li :key="'tabs-' + title + '-' + idx" @click="tabsTitleClickHandler(idx)">
                  <a href="javascript:;" :class="idx === config.active ? 'active' : ''">{{ title }}</a>
              </li>
          </template>
          <li class="tabs__indicator" :style="indicatorStyle"></li>
      </ul>
      <div class="tabs__content swiper-container">
          <div class="swiper-wrapper">
              <template v-for="(content, idx) in config.contents">
                  <div :key="'tabs-content-' + idx" class="swiper-slide" v-html="content"></div>
              </template>
          </div>
      </div>
    </section>
  `,
  name: 'v-tabs',
  props: {
    config: { type: Object }
  },
  computed: {

  },
  data: () => ({
    swiper: null,
    contentSwiper: {
      type: 'TabSwiper',
      spaceBetween: 10,
      simulateTouch: false
    },
    indicatorStyle: {
      width: '0px',
      left: '0'
    }
  }),
  mounted () {
    this.initContentSwiper()
    this.$nextTick(() => {
      this.updateIndicatorStyle()
    })
  },
  methods: {
    initContentSwiper () {
      this.swiper = new Swiper(this.config.contentSwiperEl, this.contentSwiper)
      this.swiper.on('slideChange', () => {
        this.updateTab(this.swiper.activeIndex)
      })
    },
    updateIndicatorStyle () {
      const active = this.config.active
      const offsets = document.querySelectorAll('.tabs__title li:not(.tabs__indicator)')[active]
      const offsetsReffer = document.querySelector('.tabs__title').offsetLeft
      this.indicatorStyle.left = `${offsets.offsetLeft - offsetsReffer}px`
      this.indicatorStyle.width = `${offsets.offsetWidth - 50}px`
    },
    tabsTitleClickHandler (active) {
      this.swiper.slideTo(active)
      this.updateTab(active)
    },
    updateTab (active) {
      this.$nextTick(() => {
        this.updateIndicatorStyle()
      })
      this.$emit('update-tab-info', {
        active
      })
    }
  }
})

