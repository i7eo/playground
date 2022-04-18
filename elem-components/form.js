/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { emitter, debounce, clickoutside, print, likeQuery } = window.WHSITE['UTILS']

const useConsole = (data) => {
  print('Info', 'form', data)
}

function findChildren (componentName = '', _this) {
  let children = null

  function find (childrens) {
    for (let i = 0; i < childrens.length; i++) {
      if (childrens[i].$options.name === componentName) {
        children = childrens[i]
      } else {
        if (childrens[i].$children && childrens[i].$children.length > 0) {
          find(childrens[i])
        }
      }
    }
  }

  if (_this.$children && _this.$children.length > 0) find(_this.$children)

  return children
}

const Clickoutside = clickoutside()

/* Utils
========================================================================== */
function objectAssign (target) {
  for (let i = 1, j = arguments.length; i < j; i++) {
    const source = arguments[i] || {}
    for (const prop in source) {
      if (source.hasOwnProperty(prop)) {
        const value = source[prop]
        if (value !== undefined) {
          target[prop] = value
        }
      }
    }
  }

  return target
}
function getPropByPath (obj, path, strict) {
  let tempObj = obj
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')

  const keyArr = path.split('.')
  let i = 0
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break
    const key = keyArr[i]
    if (key in tempObj) {
      tempObj = tempObj[key]
    } else {
      if (strict) {
        useConsole(`please transfer a valid prop path to form item!`)
      }
      break
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null
  }
}
function findItemTargetValue (dom, type) {
  let childrens = []
  if (dom.childNodes.length) childrens = [...dom.childNodes]
  return childrens.find((node) => node.nodeName.toLocaleLowerCase() === type)
}

/**
 * 去空格
 */
function escapeRegexpString(value = '') {
  return String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
}

/* Form
========================================================================== */
const vForm = Vue.component('v-form', {
  name: 'v-form',
  template: `
    <form>
        <slot></slot>
    </form>
  `,
  provide () {
    return {
      vForm: this
    }
  },
  props: {
    model: Object,
    rules: Object,
    disabled: Boolean
  },
  computed: {},
  data: () => ({
    fields: [],
    errors: {}
  }),
  created () {
    this.$on('form.field.add', (field) => {
      if (field) {
        this.fields = [...this.fields, field]
      }
    })
    this.$on('form.field.remove', (field) => {
      if (field) {
        this.fields = this.fields.filter(({ prop }) => prop !== field.prop)
      }
    })
  },
  mounted () {},
  methods: {
    validate (callback) {
      if (!this.model) {
        useConsole(`[vForm] model is required for validate to work!`)
        return
      }

      let promise
      // if no callback, return promise
      if (typeof callback !== 'function' && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          callback = function (valid) {
            valid ? resolve(valid) : reject(valid)
          }
        })
      }

      let valid = true
      let count = 0
      // 如果需要验证的fields为空，调用验证时立刻返回callback
      if (this.fields.length === 0 && callback) {
        callback(true)
      }
      let invalidFields = {}
      this.fields.forEach((field) => {
        field.validate('', (message, field) => {
          if (message) {
            valid = false
          }
          invalidFields = objectAssign({}, invalidFields, field)
          if (typeof callback === 'function' && ++count === this.fields.length) {
            callback(valid, invalidFields)
          }
        })
      })

      if (promise) {
        return promise
      }
    }
  }
})

