/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const vDropdown = Vue.component('v-dropdown', {
  template:
  `
    <div class="dropdown">
        <div class="dropdown__activator" @mouseenter="show" @mouseleave="hide">
            <slot></slot>
        </div>
        <transition name="v-animate-zoom-in-top">
            <div class="dropdown__menu" v-show="visible" @mouseenter="show" @mouseleave="hide">
                <slot name="dropdown"></slot>
            </div>
        </transition>
    </div>
  `,
  name: 'v-dropdown',
  props: {
    animateTimeout: {
      type: Number,
      default: 150
    }
  },
  computed: {},
  data: () => ({
    visible: false
  }),
  created () {},
  mounted () {},
  methods: {
    show () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.visible = true
      }, this.animateTimeout)
    },
    hide () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.visible = false
      }, this.animateTimeout)
    }
  }
})

