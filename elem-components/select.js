/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { valueEquals } = window.WHSITE['UTILS']

/**
 * select
 */
const hSelect = Vue.component('h-select', {
  name: 'h-select',
  template: `
      <div :class="['eo__select', focused ? 'eo__select--focused' : '']" v-clickoutside="close">
        <div class="eo__prefix" v-if="$slots.prefix" ref="prefix">
          <slot name="prefix"></slot>
        </div>
        <input 
            class="eo__select__inner"
            :class="cls"
            :size="inputSize"
            :placeholder="currentPlaceholder"
            :type="type"
            :data-text="maxlength"
            :maxlength="maxlength"
            :disabled="isDisabled"
            @input="handleInput"
            @blur="handleBlur"
            @click="handleClick"
            autocomplete="eo-ui"
            :readonly="readOnly"
            v-model="selectedLabel"
        />

        <div class="eo__suffix eo__suffix__none" v-if="$slots.suffix" ref="suffix" @click="toggle">
          <slot name="suffix"></slot>
        </div>
        <transition name="v-animate-zoom-in-top" appear>
        <ul v-show="visible" class="eo__select__list" ref="select" :class="cls">
            <slot v-if="!loading"></slot>
            <li v-if="loading" class="eo__select__option__loading">
                <div class="eo__select__option__loading__svg">
                </div>
            </li>
        </ul>
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
  provide () {
    return {
      hSelect: this
    }
  },
  directives: {
    Clickoutside
  },
  props: {
    disabled: Boolean,
    value: [String, Number],
    validateEvent: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: String,
    maxlength: String,
    size: String,
    loading: {
      type: Boolean,
      default: false
    },
    cls: String,
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isDisabled () {
      return this.disabled || (this.elForm || {}).disabled
    },
    inputSize () {
      return this.size
    },
    propPlaceholder () {
      return typeof this.placeholder !== 'undefined' ? this.placeholder : ''
    }
  },
  watch: {
    value (val, old) {
      if (val && this.options.some(item => item.value === val)) {
        this.selectedLabel = this.options.find(i => { return i.value === val }).label
        this.prevValue = val
        if (this.validateEvent) {
          this.dispatch('v-form-item', 'form.field.change', [val])
        }
      } else {
        this.selectedLabel = val
      }
      // console.log(val, this.options.some(item => item.value === val))
    },
    propPlaceholder (val) {
      this.currentPlaceholder = val
    }
  },
  data: () => ({
    focused: false,
    visible: false,
    readOnly: true,
    options: [],
    currentPlaceholder: '',
    selectedLabel: '',
    softFocus: false,
    prevValue: ''
  }),
  created () {
    this.$on('select.option.add', (option) => {
      if (option) {
        this.options = [...this.options, option]
      }
    })
    this.$on('select.option.click', this.handleOptionSelect)
  },
  mounted () {
    this.$nextTick(() => {
      // 防止suffix/prefix中的dom没有渲染完毕
      this.currentPlaceholder = this.propPlaceholder
      this.$slots.prefix && this.fieldLabelUpdate()
    })
  },
  methods: {
    fieldLabelUpdate (width = '') {
      // vue 中不能检测 ref solt 的变化所以只能通过触发自定义事件的方式来修正 label的left
      document.contains(this.$el) && this.dispatch('v-form-item', 'form.field.label.update', width || this.$refs.prefix.getBoundingClientRect().width)
    },
    handleInput (event) {
      this.$emit('input', event.target.value)
      this.broadcast('h-option', 'queryChange', event.target.value)
      this.broadcast('h-option-group', 'groupQueryChange')
      if (this.$children.every(child => !child.visible)) {
        this.broadcast('h-option', 'queryChange', '')
        this.broadcast('h-option-group', 'groupQueryChange')
      }
    },
    handleFocus (event) {
      if (!this.softFocus) {
        this.visible = true
        this.focused = true
        this.$emit('input', '')
        this.$emit('focus', event)
        this.broadcast('h-option', 'queryChange', '')
        this.broadcast('h-option-group', 'groupQueryChange')
        this.softFocus = true
      }
    },
    handleBlur (event) {
      setTimeout(() => {
        this.visible = false
        this.focused = false
        this.readOnly = true
        if (this.value && this.options.some(item => item.value === this.value)) {
          this.selectedLabel = this.options.find(i => { return i.value === this.value }).label
        } else {
          if (this.options.some(item => item.value === this.prevValue)) {
            this.$emit('input', this.prevValue)
          } else {
            this.$emit('input', '')
          }
        }
        this.$emit('blur', event)
        if (this.validateEvent) {
          this.dispatch('v-form-item', 'form.field.blur', [this.value])
        }
        this.softFocus = false
      }, 100)
    },
    handleClick (event) {
      if (this.visible) {
        this.readOnly = false
        this.handleFocus(event)
      } else {
        this.visible = true
      }
    },
    handleChange (option) {
      this.$emit('change', option.value)
    },
    handleOptionSelect (option) {
      // console.log(`handleOptionSelect---${option.value}`)
      this.$emit('input', option.value || option.label)
      this.handleChange(option)
      this.close()
    //   this.$nextTick(() => {
    //     this.handleChange(option)
    //     this.close()
    //   })
    },
    close () {
      if (this.visible) {
        this.visible = false
      }
    },
    toggle (event) {
      this.$nextTick(() => {
        this.visible = !this.visible
      })
    }
  }
})

/**
 * option
 */
const hOption = Vue.component('h-option', {
  name: 'h-option',
  template: `
    <li
      class="eo__select__option"
      :class="{
        'eo__select__option--selected': selected,
        'eo__select__option--disabled': disabled || groupDisabled
      }"
      @click.stop="handleOptionClick"
      v-show="visible"
    >
      <slot>
        <span>{{ currentLabel }}</span>
      </slot>
    </li>
    `,
  mixins: [emitter()],
  inject: ['hSelect'],
  props: {
    value: [String, Number],
    label: [String, Number],
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentLabel () {
      return this.label || this.value
    },
    currentValue () {
      return this.value || this.label || ''
    },
    selected () {
      return valueEquals(this.hSelect.selectedLabel, this.currentLabel)
    }
  },
  data: () => ({
    visible: true,
    groupDisabled: false
  }),
  created () {
    this.$on('handleGroupDisabled', this.handleGroupDisabled)
    this.$on('queryChange', this.queryChange)
  },
  mounted () {
    if (this.currentValue) {
      this.dispatch('h-select', 'select.option.add', this)
    }
  },
  methods: {
    handleGroupDisabled (val) {
      this.groupDisabled = val
    },
    queryChange (query) {
      this.visible = new RegExp(escapeRegexpString(query).toLocaleLowerCase(), 'i').test(this.currentLabel.toLocaleLowerCase())
    },
    handleOptionClick () {
      if (!this.disabled && !this.groupDisabled) {
        this.dispatch('h-select', 'select.option.click', this)
      }
    }
  },
  beforeDestroy () {
    const index = this.hSelect.options.indexOf(this)
    if (index > -1) {
      this.hSelect.options.splice(index, 1)
    }
  }
})

/**
 * option-group
 */
const hOptionGroup = Vue.component('h-option-group', {
  name: 'h-option-group',
  template: `
    <ul class="eo-select-group__wrap" v-show="visible">
        <li class="eo-select-group__title">{{ label }}</li>
        <li>
        <ul class="eo-select-group">
            <slot></slot>
        </ul>
        </li>
    </ul>
      `,
  mixins: [emitter()],
  props: {
    label: [String, Number],
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    visible: true
  }),
  watch: {
    disabled (val) {
      this.broadcast('h-option', 'handleGroupDisabled', val)
    }
  },
  mounted () {
    if (this.disabled) {
      this.broadcast('h-option', 'handleGroupDisabled', this.disabled)
    }
  },
  methods: {
    groupQueryChange () {
      this.visible = this.$children && Array.isArray(this.$children) && this.$children.some(option => option.visible === true)
    }
  },
  created () {
    this.$on('groupQueryChange', this.groupQueryChange)
  }
})
