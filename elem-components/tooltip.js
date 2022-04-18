/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const vTooltip = Vue.component('v-tooltip', {
  template:
  `
    <transition name="v-animate-fade" appear>
      <div class="tooltip">
          <button type="button" class="tooltip__control btn btn--text btn--back">
              <slot name="icon"></slot>
          </button>
          <span class="tooltip__content">
              <slot></slot>
          </span>
      </div>
    </transition>
  `,
  name: 'v-tooltip',
  props: {
  },
  computed: {
  },
  data: () => ({}),
  created () {},
  mounted () {
  },
  methods: {
  }
})

