/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { emitter, typeOf, print } = window.WHSITE['UTILS']

const useConsole = (data) => {
  print('Info', 'table', data)
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
        throw new Error('please transfer a valid prop path to form item!')
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

const vTableColumn = Vue.component('v-table-column', {
  template:
  `
  <span class="component__extract" hidden> {{ label }} </span>
  `,
  name: 'v-table-column',
  mixins: [emitter()],
  props: {
    label: String,
    prop: String,
    width: String
  },
  data: () => ({
  }),
  mounted () {
    if (this.$props) {
      this.dispatch('v-table', 'table.column.add', this)
    }
  },
  methods: {
    createCell (h, row = null, column = null) {
      const { prop } = this
      if (!row && column) {
        // 创建 header 的 cell
        if (column.label) {
          return (<div class='cell'>{ column.label }</div>)
        } else {
          useConsole('table.column label not config')
        }
      }

      if (row && column) {
        // 创建 body 的 cell
        const notranslateCls = (column.prop === 'price' || column.prop === 'total') ? 'notranslate' : ''
        const props = {
          class: `cell ${column.prop} ${notranslateCls}`
        }
        const value = prop && getPropByPath(row, column.prop).v
        let children = null
        if (column.$scopedSlots.scope) {
          children = this.$scopedSlots.scope(value)
        }
        return (<div { ...props }> { children || value } </div>)
      }
    }
  },
  beforeDestroy () {
    if (this.$props) {
      this.dispatch('v-table', 'table.column.remove', this)
    }
  }
})

const vTableHeader = Vue.component('v-table-header', {
  name: 'v-table-header',
  inject: ['vTable'],
  props: {
    hiddenHeader: Boolean
  },
  render (h) {
    const data = this.data || []
    return (
      data.length > 0 && !this.hiddenHeader && (
        <div class='table__header-wrapper' >
          <table class='table__header' cellpadding='0' cellspacing='0' border='0' style='width:100%'>
            <thead>
              <tr>
                {
                  data.map((column, idx) => {
                    return (
                      <th key={`v-table-header-th-${idx}`} colspan='1' rowspan='1' style={{ width: column.width }}>
                        { column.createCell(h, null, column) }
                      </th>
                    )
                  })
                }
              </tr>
            </thead>
          </table>
        </div>
      )
    )
  },
  data: () => ({
    data: []
  }),
  mounted () {
    if (this.vTable.columns.length > 0) {
      this.data = this.vTable.columns
    } else {
      useConsole('table.column not config')
    }
  }
})

const vTableFooter = Vue.component('v-table-footer', {
  template:
  `
  <div v-if="data.length > 0" class="table__footer-wrapper">
    <table class="table__footer" cellpadding="0" cellspacing="0" border="0">
        <tbody>
            <tr>
                <td>footer</td>
            </tr>
        </tbody>
    </table>
  </div>
  `,
  name: 'v-table-footer',
  props: {
    data: Array
  }
})

const vTableBody = Vue.component('v-table-body', {
  name: 'v-table-body',
  inject: ['vTable'],
  props: {
    data: Array,
    height: String
  },
  computed: {
    isScrollY () {
      return !!this.height
    }
  },
  render (h) {
    const data = this.data || []
    return (
      data.length > 0 && <div class={this.isScrollY ? 'table__body-wrapper scrollable-y' : 'table__body-wrapper'} style={{ height: this.isScrollY ? this.height : '' }}>
        <table class='table__body' cellpadding='0' cellspacing='0' border='0' style='width:100%'>
          <tbody>
            {
              data.map((row, idx) => {
                return (
                  <tr key={`v-table-body-row-tr-${idx}`}>
                    {
                      this.createRow(h, row, idx)
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  },
  mounted () {
  },
  methods: {
    createRow (h, row, idx) {
      return this.vTable.columns.map((column, _idx) => {
        return (<td key={`v-table-body-row-tr-${idx}-td-${_idx}`} style={{ width: column.width }}>{ column.createCell(h, row, column) }</td>)
      })
    }
  }
})

const vTable = Vue.component('v-table', {
  template:
  `
  <section v-if="table" :class="['table', 'table--enable-row-transition', hoverMarkup, borderMarkup]">
    <slot></slot>
    <v-table-header :data="header" :hiddenHeader="hiddenHeader"></v-table-header>
    <v-table-body :data="body" :height="height"></v-table-body>
    <v-table-footer :data="footer"></v-table-footer>
  </section>
  `,
  name: 'v-table',
  components: { vTableHeader, vTableBody, vTableFooter },
  provide () {
    return {
      vTable: this
    }
  },
  props: {
    table: {
      tye: Object,
      default: null
    },
    hover: Boolean,
    border: Boolean,
    hiddenHeader: Boolean,
    height: {
      type: String,
      default: ''
    }
  },
  computed: {
    header () {
      if (typeOf(this.table.header) === 'Array') {
        return this.table.header
      } else {
        this.table.header && useConsole('table.header type must be Array')
        return []
      }
    },
    body () {
      if (typeOf(this.table.body) === 'Array') {
        return this.table.body
      } else {
        this.table.body && useConsole('table.body type must be Array')
        return []
      }
    },
    footer () {
    //   if (typeOf(this.table.footer) === 'Array') {
    //     return this.table.footer
    //   } else {
    //     this.table.footer && useConsole('table.footer type must be Array')
    //     return []
    //   }
      return []
    },
    hoverMarkup () {
      return this.hover ? 'table--enable-row-hover' : ''
    },
    borderMarkup () {
      return this.border ? '' : ''
    }
  },
  data: () => ({
    columns: []
  }),
  created () {
    this.$on('table.column.add', column => {
      if (column) {
        this.columns = [...this.columns, column]
      }
    })
    this.$on('table.column.remove', column => {
      if (column) {
        this.columns = this.columns.filter(({ prop }) => prop !== column.prop)
      }
    })
  },
  mounted () {
  }
})