/* FormItem
========================================================================== */
const vFormItem = Vue.component('v-form-item', {
  name: 'v-form-item',
  template: `
    <div 
      :class="['field', labelFloated ? 'field--label-floated' : '', validateMessage ? 'field--error' : '']" 
      :form-field="prop">
        <label v-if="label" class="field__label" :for="prop" :style="{paddingLeft: paddingLeft}">{{ label }}</label>
        <slot></slot>
        <p v-if="description" class="field__description">{{ description }}</p>
        <div v-show="validateMessage" class="field__message field__message--error" v-html="validateMessage"></div>
    </div>
  `,
  mixins: [emitter()],
  provide () {
    return {
      vFormItem: this
    }
  },
  inject: ['vForm'],
  props: {
    prop: String,
    label: String,
    description: String
  },
  computed: {
    labelFloated () {
      return !!this.fieldValue
    },
    fieldValue () {
      const model = this.vForm.model
      if (!model || !this.prop) {
        return
      }
      const path = this.prop
      return getPropByPath(model, path, true).v
    }
  },
  data: () => ({
    validateMessage: '',
    paddingLeft: ''
  }),
  mounted () {
    if (this.$props) {
      this.dispatch('v-form', 'form.field.add', this)
    }
    // this.$nextTick(() => {
    //   this.addValidateEvents()
    // })
    this.addValidateEvents()
  },
  beforeDestroy () {
    if (this.$props) {
      this.dispatch('v-form', 'form.field.remove', this)
    }
  },
  methods: {
    addValidateEvents () {
      this.$on('form.field.label.update', this.onFieldLabelUpdate)

      // const rules = this.getRules()
      // if (rules && rules.length) {
      //   this.$on('form.field.blur', this.onFieldBlur)
      //   this.$on('form.field.change', this.onFieldChange)
      // }

      // 级联查询地址修改
      this.$on('form.field.blur', this.onFieldBlur)
      this.$on('form.field.change', this.onFieldChange)
    },
    removeValidateEvents () {
      this.$off()
    },
    getRules () {
      let formRules = this.vForm.rules
      const selfRules = this.rules

      const prop = getPropByPath(formRules, this.prop || '')
      formRules = formRules ? prop.o[this.prop || ''] || prop.v : []

      return [].concat(selfRules || formRules || [])
    },
    getRuleByTriggerName (trigger) {
      const rules = this.getRules()

      return rules
        .filter((rule) => {
          if (!rule.trigger || trigger === '') return true
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.indexOf(trigger) > -1
          } else {
            return rule.trigger === trigger
          }
        })
        .map((rule) => objectAssign({}, rule))
    },
    validate (trigger, callback = () => {}) {
      const rules = this.getRuleByTriggerName(trigger)
      if (!rules || rules.length === 0) {
        callback()
        return true
      }

      const descriptor = {}
      if (rules && rules.length > 0) {
        rules.forEach((rule) => {
          delete rule.trigger
        })
      }
      descriptor[this.prop] = rules

      const validator = new window.AsyncValidator(descriptor)
      const model = {}
      model[this.prop] = this.fieldValue

      validator.validate(model, (errors, invalidFields) => {
        this.validateMessage = errors ? errors[0].message : ''
        callback(this.validateMessage, invalidFields)
      })
    },
    onFieldLabelUpdate (value) {
      // 要把原生的input select 的margin + padding （11 + 1 = 12）加上
      this.paddingLeft = `${value + 12}px`
    },
    onFieldBlur () {
      this.validate('blur')
    },
    onFieldChange () {
      this.validate('change')
    }
  }
})

/* Component
========================================================================== */
const vInput = Vue.component('v-input', {
  name: 'v-input',
  template: `
    <div :class="['eo__input', focused ? 'eo__input--focused' : '']">
      <div class="eo__prefix" v-if="$slots.prefix" ref="prefix">
        <slot name="prefix"></slot>
      </div>
      <input 
          class="eo__input__inner"
          :size="inputSize"
          :placeholder="placeholder"
          :type="type"
          :data-text="maxlength"
          :maxlength="maxlength"
          :disabled="isDisabled"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          @keyup.enter="handleKeyUpChange"
          autocomplete="off"
          ref="input"
      />
      <div class="eo__suffix" v-if="$slots.suffix" ref="suffix">
        <slot name="suffix"></slot>
      </div>
    </div>
  `,
  mixins: [emitter()],
  inject: {
    vForm: {
      default: ''
    },
    vFormItem: {
      default: ''
    }
  },
  props: {
    disabled: Boolean,
    value: [String, Number],
    type: {
      type: String,
      default: 'text'
    },
    placeholder: String,
    maxlength: String,
    validateEvent: {
      type: Boolean,
      default: true
    },
    size: String
  },
  computed: {
    isDisabled () {
      return this.disabled || (this.elForm || {}).disabled
    },
    inputSize () {
      return this.size
    },
    nativeInputValue () {
      return this.value === null || this.value === undefined ? '' : String(this.value)
    }
  },
  watch: {
    value (val) {
      if (this.validateEvent) {
        this.dispatch('v-form-item', 'form.field.change', [val])
      }
    },
    // native input value is set explicitly
    // do not use v-model / :value in template
    // see: https://github.com/ElemeFE/element/issues/14521
    nativeInputValue () {
      this.setNativeInputValue()
    }
  },
  data: () => ({
    focused: false
  }),
  mounted () {
    this.setNativeInputValue()
    this.$nextTick(() => {
      // 防止suffix/prefix中的dom没有渲染完毕
      this.$slots.prefix && this.fieldLabelUpdate()
    })
  },
  methods: {
    fieldLabelUpdate (width = '') {
      // vue 中不能检测 ref solt 的变化所以只能通过触发自定义事件的方式来修正 label的left
      document.contains(this.$el) && this.dispatch('v-form-item', 'form.field.label.update', width || this.$refs.prefix.getBoundingClientRect().width)
    },
    setNativeInputValue () {
      const input = findItemTargetValue(this.$el, 'input')
      if (!input) return
      if (input.value === this.nativeInputValue) return
      input.value = this.nativeInputValue
    },
    handleInput (event) {
      // hack for https://github.com/ElemeFE/element/issues/8548
      // should remove the following line when we don't support IE
      if (event.target.value === this.nativeInputValue) return
      this.$emit('input', event.target.value)
      // ensure native input value is controlled
      // see: https://github.com/ElemeFE/element/issues/12850
      this.$nextTick(this.setNativeInputValue)
    },
    handleFocus (event) {
      this.focused = true
      this.$emit('focus', event)
    },
    handleBlur (event) {
      this.focused = false
      this.$emit('blur', event)
      if (this.validateEvent) {
        this.dispatch('v-form-item', 'form.field.blur', [this.value])
      }
    },
    handleChange (event) {
      this.$emit('change', event.target.value)
    },
    handleKeyUpChange (event) {
      this.$emit('keyupenter', event.target.value)
    }
  }
})

