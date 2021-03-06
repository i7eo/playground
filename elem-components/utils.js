/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
window.WHSITE['UTILS'] = {
  request ({ type: method = 'GET', url = '', data, timeout, success, error }) {
    const axiosConfig = {
      method,
      url,
      data
    }
    if (timeout) axiosConfig['timeout'] = timeout
    window.__request__({ ...axiosConfig })
      .then(response => {
        response.data && typeof success === 'function' && success(response.data)
      })
      .catch(error => {
        typeof error === 'function' && error(error.statusText)
      })
  },
  flattened: (arr) => arr.reduce((a, b) => a.concat(b), []),
  trim (string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
  },
  hasClass (el, cls) {
    if (!el || !cls) return false
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
    if (el.classList) {
      return el.classList.contains(cls)
    } else {
      return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
    }
  },
  /* istanbul ignore next */
  addClass (el, cls) {
    if (!el) return
    var curClass = el.className
    var classes = (cls || '').split(' ')
    var els = []
    if (el && !el.length) {
      els = [el]
    } else {
      els = [...el]
    }

    for (var idx = 0; idx < els.length; idx++) {
      var _el = els[idx]
      for (var i = 0, j = classes.length; i < j; i++) {
        var clsName = classes[i]
        if (!clsName) continue

        if (_el.classList) {
          _el.classList.add(clsName)
        } else if (!window.WHSITE.UTILS.hasClass(_el, clsName)) {
          curClass += ' ' + clsName
        }
      }
      if (!_el.classList) {
        _el.className = curClass
      }
    }
  },
  /* istanbul ignore next */
  removeClass (el, cls) {
    if (!el || !cls) return
    var classes = cls.split(' ')
    var curClass = ' ' + el.className + ' '
    var els = []
    if (el && !el.length) {
      els = [el]
    } else {
      els = [...el]
    }

    for (var idx = 0; idx < els.length; idx++) {
      var _el = els[idx]
      for (var i = 0, j = classes.length; i < j; i++) {
        var clsName = classes[i]
        if (!clsName) continue

        if (_el.classList) {
          _el.classList.remove(clsName)
        } else if (window.WHSITE.UTILS.hasClass(_el, clsName)) {
          curClass = curClass.replace(' ' + clsName + ' ', ' ')
        }
      }
      if (!_el.classList) {
        _el.className = window.WHSITE.UTILS.trim(curClass)
      }
    }
  },
  toggleClass (el, cls) {
    if (window.WHSITE.UTILS.hasClass(el, cls)) {
      window.WHSITE.UTILS.removeClass(el, cls)
    } else {
      window.WHSITE.UTILS.addClass(el, cls)
    }
  },
  siblings (el) {
    if (!el || !el.parentNode || !el.parentNode.children) return []
    return Array.prototype.filter.call(el.parentNode.children, (child) =>
      child !== el
    )
  },
  vHoc: (WrappedComponent, { name, lifecycles }) => ({
    name,
    props: typeof WrappedComponent === 'function'
      ? WrappedComponent.options.props
      : WrappedComponent.props,
    render (h) {
      const slots = Object.keys(this.$slots)
        .reduce((arr, key) => arr.concat(this.$slots[key]), [])
        .map(vnode => {
          vnode.context = this._self
          return vnode
        })

      return h(WrappedComponent, {
        on: this.$listeners,
        props: this.$props,
        scopedSlots: this.$scopedSlots,
        attrs: this.$attrs
      }, slots)
    },
    ...lifecycles
  }),
  getQueryString (name) {
    // ????????????
    var url = window.location.search
    // ?????????????????????
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    // ??????????????????
    var result = url.substr(1).match(reg)
    // ???????????????
    return result ? decodeURIComponent(result[2]) : null
  },
  updateHistoryState (param, variant) {
    if (!history.replaceState) {
      return
    }
    if (variant) {
      let newUrl = ''
      if (window.location.search) {
        if(window.location.search.indexOf(param) > -1) {
          var searchArgs = window.WHSITE['UTILS'].getQueryStringArgs()
          searchArgs[param] = variant.id
          const search = window.WHSITE['UTILS'].queryParams(searchArgs)
          newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${search}`
        }else {
          newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}&${param}=${variant.id}`
        }
      }else {
        newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${param}=${variant.id}`
      }
      window.history.replaceState({ path: newUrl }, '', newUrl)
    } else {
      if (window.location.search && window.location.search.indexOf(param) > -1) {
        const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
        window.history.replaceState({ path: newUrl }, '', newUrl)
      }
    }
  },
  useCodefindCountryName (countries, code) {
    for (const name in countries) {
      if (countries[name].code === code) return name
    }
  },
  useCountryNamefindCode (countries, name) {
    for (const _name in countries) {
      if (_name === name) return countries[_name].code
    }
  },
  groupBy (arr, num) {
    const groupNum = Math.floor(arr.length / num)
    const finalNum = arr.length % num
    const chunks = []
    const len = finalNum > 0 ? groupNum + 1 : groupNum
    for (let i = 0; i < len; i++) {
      const step = i * num
      if (step % num === 0) { chunks.push(arr.slice(step, step + num)) }
    }
    return chunks
  },
  throttle (fn, interval) {
    const __self = fn
    let timer
    let firstTime = true
    return function () {
      const args = arguments
      const __me = this
      if (firstTime) {
        __self.apply(__me, args)
        // return firstTime = false
        firstTime = false
      }
      if (timer) {
        return false
      }
      timer = setTimeout(function () {
        clearTimeout(timer)
        timer = null
        __self.apply(__me, args)
      },
      interval || 500)
    }
  },
  debounce (fn, delay) {
    return (...args) => {
      const _this = this
      clearTimeout(fn.id)
      fn.id = setTimeout(function () {
        fn.call(_this, args)
      }, delay)
    }
  },
  scrollSmoothTo (el = document.body, pos = 0) {
    el.scrollIntoView({ behavior: 'smooth' })
  },
  useAvoidScroll () {
    const body = document.body
    const avoidScroll = () => {
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
      body.style.cssText += `position:fixed !important;width:100% !important;top:-${scrollTop}px !important;`
    }
    const restoreScroll = () => {
      body.style.position = ''
      const top = body.style.top
      // ?????????top???????????????????????????????????????top??????????????????????????????
      body.scrollTop = document.documentElement.scrollTop = -parseInt(top)
      body.style.top = ''
      body.style.width = ''
    }
    return [avoidScroll, restoreScroll]
  },
  replaceSingleQuotes (name) {
    return name.replace(/\'/g, '')
  },
  setCookie (name, val, expires, domain) {
    // ????????????cookie??????????????????2?????????????????? .
    var __CurrentMainDomain__ = (function () {
      var hostnameArray = location.hostname.split('.')
      if (hostnameArray === 'localhost') return hostnameArray.join('.')
      return hostnameArray.join('.')
    })()

    domain = domain || __CurrentMainDomain__
    var text = String(encodeURIComponent(val))
    var date = new Date()
    date.setTime(date.getTime() + Number(expires) * 1000)
    text += '; expires=' + date.toUTCString()
    // domain
    text += '; path=/'
    if (typeof domain !== 'undefined' && domain !== '') {
      text += '; domain=' + __CurrentMainDomain__
    }

    document.cookie = name + '=' + text
  },
  getCookie (name) {
    var value = '; ' + document.cookie
    var parts = value.split('; ' + name + '=')
    if (parts.length >= 2) {
      return decodeURIComponent(parts.pop().split(';').shift())
    } else {
      return undefined
    }
  },
  deleteCookie (name) {
    var cval = window.WHSITE['UTILS'].getCookie(name)
    if (cval != null) {
      window.WHSITE['UTILS'].setCookie(name, '', -1)
    }
  },
  /**
   *
   * @param {*} array
   * ???????????????????????????
   */
  cartesian (array) {
    return array.reduce(
      function (a, b) {
        return a
          .map(function (x) {
            return b.map(function (y) {
              return x.concat(y)
            })
          })
          .reduce(function (a, b) {
            return a.concat(b)
          }, [])
      },
      [[]]
    )
  },

  /**
   *
   * @param {*} array
   * ???????????????????????????????????????????????????????????????C(n,n) => 2???n??????
   * eg: powerset([1,2,3]) => [] [1] [2] [3] [1,2] [1,3] [2,3] [1,2,3] ??????????????????????????????????????????????????????????????????????????????[2,1]
   */
  powerset (array) {
    var ps = [[]]
    for (var i = 0; i < array.length; i++) {
      for (var j = 0, len = ps.length; j < len; j++) {
        ps.push(ps[j].concat(array[i]))
      }
    }
    return ps
  },

  /**
   *
   * @param  {...any} fns
   * ?????????????????????
   */
  pipe (...fns) {
    return (args) => fns.reduce((result, fn) => fn(result), args)
  },
  emitter () {
    function broadcast (componentName, eventName, params) {
      this.$children.forEach(child => {
        var name = child.$options.name

        if (name === componentName) {
          child.$emit.apply(child, [eventName].concat(params))
        } else {
          broadcast.apply(child, [componentName, eventName].concat([params]))
        }
      })
    }
    return {
      methods: {
        dispatch (componentName, eventName, params) {
          const parent = this._findParent(componentName)
          const children = this._findChildren(componentName)

          if (parent) {
            parent.$emit.apply(parent, [eventName].concat(params))
          }

          if (children) {
            children.$emit.apply(children, [eventName].concat(params))
          }
        },
        _findParent (componentName) {
          let parent = this.$parent || this.$root
          let name = parent.$options.name

          while (parent && (!name || name !== componentName)) {
            parent = parent.$parent

            if (parent) {
              name = parent.$options.name
            }
          }

          return parent || null
        },
        _findChildren (componentName) {
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

          if (this.$children && this.$children.length > 0) find(this.$children)

          return children
        },
        broadcast (componentName, eventName, params) {
          broadcast.call(this, componentName, eventName, params)
        }
      }
    }
  },
  typeOf (o) {
    if (Object.prototype.toString.call(o).slice(8, -1) === 'String') return 'String'
    if (Object.prototype.toString.call(o).slice(8, -1) === 'Number') return 'Number'
    if (Object.prototype.toString.call(o).slice(8, -1) === 'Boolean') return 'Boolean'
    if (Object.prototype.toString.call(o).slice(8, -1) === 'Function') return 'Function'
    if (Object.prototype.toString.call(o).slice(8, -1) === 'Null') return 'Null'
    if (Object.prototype.toString.call(o).slice(8, -1) === 'Undefined') return 'Undefined'
    if (Object.prototype.toString.call(o).slice(8, -1) === 'Object') return 'Object'
    if (Object.prototype.toString.call(o).slice(8, -1) === 'Array') return 'Array'
    if (Object.prototype.toString.call(o).slice(8, -1) === 'Date') return 'Date'
    if (Object.prototype.toString.call(o).slice(8, -1) === 'RegExp') return 'RegExp'
    if (Object.prototype.toString.call(o).slice(8, -1) === 'Error') return 'Error'
    if (Object.prototype.toString.call(o).slice(8, -1) === 'Symbol') return 'Symbol'
    if (Object.prototype.toString.call(o).slice(8, -1) === 'Promise') return 'Promise'
    if (Object.prototype.toString.call(o).slice(8, -1) === 'Set') return 'Set'
  },
  valueEquals (a, b) {
    // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
    if (a === b) return true
    if (!(a instanceof Array)) return false
    if (!(b instanceof Array)) return false
    if (a.length !== b.length) return false
    for (let i = 0; i !== a.length; ++i) {
      if (a[i] !== b[i]) return false
    }
    return true
  },
  print (type, position, data) {
    return console.log(`[${type}: ${position}] => ${data} `)
  },
  observer (target, optionName = 'attribute', callback) {
    if (!target) return
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    const optionsMap = {
      'attribute': {
        'attribute': true,
        'attributeOldValue': true
      },
      'child': {
        'childList': true,
        'subtree': true
      },
      'all': {
        'childList': true,
        'subtree': true,
        'attribute': true,
        'attributeOldValue': true
      }
    }
    if (MutationObserver) {
      const Observer = new MutationObserver(records => {
        records.map(record => {
          callback && callback(record)
        })
      })
      Observer.observe && Observer.observe(target, optionsMap[optionName])
      return Observer
    }
  },
  getQueryStringArgs () {
    // ?????????????????????????????????????????????
    var qs = (location.search.length > 0 ? location.search.substring(1) : '')
  
    // ?????????????????????
    var args = {}
  
    // ???????????????
    var items = qs.length ? qs.split('&') : []
    var item = null
    var name = null
    var value = null
    // ??? for ???????????????
    var i = 0
    var len = items.length
    // ??????????????????????????? args ?????????
    for (i = 0; i < len; i++) {
      item = items[i].split('=')
      name = decodeURIComponent(item[0])
      value = decodeURIComponent(item[1])
      if (name.length) {
        args[name] = value
      }
    }
  
    return args
  },
  updatePageHref () {
    const pageDomArr = document.getElementsByClassName('pagination-wrapper')
    if (pageDomArr.length > 0) {
      let addHref = ''
      // ?????????????????????????????????????????????
      var qs = location.search.length > 0 ? location.search.substring(1) : ''
      // ?????????????????????
      var queryObj = {}
      // ???????????????
      var items = qs.length ? qs.split('&') : []
      var item = null
      var name = null
      var value = null
      // ??? for ???????????????
      var i = 0
      var len = items.length // ??????????????????????????? queryObj ?????????

      for (i = 0; i < len; i++) {
        item = items[i].split('=')
        name = decodeURIComponent(item[0])
        value = decodeURIComponent(item[1])

        if (name.length) {
          queryObj[name] = value
          if (name !== 'page') {
            addHref += `&${name}=${value}`
          }
        }
      }
      var pageArr = pageDomArr[0].getElementsByClassName('pagination__item')

      for (var i = 0; i < pageArr.length; i++) {
        const aTag = pageArr[i].getElementsByTagName('a')[0]
        const oldHref = aTag.getAttribute('href')
        aTag.setAttribute('href', oldHref + addHref)
      }
    } else {
      // console.log('?????????')
    }
  },
  clickoutside () {
    return {
      bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          // ???????????????div??????
          if (!el.contains(event.target)) {
            // ????????????????????????
            vnode.context[binding.expression](event)
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unbind: function (el) {
        document.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  },
  /**
   * ????????????
   * @param {*} target ??????????????? String | Array
   * @param {*} input ??????
   * @param {*} key ???????????????key???
   */
  likeQuery (target, input, key) {
    const typeOf = window.WHSITE['UTILS'].typeOf
    if (!(typeOf(target) === 'Array' || typeOf(target) === 'String')) return
    if (!input) return []

    const createReg = (str, characters) => new RegExp(str, characters)
    const createStrWithNoEmpty = str => str.split(/s+/).join('')

    let _target = []
    const _input = createStrWithNoEmpty(input)
    if (typeOf(target) === 'String') {
      _target.push(target)
    } else {
      _target = target
    }

    const _inputReg = createReg(_input, 'i')
    return _target.filter(value => {
      const _value = key ? createStrWithNoEmpty(value[key]) : createStrWithNoEmpty(value)
      // ???????????????????????????????????????????????? || ?????????????????????????????????????????????????????????
      return _inputReg.test(_value) || _input.toLowerCase().indexOf(_value.toLowerCase()) > -1
    })
  },
  /**
   * ?????????url??????
   * @param {*} data
   * @param {*} isPrefix
  */
  queryParams (data, isPrefix = false) {
    let prefix = isPrefix ? '?' : ''
    let _result = []
    for (let key in data) {
      let value = data[key]
      // ?????????????????????
      if (['', undefined, null].includes(value)) {
        continue
      }
      if (value.constructor === Array) {
        value.forEach(_value => {
          _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
        })
      } else {
        _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
      }
    }

    return _result.length ? prefix + _result.join('&') : ''
  }
}
