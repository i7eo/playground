/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { throttle, scrollSmoothTo } = window.WHSITE['UTILS']

/**
 * 玩具
 * 1. 回到顶部
 * 2. mask 全屏的mask
 * 3. mask inner 铺满容器的mask
 */
const vBackTop = Vue.component('v-back-top', {
  template: `
    <transition name="v-animate-slideUp" appear>
        <button v-show="show" role="button" class="btn btn__back-top" title="Back to Top" @click="backTopClickHandler">
          <svg class="icon-svg icon-svg--size24" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15 13a.997.997 0 01-.707-.293L10 8.414l-4.293 4.293a.999.999 0 11-1.414-1.414l5-5a.999.999 0 011.414 0l5 5A.999.999 0 0115 13z" /></svg>
        </button>
    </transition>
  `,
  name: 'v-back-top',
  data: () => ({
    show: false
  }),
  mounted () {
    this.scrollAnimate()
  },
  methods: {
    scrollAnimate () {
      const _this = this
      window.addEventListener('scroll', throttle(() => {
        const scrollY = window.scrollY || document.body.scrollTop || document.documentElement.scrollTop
        if (scrollY > 180) {
          _this.show = true
        } else {
          _this.show = false
        }
      }, 100))
    },
    backTopClickHandler () {
      scrollSmoothTo()
    }
  },
  beforeDestroy () {
    window.removeEventListener('scroll')
  }
})

const vMask = Vue.component('v-mask', {
  template:
  `
    <div class="mask" v-if="show">
      <div class="ball-pulse ball-pulse-white" v-show="hasLoading">
        <div></div><div></div><div></div>
      </div>
    </div>
  `,
  name: 'v-mask',
  props: {},
  computed: {},
  data: () => ({
    show: false
  }),
  created () {},
  mounted () {},
  methods: {
    open () {
      this.show = true
    },
    close () {
      this.show = false
    }
  }
})

const vMaskInner = Vue.component('v-mask-inner', {
  template:
  `
    <div class="mask--inner" v-if="show">
      <div class="ball-pulse ball-pulse-white" v-show="hasLoading">
        <div></div><div></div><div></div>
      </div>
    </div>
  `,
  name: 'v-mask-inner',
  props: {},
  computed: {},
  data: () => ({
    show: false
  }),
  created () {},
  mounted () {},
  methods: {
    open () {
      this.show = true
    },
    close () {
      this.show = false
    }
  }
})

const WidgetsFactory = (() => {
  if (!Vue) console.error('please load vue.js')

  const widgets = {
    'BackTop': vBackTop,
    'Mask': vMask,
    'MaskInner': vMaskInner
  }

  Object.keys(widgets).map(widgetName => {
    const WidgetConstructor = Vue.extend(widgets[widgetName])
    const Widget = (data) => {
      const id = `v-${widgetName}`
      let container = document.querySelector('body')
      if (data && data.parent) {
        container = data.parent
        delete data['parent']
      }
      const _data = Object.assign({}, data)
      const WidgetInstance = new WidgetConstructor({ data: _data })
      WidgetInstance.id = id
      WidgetInstance.vm = WidgetInstance.$mount()
      WidgetInstance.vm.visible = true
      WidgetInstance.dom = WidgetInstance.$el
      if (container) {
        container.appendChild(WidgetInstance.dom)
        return WidgetInstance.vm
      } else {
        console.log(`[Warning: widget] => ${widgetName} has some error `)
      }
    }
    widgets[widgetName] = Widget
  })

  Vue.prototype.$widgets = widgets
})()