/* Component input--autocomplete
========================================================================== */
const vInputAutocomplete = Vue.component('v-input-autocomplete', {
  name: 'v-input-autocomplete',
  template: `
    <div :class="['eo__autocomplete', focused ? 'eo__autocomplete--focused' : '']" v-clickoutside="close">
      <div class="eo__suffix" v-if="$slots.suffix">
        <slot name="suffix"></slot>
      </div>  
      <input 
          class="eo__autocomplete__inner"
          :size="inputSize"
          :placeholder="placeholder"
          :type="type"
          :data-text="maxlength"
          :maxlength="maxlength"
          :disabled="isDisabled"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          autocomplete="off"
      />
      <div class="eo__suffix" v-if="$slots.suffix" ref="suffix">
        <slot name="suffix"></slot>
      </div>
      <transition name="v-animate-zoom-in-top" appear>
        <template v-if="visbile">
          <ul class="eo__autocomplete__list">
            <template v-if="suggestions && suggestions.length > 0">
                <li
                  v-for="(item, idx) in suggestions"
                  :key="'eo__autocomplete__list-item-' + idx"
                  :class="['eo__autocomplete__item', highlightedIndex === idx ? 'highlighted': '']"
                  @click="select(item)"
                >
                  {{ item.label }}
                </li>
            </template>
            <template v-else>
                <v-loading-spinner color="black" :active="!suggestions" size='xl'></v-loading-spinner>
            </template>
          </ul>
        </template>
      </transition>
    </div>
  `,
  mixins: [emitter()],
  inject: {
    vForm: {
      default: ''
    },
    vFormItem: {
      default: ''
    }
  },
  directives: { Clickoutside },
  props: {
    disabled: Boolean,
    value: [String, Number],
    type: {
      type: String,
      default: 'text'
    },
    placeholder: String,
    maxlength: String,
    validateEvent: {
      type: Boolean,
      default: true
    },
    size: String,
    remoteQuery: Function
  },
  computed: {
    isDisabled () {
      return this.disabled || (this.elForm || {}).disabled
    },
    inputSize () {
      return this.size
    },
    nativeInputValue () {
      return this.value === null || this.value === undefined ? '' : String(this.value)
    }
  },
  watch: {
    value (val) {
      if (this.validateEvent) {
        this.dispatch('v-form-item', 'form.field.change', [val])
      }
    },
    // native input value is set explicitly
    // do not use v-model / :value in template
    // see: https://github.com/ElemeFE/element/issues/14521
    nativeInputValue () {
      this.setNativeInputValue()
    }
  },
  data: () => ({
    focused: false,
    loading: false,
    suggestions: null,
    highlightedIndex: 0,
    visbile: false
  }),
  mounted () {
    this.debouncedRemoteQuery = this.remoteQuery ? debounce(this.fetchAutocompleteResult, 600) : null
    this.setNativeInputValue()
    this.$nextTick(() => {
      // 防止suffix/prefix中的dom没有渲染完毕
      this.$slots.prefix && this.fieldLabelUpdate()
    })
  },
  methods: {
    fieldLabelUpdate (width = '') {
      // vue 中不能检测 ref solt 的变化所以只能通过触发自定义事件的方式来修正 label的left
      document.contains(this.$el) && this.dispatch('v-form-item', 'form.field.label.update', width || this.$refs.prefix.getBoundingClientRect().width)
    },
    setNativeInputValue () {
      const input = findItemTargetValue(this.$el, 'input')
      if (!input) return
      if (input.value === this.nativeInputValue) return
      input.value = this.nativeInputValue
    },
    handleInput (event) {
      // hack for https://github.com/ElemeFE/element/issues/8548
      // should remove the following line when we don't support IE
      if (event.target.value === this.nativeInputValue) return
      this.$emit('input', event.target.value)
      // ensure native input value is controlled
      // see: https://github.com/ElemeFE/element/issues/12850
      this.$nextTick(this.setNativeInputValue)
      this.debouncedRemoteQuery && this.debouncedRemoteQuery(event.target.value)
    },
    handleFocus (event) {
      this.focused = true
      this.$emit('focus', event)
      // this.debouncedRemoteQuery && this.debouncedRemoteQuery(event.target.value)
    },
    handleBlur (event) {
      this.focused = false
      this.$emit('blur', event)
      if (this.validateEvent) {
        this.dispatch('v-form-item', 'form.field.blur', [this.value])
      }
    },
    handleChange (event) {
      this.$emit('change', event.target.value)
    },
    fetchAutocompleteResult (keyword) {
      const _keyword = keyword.join('')
      if (_keyword.trim()) {
        this.visbile = true
        this.loading = true
        this.remoteQuery(_keyword, (suggestions) => {
          if (Array.isArray(suggestions)) {
            if (!suggestions.length) this.close()
            this.suggestions = suggestions
          } else {
            console.error('[Autocomplete]autocomplete suggestions must be an array')
          }
          this.loading = false
        })
      }
    },
    select (suggestion) {
      this.$emit('select', suggestion)
      this.close()
    },
    close () {
      if (this.visbile) {
        this.visbile = false
      }
    }
  }
})



