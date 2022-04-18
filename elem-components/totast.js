/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const vToast = Vue.component('v-toast', {
  template: `
    <transition name="v-animate-fade" appear>
        <div :class="['toast', toastStatusCls]" v-show="active">
            <transition name="v-animate-slideUp" appear>
                <div class="toast__content" v-show="active">
                    <div class="toast__header">
                        <div class="toast__icon">
                            <template v-if="toastStatus === 'success'">
                                <svg class="icon-svg icon-svg--size24">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm0-2c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm3.784-13.198c.386-.396 1.02-.404 1.414-.018.396.386.404 1.02.018 1.414l-5.85 6c-.392.403-1.04.403-1.432 0l-3.15-3.23c-.386-.396-.378-1.03.018-1.415.395-.385 1.028-.377 1.414.018l2.434 2.5 5.134-5.267z"></path></svg>
                                </svg>
                            </template>
                            <template v-if="toastStatus === 'warning'">
                                <svg class="icon-svg icon-svg--size24">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 22"><path d="M15.286 2.386l7.91 13.857C25.01 19.423 23.65 22 20.16 22H3.84C.35 22-1.01 19.427.805 16.243l7.91-13.857c1.815-3.178 4.754-3.185 6.57 0zm-1.737.992c-1.05-1.838-2.05-1.837-3.1 0L2.54 17.235C1.468 19.122 1.93 20 3.84 20h16.32c1.91 0 2.374-.88 1.298-2.765l-7.91-13.857zM12 6.5c.552 0 1 .448 1 1V12c0 .552-.448 1-1 1s-1-.448-1-1V7.5c0-.552.448-1 1-1zm-1.5 10c0-.828.666-1.5 1.5-1.5.828 0 1.5.666 1.5 1.5 0 .828-.666 1.5-1.5 1.5-.828 0-1.5-.666-1.5-1.5z"></path></svg>
                                </svg>
                            </template>
                            <template v-if="toastStatus === 'error'">
                                <svg class="icon-svg icon-svg--size24">
                                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M511.737535 976.005172c-255.44404 0-463.252687-207.807354-463.252687-463.263031 0-255.44404 207.808646-463.251394 463.252687-463.251394 255.454384 0 463.26303 207.807354 463.263031 463.251394-0.001293 255.455677-207.808646 463.26303-463.263031 463.263031z m0-860.034586C292.954505 115.970586 114.964687 293.960404 114.964687 512.742141c0 218.762343 177.989818 396.788364 396.772848 396.788364 218.762343 0 396.788364-178.024727 396.788364-396.788364-0.001293-218.781737-178.02602-396.771556-396.788364-396.771555z m0 0"></path><path d="M558.333414 514.166949L701.414141 372.641616c13.000404-12.832323 13.101253-33.782949 0.262465-46.78206-12.838788-13.005576-33.817859-13.111596-46.788525-0.267637l-143.283717 141.692121L370.514747 325.758707c-12.939636-12.934465-33.852768-13.005576-46.787232-0.065939-12.939636 12.903434-12.969374 33.848889-0.065939 46.787232l140.894384 141.328808L322.500525 654.338586c-13.000404 12.873697-13.101253 33.782949-0.263757 46.788525a32.964525 32.964525 0 0 0 23.531313 9.827556c8.398869 0 16.808081-3.206465 23.262384-9.565091l142.251959-140.690101 143.409132 143.872c6.449131 6.486626 14.924283 9.722828 23.424 9.722828a33.014949 33.014949 0 0 0 23.363232-9.655596c12.934465-12.904727 12.974545-33.819152 0.065939-46.793697L558.333414 514.166949z m0 0"></path></svg>
                                </svg>
                            </template>
                        </div>
                    </div>
                    <div class="toast__body">
                        {{ content }}
                    </div>
                    <div class="toast__footer">
                        <div class="toast__footer-wrapper" v-if="toastHasClose"></div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>`,
  name: 'v-toast',
  computed: {
    toastStatus () {
      return this.status
    },
    toastStatusCls () {
      return `toast--${this.toastStatus}`
    },
    toastHasClose () {
      return this.hasClose
    }
  },
  data: () => ({
    active: false,
    status: 'success',
    content: '',
    duration: 2500,
    hasClose: false
  }),
  mounted () {
    this.init()
  },
  methods: {
    init () {
      setTimeout(() => {
        this.close()
      }, this.duration)
    },
    close () {
      this.active = false
      setTimeout(() => {
        this.$destroy(true)
        this.$el.parentNode.removeChild(this.$el) // 从DOM里将这个组件移除
      }, 500)
    }
  }
})

const ToastFactory = (() => {
  if (!Vue) console.error('please load vue.js')

  const ToastContainer = `<div class="toast__container"></div>`

  const ToastConstructor = Vue.extend(vToast)

  let componentNums = 1

  const Toast = (data) => {
    const id = `v-toast-${componentNums++}`
    const _data = Object.assign({}, data, { active: true })

    const ToastInstance = new ToastConstructor({
      data: _data
    })

    ToastInstance.id = id
    ToastInstance.vm = ToastInstance.$mount() // 挂载但是并未插入dom，是一个完整的Vue实例
    ToastInstance.vm.visible = true
    ToastInstance.dom = ToastInstance.$el

    let toastContainerEl = document.querySelector('.toast__container') // 将dom插入body
    if (toastContainerEl) {
      toastContainerEl.appendChild(ToastInstance.dom)
    } else {
      toastContainerEl = document.createElement('div')
      toastContainerEl.className = `toast__container`
      document.body.appendChild(toastContainerEl)
      toastContainerEl.appendChild(ToastInstance.dom)
    }
    return ToastInstance.vm
  }

  Vue.prototype.$toast = Toast
})()
