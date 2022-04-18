/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { print } = window.WHSITE['UTILS']

const useConsole = (data) => {
  print('Info', 'tag', data)
}

const vTag = Vue.component('v-tag', {
  template:
  `
  <li class="tag">
    <div class="tag__text">
        <slot></slot>
    </div>
    <div class="tag__close" v-if="closable">
        <button type="button" class="btn btn--text" @click="closeHandler">
            <svg class="icon-svg icon-svg--size16" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11.414 10l4.293-4.293a.999.999 0 10-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 10-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 101.414 1.414L10 11.414l4.293 4.293a.997.997 0 001.414 0 .999.999 0 000-1.414L11.414 10z"/></svg>
        </button>
    </div>
  </li>
  `,
  name: 'v-tag',
  props: {
    closable: Boolean
  },
  mounted () {
  },
  methods: {
    closeHandler (event) {
      event.stopPropagation()
      this.$emit('close', event)
    }
  }
})

const vTagList = Vue.component('v-tag-list', {
  template:
  `
  <transition name="v-animate-fade" appear>
    <div class="tag__list">
      <transition-group name="v-animate-list--item" tag="ul" appear>
        <slot></slot>
      </transition-group>
    </div>
  </transition>
  `,
  name: 'v-tag-list'
})
