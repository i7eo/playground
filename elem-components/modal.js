/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const vModal = Vue.component('v-modal', {
  template: `
    <transition name="v-animate-fade">
        <div class="modal" :class="modalAddCls" v-show="config.active">
            <div class="modal__mask"></div>
            <transition :name="'v-animate-' + modalAnimate" appear>
                <div class="modal__dialog" v-show="config.active" @click="modalSingleClose ? '' : closeHandler">
                    <div :class="['modal__content', modalSize]">
                        <div class="modal__header">
                            <slot name="header"></slot>
                            <button type="button" class="btn btn--text btn--back modal__close" v-if="modalHasClose" @click="closeHandler">
                              <svg class="icon-svg icon-svg--size16" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z" />
                              </svg>
                            </button>
                        </div>
                        <div class="modal__body">
                            <slot></slot>
                        </div>
                        <div class="modal__footer">
                            <slot name="footer"></slot>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
  `,
  name: 'v-modal',
  props: {
    config: { type: Object }
  },
  computed: {
    modalSize () {
      return this.config.size ? `modal--${this.config.size}` : `modal--l`
    },
    modalAnimate () {
      return this.config.animate || `slideDown`
    },
    modalHasClose () {
      return this.config.hasClose || true
    },
    modalSingleClose () {
      return this.config.singleClose || false
    },
    modalAddCls () {
      return this.config.className || ''
    }
  },
  watch: {
    'config.active': function (val, oldVal) {
      if (val) {
        this.addModalOpenStatus()
      } else {
        this.removeModalOpenStatus()
      }
    }
  },
  data: () => ({}),
  created () {},
  mounted () {
    if (this.config.active) {
      this.addModalOpenStatus()
    }
  },
  beforeDestroy () {
    this.removeModalOpenStatus()
  },
  methods: {
    addModalOpenStatus () {
      document.body.className += ' modal--open'
    },
    removeModalOpenStatus () {
      document.body.className = document.body.className.replace(
        /\s?modal--open/g,
        ''
      )
    },
    closeHandler () {
      this.$emit('cancel')
    }
  }
})

const vCouponModal = Vue.component('v-coupon-modal', {
  template: `
    <transition name="v-animate-fade">
        <div class="modal" v-show="config.active">
            <div class="modal__mask"></div>
            <transition :name="'v-animate-' + modalAnimate" appear>
                <div class="modal__dialog" v-show="config.active" @click="modalSingleClose ? '' : closeHandler">
                    <div :class="['modal__content__coupon', modalSize]" @click.stop>
                        <button type="button" class="btn btn--text btn--back modal__close__coupon" v-if="modalHasClose" @click="closeHandler">
                          <svg class="icon-svg icon-svg--size25" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z" />
                          </svg>
                        </button>
                        <div class="modal__body__coupon">
                            <div class="modal__body__title">{{config.title}}</div>
                            <div class="modal__body__couponinfo">{{config.couponInfo}}</div>
                            <div class="modal__body__code">{{config.code}}</div>
                            <input id="codeInfo" :value="config.code" />
                            <div class="modal__body__copybtn" @click="copyHandler">click to copy</div>
                            <div class="modal__body__closebtn" @click="closeHandler">SHOP NOW</div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
  `,
  name: 'v-coupon-modal',
  extends: vModal,
  props: {
    config: { type: Object }
  },
  computed: {},
  watch: {},
  data: () => ({}),
  created () {},
  mounted () {},
  methods: {
    copyHandler () {
      document.getElementById('codeInfo').select()
      document.execCommand('copy')
      this.$toast({
        status: 'success',
        content: 'success'
      })
    }
  }
})

const vCheckoutCouponModal = Vue.component('v-checkout-coupon-modal', {
  template: `
    <transition name="v-animate-fade">
        <div class="modal" v-show="config.active">
            <div class="modal__mask"></div>
            <transition :name="'v-animate-' + modalAnimate" appear>
                <div class="modal__dialog" v-show="config.active" @click="modalSingleClose ? '' : closeHandler">
                    <div :class="['modal__content__checkout', modalSize]" @click.stop>
                        <div class="btn btn--text btn--back modal__content__checkout__close" v-if="modalHasClose" @click="closeHandler"></div>
                        <div class="modal__content__checkout__body">
                            <div class="modal__content__checkout__body__info" v-html="config.couponInfo"></div>
                            <div class="modal__content__checkout__body__codecontent">
                              <div class="modal__content__checkout__body__codecontent__codenumber notranslate">{{config.codeNumber}}</div>
                              <div class="modal__content__checkout__body__codecontent__code">CODE: {{config.code}}</div>
                              <input id="codeInfo" :value="config.code" />
                            </div>
                            <div class="modal__content__checkout__body__copybtn" @click="copyHandler">{{config.codeBtn}}</div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
  `,
  name: 'v-coupon-modal',
  extends: vModal,
  props: {
    config: { type: Object }
  },
  computed: {},
  watch: {},
  data: () => ({}),
  created () {},
  mounted () {},
  methods: {
    copyHandler () {
      document.getElementById('codeInfo').select()
      document.execCommand('copy')
      this.$emit('copy')
    }
  }
})