/* Component select
========================================================================== */
const vSelect = Vue.component('v-select', {
  name: 'v-select',
  template: `
    <div :class="['eo__select', focused ? 'eo__select--focused' : '']">
      <div class="eo__prefix" v-if="$slots.prefix" ref="prefix">
        <slot name="prefix"></slot>
      </div>
      <select
        :class="['eo__select__inner', cls]"
        v-model="model"
        :disabled="isDisabled"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      >
        <template v-if="$slots.options">
          <slot name="options"></slot>
        </template>
      </select>
      <div class="eo__suffix" v-if="$slots.suffix" ref="suffix" @click="handleFocus">
        <slot name="suffix"></slot>
      </div>
    </div>
  `,
  mixins: [emitter()],
  inject: {
    vForm: {
      default: ''
    },
    vFormItem: {
      default: ''
    }
  },
  props: {
    disabled: Boolean,
    value: [String, Number],
    validateEvent: {
      type: Boolean,
      default: true
    },
    cls: String
  },
  computed: {
    isDisabled () {
      return this.disabled || (this.elForm || {}).disabled
    },
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    value (value) {
      if (this.validateEvent) {
        this.dispatch('v-form-item', 'form.field.change', [value])
      }
    }
  },
  data: () => ({
    focused: false
  }),
  mounted () {
    this.$nextTick(() => {
      // 防止suffix/prefix中的dom没有渲染完毕
      this.$slots.prefix && this.fieldLabelUpdate()
    })
  },
  methods: {
    fieldLabelUpdate (width = '') {
      // vue 中不能检测 ref solt 的变化所以只能通过触发自定义事件的方式来修正 label的left, 避免vnode的缓存：document.contains(this.$el)
      document.contains(this.$el) && this.dispatch('v-form-item', 'form.field.label.update', width || this.$refs.prefix.getBoundingClientRect().width)
    },
    handleFocus (event) {
      this.focused = true
      this.$emit('focus', event)
    },
    handleBlur (event) {
      this.focused = false
      this.$emit('blur', event)
      if (this.validateEvent) {
        this.dispatch('v-form-item', 'form.field.blur', [event.target.value])
      }
    },
    handleChange (event) {
      this.$emit('change', event.target.value)
    }
  }
})

/* Component checkbox
========================================================================== */
const vCheckbox = Vue.component('v-checkbox', {
  name: 'v-checkbox',
  template: `
    <div class="field__checkbox">
      <div class="field__checkbox-wrapper">
        <input
          class="field__checkbox__input"
          type="checkbox"
          v-model="model"
          :id="'field__checkbox--' + label"
          :disabled="isDisabled"
          @focus="focused = true"
          @blur="focused = false"
          @change="handleChange"
        />
      </div>
      <label :for="'field__checkbox--' + label" class="field__checkbox__label" v-if="label">
          {{ label }}
      </label> 
    </div>
  `,
  mixins: [emitter()],
  inject: {
    vForm: {
      default: ''
    },
    vFormItem: {
      default: ''
    }
  },
  props: {
    value: Boolean,
    disabled: Boolean,
    label: String,
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isDisabled () {
      return this.disabled || (this.elForm || {}).disabled
    },
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    value (value) {
      if (this.validateEvent) {
        this.dispatch('v-form-item', 'form.field.change', [value])
      }
    }
  },
  data: () => ({
    focused: false
  }),
  mounted () {},
  methods: {
    handleChange (event) {
      this.$emit('change', event.target.checked)
    }
  }
})
