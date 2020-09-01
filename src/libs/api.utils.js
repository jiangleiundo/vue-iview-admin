import store from '@/store'
import router from '@/router'
import pca from './pca'
import math from 'mathjs'
import numeral from 'numeral'
import { Message, Modal, Spin } from 'view-design'
import axios from './api.request'
import config from '@/config'
import moment from './moment.js'
import handleBtns from '../components/table/handle-btns'
// import ProductPoptip from '../components/product-poptip'

const { noLoginCode, loginPath, BASE_URL } = config

export const Moment = d => {
  let m = moment(d)
  let dStr = d + ''
  if (dStr.indexOf('Z') > 0 || dStr.indexOf('UTC') > 0) {
    m = m.utcOffset(0)
  }
  return m
}

// eslint-disable-next-line no-extend-native
Date.prototype.Format = function (fmt) {
  return Moment(this).format(fmt)
}

Date.prototype.myformat = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

Date.prototype.toJSON = function () {
  return this.Format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 万分利率格式化
 */
numeral.register('format', 'tenThousandRate', {
  regexps: {
    format: /(‱)/,
    unformat: /(‱)/
  },
  format: function (value, format, roundingFunction) {
    var space = numeral._.includes(format, ' ‱') ? ' ' : '',
      output

    value = value * 10000

    // check for space before %
    format = format.replace(/\s?\‱/, '')

    output = numeral._.numberToFormat(value, format, roundingFunction)

    if (numeral._.includes(output, ')')) {
      output = output.split('')

      output.splice(-1, 0, space + '‱')

      output = output.join('')
    } else {
      output = output + space + '‱'
    }
    if (output.length > 1 && output.charAt(0) == '0') {
      output = output.substr(1)
    }
    return output
  },
  unformat: function (string) {
    return numeral._.stringToNumber(string) * 0.0001
  }
})

export const currentDate = () => {
  return Moment(new Date()).format('YYYY-MM-DD')
}

export const bussDateM = () => {
  return Moment(bussDate_()).toDate()
}

export const bussDate_ = () => {
  return store.state.user.bussDate
}

export const bussDate = () => {
  return Moment(bussDate_()).format('YYYY-MM-DD')
}

export const currentDateTime = () => {
  return Moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
}

export const showSpin = () => {
  Spin.show({
    size: 'large',
    render: h => {
      return h('div', [
        h('div', {
          'class': 'loadEffect'
        }, [
          h('span', ''),
          h('span', ''),
          h('span', ''),
          h('span', ''),
          h('span', ''),
          h('span', ''),
          h('span', ''),
          h('span', '')
        ]),
        h('div', {
          'class': 'spinText'
        }, '处理中…')
      ])
    }
  })
}

export const hideSpin = () => {
  Spin.hide()
}

/**
 * 增加月份，自然月减一天
 * @param d
 * @param month
 * @returns {*}
 */
export const addMonth = (d, month) => {
  return Moment(d).add(month, 'month').add(-1, 'days').format('YYYY-MM-DD')
}

/**
 * 增加日，自然月减一天
 * @param d
 * @param month
 * @returns {*}
 */
export const addDays = (d, days) => {
  return Moment(d).add(days, 'days').format('YYYY-MM-DD')
}

/**
 * 有效期
 * @param d
 * @param month
 * @returns {*}
 */
export const termDate = (d, days) => {
  return Moment(d).format('YYYY/MM/DD') + ' - ' + Moment(d).add(days - 1, 'days').format('YYYY/MM/DD')
}

export const formatDate = (date) => {
  if (date) {
    return Moment(date).format('YYYY-MM-DD')
  }
  return ''
}

export const formatDateTime = (date) => {
  if (date) {
    return Moment(date).format('YYYY-MM-DD HH:mm:ss')
  }
  return ''
}

export const formatTime = (date) => {
  if (date) {
    return Moment(date).format('HH:mm:ss')
  }
  return ''
}

/**
 * 数组转换为字符串
 * @param arr 待转换数组
 * @param split 分隔符，默认","
 * @returns {string}
 */
export const arrayToStr = (arr, split) => {
  let value = '',
    s = split || ','
  if (arr && arr.length > 0) {
    arr.forEach(val => {
      if (value) {
        value += s + val
      } else {
        value = val
      }
    })
  }
  return value
}

/**
 * 字符串转换为数组
 * @param str
 * @param split
 */
export const strToArray = (str, split) => {
  let s = split || ',',
    arr = []
  if (str) {
    arr = str.split(s)
  }
  return arr
}

/**
 * 获取指定日期本周一
 * @param date
 * @returns {*|Date}
 */
export const getMonDate = (date) => {
  let da = date || new Date(),
    d = new Date(Date.parse(da)),
    day = d.getDay(),
    t = d.getDate()
  if (day == 1) {
    return d
  }

  if (day == 0) {
    d.setDate(t - 6)
  } else {
    d.setDate(t - day + 1)
  }
  return d
}

/**
 * 获取指定日期一周时间
 * @param date
 * @returns {Array}
 */
export const getWeekDate = (date) => {
  let weeks = [],
    d = getMonDate(date)
  for (let i = 0; i < 7; i++) {
    weeks.push(formatDate(d))
    d.setDate(d.getDate() + 1)
  }
  return weeks
}

/**
 * 后台接口交互
 */
export const request = (options) => {
  let opt = {
    url: options.url,
    method: 'post'
  }
  if (options.hideLoad) {
    opt.hideLoad = options.hideLoad
  }
  if (options.method == 'post') {
    opt.data = options.data
    opt.headers = {
      'Content-Type': 'application/json'
    }
  } else {
    opt.params = options.data
  }
  axios.request(opt).then(res => {
    if (res.data.success) {
      if (options.success) options.success(res.data)
      if (options.optMsg) {
        success(options.optMsg + '成功')
      }
    } else {
      if (noLoginCode && res.data.code == noLoginCode) {
        warning('未登录或登录超时，请重新登录')
        store.dispatch('handleLogOut')
        router.push({
          name: 'login'
        })
      } else {
        if (options.error) options.error(res)
        let msg = options.optMsg || '操作'
        error(msg + '失败', res.data)
      }
    }
  }).catch(res => {
    console.error(res)
    if (options.error) options.error(res)
  })
}

/**
 *  接口二次封装
 * @param url
 * @param param 入参
 * @param success
 * @param pageable 分页对象
 * @param error
 */
export const $http = (url, param = {}, success, pageable, error) => {
  let basePam = pageable ? {
    page: pageable.page,
    pageSize: pageable.pageSize
  } : {}
  Object.assign(basePam, param)
  request({
    url: url,
    data: basePam,
    success: res => {
      success && success(res)
    },
    error: err => {
      error && error(err)
    }
  })
}

/**
 *  J.导出excel文件
 * @param url 下载地址
 * @param data 参数
 * @param name 下载文件名
 * @param total 导出总数量
 */
export const $export2 = (url, data, name, total = 0) => {
  if (total > 5000) {
    try {
      isRepeatClick(1, '查询结果超过5000，请增加查询条件！')
    } catch (e) {
      return
    }
  }

  let opt = {
    url: url,
    method: 'post',
    responseType: 'blob',
    data: data
  }
  axios.request(opt).then(res => {
    const BLOB = res.data,
      fileReader = new FileReader()

    fileReader.readAsDataURL(BLOB)
    fileReader.onload = (event) => {
      let a = document.createElement('a')
      a.download = `${name}.xls`
      a.href = event.target.result
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }).catch(err => {
    console.error(err)
    error(err)
  })
}

/**
 *  J.导出excel文件 get方法拼接地址
 * @param url 下载地址
 * @param data 参数
 * @param name 下载文件名
 * @param total 导出总数量
 */
export const $export = (url, data, name, total = 0) => {
  let msg = null
  if (!total) msg = '没有可导出的数据！'
  if (total > 5000) msg = '查询结果超过5000，请增加查询条件！'
  if (msg) {
    try {
      isRepeatClick(msg, msg)
    } catch (e) {
      return
    }
  }
  let exportIn = {
    splitData: function (data) {
      let url = ''
      for (let k in data) {
        if (data.hasOwnProperty(k)) {
          let value = data[k] || ''
          url = url + '&' + k + '=' + encodeURIComponent(value)
        }
      }
      return url ? url.substring(1) : ''
    },
    contractUrl: function (url, data) {
      return url + (url.indexOf('?') < 0 ? '?' : '&') + exportIn.splitData(data)
    }
  },
  finalUrl = exportIn.contractUrl(url, data)

  window.open(finalUrl)
}

/**
 * 构建提示消息参数
 * @param msg
 * @returns {{duration: number, closable: boolean, content: *}}
 */
const buildParam = (msg) => {
  Message.config({
    top: 400
  })
  return {
    content: msg,
    duration: 5,
    closable: true
  }
}

/**
 * 构建错误提示消息
 * @param msg
 * @param res
 * @returns {string}
 */
const buildMsg = (msg, res) => {
  return msg + '异常，错误码：[' + res.code + ']，' + '错误描述：[' + res.message + ']'
}

/**
 * 成功提示
 * @param msg
 */
export const success = (msg) => {
  Message.success(buildParam(msg))
}

/**
 * 错误提示
 * @param msg
 * @param res
 */
export const error = (msg, res) => {
  let m = {
    title: '提示信息',
    content: msg
  }
  if (res) {
    // msg = buildMsg(msg, res)
    // m.content = res.code + '：' + res.message
    m.content = res.message
  }
  Modal.error(m)
}

/**
 *  警告提示
 * @param msg
 */
export const warnM = (msg) => {
  let m = {
    title: '提示信息',
    content: msg
  }
  Modal.warning(m)
}

/**
 * 确认提示
 * @param title
 * @param msg
 * @param yes
 * @param no
 */
export const confirm = (msg, yes, title, no) => {
  Modal.confirm({
    title: title || '确认',
    content: msg,
    onOk: () => {
      yes && yes()
    },
    onCancel: () => {
      no && no()
    }
  })
}

/**
 *  涉及工作流的success信息
 * @param res
 */
export const successM = (res) => {
  let msg = typeof res === 'string' ? res : cbMsg(res),
      m = {
        title: '提示信息',
        content: msg,
        okText: '关闭'
      }
  Modal.success(m)
}

/**
 *  工作流信息展示
 * @param res
 * @returns {*}
 */
export const cbMsg = (res) => {
  let msg = ''
  if (res.pcsInsState == '1') {
    msg = '提交成功，交易结束！'
  } else if (res.pcsInsState == '0') {
    msg = `提交成功，交易进入工作流！<br>下一环节：<b>${res.nextLkNm}</b> <br>下一环节参与人：<b>${res.nextIttPer}</b>`
  }
  return msg
}

/**
 * 警告提示
 * @param msg
 * @param res
 */
export const warning = (msg, res) => {
  if (res) {
    msg = buildMsg(msg, res)
  }
  Message.warning(buildParam(msg))
}

/**
 * 消息提示
 * @param msg
 */
export const info = (msg) => {
  Message.info(buildParam(msg))
}

/**
 * 加载字典信息
 * @param code
 */
export const loadDict = code => {
  return store.state.app.dict[code]
}

/**
 * 获取字典列表
 * @param code
 * @param filter
 * @param filterKill
 * @returns {string|Array}
 */
export const getDicts = (code, filter, filterKill) => {
  if (!code) return ''

  if (filter && filter.length > 0) {
    let dicts = []
    if (loadDict(code).dicts) {
      loadDict(code).dicts.forEach(d => {
        if (filter.indexOf(d.value) !== -1) {
          dicts.push(d)
        }
      })
    }
    return dicts
  }
  if (filterKill && filterKill.length > 0) {
    let dicts = []
    if (loadDict(code).dicts) {
      loadDict(code).dicts.forEach(d => {
        if (filterKill.indexOf(d.value) === -1) {
          dicts.push(d)
        }
      })
    }
    return dicts
  }
  return loadDict(code).dicts
}

/**
 * 根据名称获取字典值
 * @param code
 * @param name
 * @returns {string}
 */
export const dictNameToValue = (code, name) => {
  let dicts = loadDict(code), value = ''
  if (dicts && dicts.length > 0) {
    dicts.some(item => {
      if (item.name == name) {
        value = item.value
        return true
      }
    })
  }
  return value
}

/**
 *  值转换为内容
 * @param value 待转换值
 * @param type 转换类型
 * @param code 转换参数
 * @returns {*}
 */
export const valueToText = (value, type, code) => {
  if (type === 'str') {
    return value || ''
  } else if (type === 'dict') {
    if (code) {
      let dict = store.state.app.dict[code]
      if (typeof value === 'object') {
        let key = []
        value.forEach(val => {
          key.push(dict.valueToName[val])
        })
        return key
      }
      return dict ? dict.valueToName[value] : value
    } else {
      console.log('valueToText error: in type dict code is not null')
    }
  } else if (type === 'live') {
    if (code) {
      if (typeof value === 'object') {
        let key = []
        value.forEach(val => {
          key.push(liveDict[code].val2Nm[val])
        })
        return key
      }
      return liveDict[code].val2Nm[value]
    }
  } else if (type === 'datetime') {
    return formatDateTime(value)
  } else if (type === 'date') {
    return formatDate(value)
  } else if (type === 'time') {
    return formatTime(value)
  } else if (type === 'money') {
    return formatMoney(value, code)
  } else if (type === 'timerange') {
    if (!value || !code) return ''
    return formatTime(value) + '-' + formatTime(code)
  } else if (type === 'pca') {
    return formatPca(value)
  } else if (type === 'suffix') {
    if (!value) return ''
    return value + code
  } else if (type === 'prefix') {
    if (!value) return ''
    return code + value
  } else if (type === 'rate') {
    return formatRate(value)
  } else if (type === 'thousandRate') {
    return formatTenThousandRate(value)
  }
}

export const liveDict = {
  DEAL_STAT: {
    option: [
      { label: '生效', value: '1' },
      { label: '失效', value: '2' }
    ],
    val2Nm: { '1': '生效', '2': '失效' }
  }
}

/**
 * 格式化利率
 * @param value
 * @param precision 保留小数
 */
export const formatRate = (value, precision = 2) => {
  if (parseFloat(value).toString() != 'NaN') {
    return numeral(value).format('0.00%')
  }
  return ''
}

/**
 * 解析利率
 * @param value
 * @param precision
 */
export const parseRate = (value, precision = 2) => {
  if (value) {
    return numeral(value).value()
  } else {
    return ''
  }
}

/**
 * 格式化万分利率
 * @param value
 */
export const formatTenThousandRate = (value) => {
  if (parseFloat(value).toString() != 'NaN') {
    return numeral(value).format('100.00‱')
  }
  return ''
}

/**
 * 解析万分位利率
 * @param value
 */
export const parseTenThousandRate = (value) => {
  if (value) {
    return numeral(value).value()
  } else {
    return ''
  }
}

/**
 * 格式化省市区
 * @param value，数组，省市区编码：[省编码,市编码,区编码]
 * @returns {string}
 */
export const formatPca = (value) => {
  let pcaText = ''
  if (pca && pca.length > 0) {
    let province = null
    pca.some(p => {
      if (p.value == value[0]) {
        province = p
        return true
      }
    })
    if (province) {
      pcaText = province.label
      if (province.children && province.children.length > 0) {
        let city = null
        province.children.some(c => {
          if (c.value == value[1]) {
            city = c
            return true
          }
        })
        if (city) {
          pcaText = pcaText + ' ' + city.label
          if (city.children && city.children.length > 0) {
            let district = null
            city.children.some(d => {
              if (d.value == value[2]) {
                district = d
                return true
              }
            })
            if (district) {
              pcaText = pcaText + ' ' + district.label
              if (district.children && district.children.length > 0) {
                let street = null
                district.children.some(s => {
                  if (value[3] && s.value == value[3]) {
                    street = s
                    return true
                  }
                })
                if (street) {
                  pcaText = pcaText + ' ' + street.label
                }
              }
            }
          }
        }
      }
    }
  }
  return pcaText
}

/**
 * 左补位
 * @param s
 * @param len
 * @param charStr
 * @returns {string}
 */
export const padLeft = (s = '', len = 2, charStr = '0') => {
  s = s + ''
  return new Array(len - s.length + 1).join(charStr, '') + s
}

export const padRight = (s = '', len = 2, charStr = '0') => {
  s = s + ''
  return s + new Array(len - s.length + 1).join(charStr, '')
}

/**
 * 格式化金额
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567'，默认返回''
 */
export const formatMoney = (num, zoomout) => {
  if (parseFloat(num).toString() != 'NaN') {
    if (zoomout) num = math.chain(num).divide(zoomout).value
    return numeral(num).format('0,0.00')
  }
  return ''
  //
  // if(num === 0 || num === '0') return '0'
  // // 判断是否为数字
  // if (parseFloat(num).toString() != "NaN") {
  //     num = num + ''
  //     let parts = num.split('.')
  //     // 整数部分加[separator]分隔, 借用一个著名的正则表达式
  //     parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','))
  //     if (!parts[1]) {
  //         parts[1] = '00'
  //     } else if (parts[1].length === 1) {
  //         parts[1] += '0'
  //     } else if (parts[1].length > precision) {
  //         parts[1] = parts[1].slice(0, precision)
  //     }
  //     parts = parts.join('.')
  //     return parts
  // }
  // return ''
}

/**
 * 解析金额
 * @param num
 * @param zoomout
 * @returns {string|*}
 */
export const parseMoney = (num, zoomout) => {
  if (num) {
    num = num.replace(/￥s?|(,*)/g, '')
    if (zoomout) num = math.chain(num).multiply(zoomout).value
    return num
  }
  return ''
}

export const dateRangeOptions = (disabledDateCall) => {
  let options = {
    shortcuts: [
      {
        text: '一个月',
        value () {
          const start = new Date(),
                end = new Date()
          end.setMonth(start.getMonth() + 1)
          return [start, end]
        }
      },
      {
        text: '三个月',
        value () {
          const start = new Date(),
                end = new Date()
          end.setMonth(start.getMonth() + 3)
          return [start, end]
        }
      },
      {
        text: '半年',
        value () {
          const start = new Date(),
                end = new Date()
          end.setMonth(start.getMonth() + 6)
          return [start, end]
        }
      },
      {
        text: '一年',
        value () {
          const start = new Date(),
                end = new Date()
          end.setFullYear(start.getFullYear() + 1)
          return [start, end]
        }
      }
    ]
  }
  if (disabledDateCall) {
    options.disabledDate = date => {
      return disabledDateCall(date)
    }
  }
  return options
}

/**
 * 获取过去默认日期区间
 * @returns {Date[]|{shortcuts: *[]}}
 */
export const dateRangePassOptions = (disabledDateCall) => {
  let options = {
    shortcuts: [
      {
        text: '一个月',
        value () {
          const start = new Date(),
                end = new Date()
          start.setMonth(end.getMonth() - 1)
          return [start, end]
        }
      },
      {
        text: '三个月',
        value () {
          const start = new Date(),
                end = new Date()
          start.setMonth(end.getMonth() - 3)
          return [start, end]
        }
      },
      {
        text: '半年',
        value () {
          const start = new Date(),
                end = new Date()
          start.setMonth(end.getMonth() - 6)
          return [start, end]
        }
      },
      {
        text: '一年',
        value () {
          const start = new Date(),
                end = new Date()
          start.setFullYear(end.getFullYear() - 1)
          return [start, end]
        }
      }
    ]
  }
  if (disabledDateCall) {
    options.disabledDate = date => {
      return disabledDateCall(date)
    }
  }
  return options
}

/**
 * 构建列表按钮
 * @param btns
 * @param authCode
 * @returns {Array}
 */
export const buildTableBtns = (btns, authCode) => {
  if (!btns || btns.length === 0) return []
  let insideBtns = []
  btns.forEach(item => {
    if (authCode) {
      if (handleBtns[item] && handleBtns[item].auth(authCode)) insideBtns.push(handleBtns[item].btn)
    } else {
      if (handleBtns[item]) insideBtns.push(handleBtns[item].btn)
    }
  })
  return insideBtns
}

/**
 * 构建url参数
 * @param param
 * @returns {string}
 */
export const buileUrlParams = param => {
  let urlParams = ''
  if (param) {
    for (let i in param) {
      if (i && param[i]) {
        if (urlParams) {
          urlParams += '&' + i + '=' + param[i]
        } else {
          urlParams = '?' + i + '=' + param[i]
        }
      }
    }
  }
  return urlParams
}

/**
 *  J传入的参数中的字符转化为数字
 * @param param
 * @returns {*}
 */
export const pam2Num = (param) => {
  for (let k in param) {
    if (param.hasOwnProperty(k) && !utilConst.ignoreArr.includes(k)) {
      param[k] = str2Number(param[k])
    }
  }
  return param
}

/**
 *  J单个参数转化为数字
 * @param param
 * @returns {*}
 */
export const str2Number = (param) => {
  if (param === '0') return 0
  if (typeof param === 'string' && param.indexOf('0') === 0) return param
  if (typeof param === 'string' || 'number') return Number(param) || param
  return param
}

/**
 *  J异步校验数据
 * @param url
 * @param param 参数(包含校验值)
 * @param cb
 */
export const asyncValid = (url, param, cb) => {
  $http(url, param,
    (res) => {
      cb()
    }, 0, (err) => {
      cb(new Error(err.data.message))
    })
}

/**
 *  验证输入框输入的字符是否超过规定的字节数
 * @param str 字符串
 * @param num 字节数
 * @param callback
 * @returns {number}
 */
export const lenValidate = (str, num, callback) => {
  if (str) {
    let len = strLen(str)
    if (len > num) {
      return callback(new Error('最多只能输入' + num + '个字符！'))
    }
  }
  callback()
}

/**
 *  计算字符串的字节数
 * @param str 字符串
 * @returns {number}
 */
export const strLen = (str) => {
  let len = 0
  if (str) {
    str = str + ''
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i)
      if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        // 单字节加1
        len++
      } else {
        // 汉字加3
        len += 3
      }
    }
  }
  return len
}

/**
 * 非空校验规则
 * @param rule
 * @param value
 * @param callback
 * @returns {*|boolean}
 */
export const requiredValidator = (rule, value, callback) => {
  if ((!value && value != 0) || value === '' || value.length === 0) {
    callback(new Error('该项为必输项'))
  } else {
    callback()
  }
}

export const inputNumberRequiredValidator = msg => {
  return { required: true, validator: requiredValidator, message: msg, trigger: 'blur' }
}

export const changeRequiredValidator = msg => {
  return { required: true, validator: requiredValidator, message: msg, trigger: 'change' }
}

export const filesUploadRequiredValidator = msg => {
  return { type: 'array', required: true, validator: requiredValidator, message: msg, trigger: 'change' }
}

/**
 *  J校验规则
 * @type {{id: RegExp, idMsg: string, tel: RegExp, telMsg: string, name: RegExp, nameMsg: string}}
 */
export const validPattern = {
  pdRulesMsg: '必输项不能为空',
  num: /^[0-9]*[1-9][0-9]*$/,
  numMsg: '请输入正整数',
  id: /^[a-zA-Z0-9]+$/, // 编号校验
  idMsg: '请输入英文和数字',
  id2: /^[a-zA-Z0-9-]+$/, // 证件号校验
  id3: /^[a-zA-Z0-9-_]+$/, // 用户编号校验
  id2Msg: '请输入英文、数字和“-”',
  id4: /^[a-zA-Z0-9]{6}$/, // 注册邀请码校验
  id4Msg: '请输入由6位中英文组成的邀请码',
  tel: /^1[1-9]\d{9}$/, // 手机校验
  telMsg: '手机号码格式有误',
  name: /^[\u4e00-\u9fa5a-zA-Z()（）_]+$/, // 名称校验
  nameMsg: '请输入中文或英文',
  name2: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, // 名称校验2
  name3: /^[\u4e00-\u9fa5a-zA-Z0-9-()（）_]+$/, // 名称校验3
  name4: /^[\u4e00-\u9fa5a-zA-Z0-9-()（）]+$/, // 名称校验4
  name5: /^(?!_)(?!.*?_$)[\u4e00-\u9fa5a-zA-Z0-9-()（）_]+$/, // 名称校验不能以下划线开头和结尾
  name5Msg: '不能以下划线开头结尾可输入中英文数字',
  name2Msg: '请输入中文、英文或数字',
  name6: /^(?!_)(?!.*?_$)(?!\s)(?!.*?\s$)[\u4e00-\u9fa5a-zA-Z0-9-()（）\s_]+$/, // 名称校验不能以下划线、空格开头和结尾
  name6Msg: '不能以下划线开头结尾可输入中英文数字和空格',
  name7: /^([\u4e00-\u9fa5]{2,20}|[a-zA-Z\s]{2,20})$/, // 名称校验
  name7Msg: '请输入真实的姓名、由中文或字母组成不能输入',
  money: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, // 校验金额最多保留两位小数
  moneyMsg: '请输入正确的金额，保留两位小数',
  identityCard: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, // 身份证校验
  identityCardMsg: '请输入正确的身份证号码',
  // unifiedCode: /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g,// 统一社会信用代码验证
  unifiedCodeMsg: '请输入正确的统一社会信用代码',
  bank1: /^([1-9]{1})(\d{11}|\d{15}|\d{16}|\d{17}|\d{18})$/, // 银行卡校验
  bank2: /^[1-9]\d*$/, // 民生银行卡校验
  macaoThrough: /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/, // 港澳通行证
  TaiwanThrough: /^([0-9]{8}|[0-9]{10})$/, // 台湾通行证
  passport: /^1[45][0-9]{7}$|(^[P|p|S|s]\d{7}$)|(^[S|s|G|g|E|e]\d{8}$)|(^[Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|(^[H|h|M|m]\d{8,10}$)/, // 护照验证
  passportMsg: '请输入正确的证件号',
  hasnum: /.*[0-9]{1,}.*/,
  allnum: /^[0-9]+$/,
  idre18: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, // 18位身份证
  idre15: /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/ // 15位身份证

}

/**
 *  J判断是否处于工作流状态
 * @param wfStat
 * @param curId
 */
export const isInWorkFlow = (wfStat, curId) => {
  if (parseInt(wfStat) !== 1) {
    isRepeatClick(curId, '该条数据正在工作流中，暂时不能操作!!')
  }
}

/**
 *  J阻止用户多次连续点击出现的重复提示
 * @param curId
 * @param msg
 * @param type
 */
export const isRepeatClick = (curId, msg, type) => {
  let fun = type ? success : warning
  if (utilConst.curIdFlag !== curId) {
    utilConst.curIdFlag = curId
    setTimeout(() => {
      utilConst.curIdFlag = null
    }, 4900)
    msg && fun(msg)
    throw Error()
  } else {
    throw Error()
  }
}

/**
 *  临时变量
 * @type {{curIdFlag: null}}
 */
export const utilConst = {
  curIdFlag: null,
  ignoreArr: []
}

/**
 * 去除rows无用属性
 * @param item
 */
export const tableRowsBuild = item => {
  delete item.initRowIndex
  delete item._index
  delete item._rowKey
  return item
}

/**
 *  解除绑定的数据
 * @param obj
 * @returns {any}
 */
export const pureData = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 *  判断是否为空
 * @param val
 * @returns {boolean}
 */
export const isEmpty = (val) => {
  if (val === 0) return true
  return (!val || val === 'null' || val === '' || val === "''" || val === 'undefined')
}

/**
 *  根据参数字段和参数名获取tableColumns
 * @param tablePam 参数字段数组
 * @param tableTitle 参数名数组
 * @param liveTablePam 动态参数数组
 * @param pure 是否不需要多选
 * @param option 操作按钮数组
 * @param pureTable 纯表格
 * @returns {*}
 */
export const getTableColumns = ({ tablePam, tableTitle, liveTablePam, pure = true, option, pureTable }) => {
  let widthMap = new Map([[1, 100], [2, 150], [3, 200], [4, 250], [6, 90], [9, 120], [12, 130], [15, 140], [18, 150], [21, 160], [24, 170], [27, 180]]),
    arr = [], reg = /\(/
  if (!tablePam || tablePam.length === 0 || tableTitle.length === 0) return arr

  tablePam.forEach((item, idx) => {
    let pamItem = item.split('|'),
      flag = true,
      title = tableTitle[idx],
      len = strLen(title)
    if (reg.test(title)) len += 3
    if (liveTablePam && liveTablePam.length > 0) {
      flag = liveTablePam.includes(pamItem[0])
    }
    let longWidthArr = ['日期', '金额', '余额', '收入', '额度', '费用', '合计', '名称', '编号'],
      extFlag = longWidthArr.some(item => {
      return title.includes(item)
    }),
      curWidth = widthMap.get(len) || 160
    if (extFlag) {
      curWidth = curWidth > 135 ? curWidth : 135
    }

    let dataItem = {
      title: title,
      key: pamItem[0],
      align: 'center',
      minWidth: curWidth
    }
    if (pamItem[1]) {
      if (pamItem[1] === 'linkable') {
        dataItem.linkable = true
        if (pamItem[2]) {
          dataItem.fixed = pamItem[2]
        }
      } else if (pamItem[1] === 'product') {
        dataItem.render = (h, params) => {
          return h('div', [
            h(ProductPoptip, {
              props: {
                value: params.row
              }
            })
          ])
        }
      } else {
        dataItem.type = pamItem[1]
        if (pamItem[2]) {
          dataItem.code = pamItem[2]
        }
      }
    }

    let data = flag ? dataItem : null
    data && arr.push(data)
  })
  if (option) {
    arr.push({
      title: '操作',
      key: 'handle',
      width: widthMap.get(option.length) || 100,
      align: 'center',
      fixed: 'right',
      options: option
    })
  }

  return pureTable ? arr : [
    pure ? {
      title: '序号',
      type: 'index',
      width: 80,
      align: 'center'
    } : {
      type: 'selection',
      width: 80,
      align: 'center',
      fixed: 'left'
    },
    ...arr
  ]
}

/**
 *  J. 根据期间范围返回时间区间
 * @param type 期间类型
 * @param sTim 开始时间
 * @param eTim 结束时间
 * @returns {*}
 */
export const getDateRange = (type, sTim, eTim) => {
  if (!sTim || !eTim) return []
  if (type === '1') {
    let s = getWeekDate(sTim),
        e = getWeekDate(eTim)
    return [s[0], e[0]]
  } else if (type === '0' || type === '2' || type === '4') {
    let s = formatDate(sTim),
        e = formatDate(eTim)
    return [s, e]
  } else if (type === '3') {
    let s = formatDate(sTim),
        e = formatDate(eTim),
        qs = new Date(s).myformat('q'),
        qe = new Date(e).myformat('q'),
        ys = s.split('-')[0],
        ye = e.split('-')[0],
        map = new Map([
          ['1', '-01-01'],
          ['2', '-03-01'],
          ['3', '-07-01'],
          ['4', '-10-01']
        ]),
        sq = ys + map.get(qs),
        eq = ye + map.get(qe)
    return [sq, eq]
  }
}

/**
 *  J. 日期区间是否跨月
 * @param dateArr
 * @returns {number}
 */
export const isInOneMonth = (dateArr) => {
  let s = dateArr[0].split('-'),
      e = dateArr[1].split('-')
  if (e[0] - s[0] > 1) return 0
  if (e[0] - s[0] === 1) { // 跨1年
    if (!(e[1] === '01' && s[1] === '12')) return 0 // 跨多月
    if (e[2] > s[2]) return 0 // 跨1月
    return 1
  }
  // 同年
  let f = Math.abs(e[1] - s[1])
  if (f > 1) return 0 // 跨多月
  if (e[1] - s[1] === 1) { // 跨1月
    if (e[2] > s[2]) return 0
  }
  return 1
}

// 统一社会信用代码
function unifiedCodeCheckCall () {
  this.firstarray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  this.firstkeys = [3, 7, 9, 10, 5, 8, 4, 2]
  this.secondarray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'W', 'X', 'Y']
  this.secondkeys = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28]
  this.verify = function (str) {
    var code = str.toUpperCase()

/*
  统一社会信用代码由十八位的阿拉伯数字或大写英文字母（不使用I、O、Z、S、V）组成。
  第1位：登记管理部门代码（共一位字符）
  第2位：机构类别代码（共一位字符）
  第3位~第8位：登记管理机关行政区划码（共六位阿拉伯数字）
  第9位~第17位：主体标识码（组织机构代码）（共九位字符）
  第18位：校验码​（共一位字符）
*/
    if (code.length != 18) {
      return false
    }
    var reg = /^\w\w\d{6}\w{9}\w$/
    if (!reg.test(code)) {
      return false
    }
    /*
		登记管理部门代码：使用阿拉伯数字或大写英文字母表示。
		机构编制：1
		民政：5
		工商：9
		其他：Y
		*/
    reg = /^[1,5,9,Y]\w\d{6}\w{9}\w$/
    if (!reg.test(code)) {
      return false
    }
    /*
		机构类别代码：使用阿拉伯数字或大写英文字母表示。
		机构编制机关：11打头
		机构编制事业单位：12打头
		机构编制中央编办直接管理机构编制的群众团体：13打头
		机构编制其他：19打头
		民政社会团体：51打头
		民政民办非企业单位：52打头
		民政基金会：53打头
		民政其他：59打头
		工商企业：91打头
		工商个体工商户：92打头
		工商农民专业合作社：93打头
		其他：Y1打头
		*/
    reg = /^(11|12|13|19|51|52|53|59|91|92|93|Y1)\d{6}\w{9}\w$/
    if (!reg.test(code)) {
      return false
    }
    /*
		登记管理机关行政区划码：只能使用阿拉伯数字表示。按照GB/T 2260编码。
		例如：四川省成都市本级就是510100；四川省自贡市自流井区就是510302。
		*/
    reg = /^(11|12|13|19|51|52|53|59|91|92|93|Y1)\d{6}\w{9}\w$/
    if (!reg.test(code)) {
      return false
    }
    /*
		主体标识码（组织机构代码）：使用阿拉伯数字或英文大写字母表示。按照GB 11714编码。
		在实行统一社会信用代码之前，以前的组织机构代码证上的组织机构代码由九位字符组成。格式为XXXXXXXX-Y。前面八位被称为“本体代码”；最后一位被称为“校验码”。校验码和本体代码由一个连字号（-）连接起来。以便让人很容易的看出校验码。但是三证合一后，组织机构的九位字符全部被纳入统一社会信用代码的第9位至第17位，其原有组织机构代码上的连字号不带入统一社会信用代码。
		原有组织机构代码上的“校验码”的计算规则是：
		例如：某公司的组织机构代码是：59467239-9。那其最后一位的组织机构代码校验码9是如何计算出来的呢？
		第一步：取组织机构代码的前八位本体代码为基数。5 9 4 6 7 2 3 9
		提示：如果本体代码中含有英文大写字母。则A的基数是10，B的基数是11，C的基数是12，依此类推，直到Z的基数是35。
		第二步：​​取加权因子数值。因为组织机构代码的本体代码一共是八位字符。则这八位的加权因子数值从左到右分别是：3、7、9、10、5、8、4、2。
		第三步：本体代码基数与对应位数的因子数值相乘。
		5×3＝15，9×7＝63，4×9＝36，6×10＝60，
		7×5＝35，2×8＝16，3×4=12，9×2＝18
		第四步：将乘积求和相加。
		15+63+36+60+35+16+12+18=255
		第五步：​将和数除以11，求余数。
		255÷11=33，余数是2。
		*/
    var firstkey = this.calc(code.substr(8), this.firstarray, this.firstkeys, 11)
    /*
		第六步：用阿拉伯数字11减去余数，得求校验码的数值。当校验码的数值为10时，校验码用英文大写字母X来表示；当校验码的数值为11时，校验码用0来表示；其余求出的校验码数值就用其本身的阿拉伯数字来表示。
		11-2＝9，因此此公司完整的组织机构代码为 59467239-9。
		*/
    var firstword
    if (firstkey < 10) {
      firstword = firstkey
    }
    if (firstkey == 10) {
      firstword = 'X'
    } else if (firstkey == 11) {
      firstword = '0'
    }
    if (firstword != code.substr(16, 1)) {
      return false
    }

    /*
		校验码：使用阿拉伯数字或大写英文字母来表示。校验码的计算方法参照 GB/T 17710。
		例如：某公司的统一社会信用代码为91512081MA62K0260E，那其最后一位的校验码E是如何计算出来的呢？
		第一步：取统一社会信用代码的前十七位为基数。9 1 5 1 2 0 8 1 21 10 6 2 19 0 2 6 0提示：如果前十七位统一社会信用代码含有英文大写字母（不使用I、O、Z、S、V这五个英文字母）。则英文字母对应的基数分别为：A=10、B=11、C=12、D=13、E=14、F=15、G=16、H=17、J=18、K=19、L=20、M=21、N=22、P=23、Q=24、R=25、T=26、U=27、W=28、X=29、Y=30
		第二步：​​取加权因子数值。因为统一社会信用代码前面前面有十七位字符。则这十七位的加权因子数值从左到右分别是：1、3、9、27、19、26、16、17、20、29、25、13、8、24、10、30、2​8
		第三步：基数与对应位数的因子数值相乘。
		9×1=9，1×3=3，5×9=45，1×27=27，2×19=38，0×26=0，8×16=128
		1×17=17，21×20=420，10×29=290，6×25=150，2×13=26，19×8=152
		0×23=0，2×10=20，6×30=180，0×28=0
		第四步：将乘积求和相加。​9+3+45+27+38+0+128+17+420+290+150+26+152+0+20+180+0=1495
		第五步：​将和数除以31，求余数。
		1495÷31=48，余数是17。
		*/

    var secondkey = this.calc(code, this.secondarray, this.secondkeys, 31)
    /*
		第六步：用阿拉伯数字31减去余数，得求校验码的数值。当校验码的数值为0~9时，就直接用该校验码的数值作为最终的统一社会信用代码的校验码；如果校验码的数值是10~30，则校验码转换为对应的大写英文字母。对应关系为：A=10、B=11、C=12、D=13、E=14、F=15、G=16、H=17、J=18、K=19、L=20、M=21、N=22、P=23、Q=24、R=25、T=26、U=27、W=28、X=29、Y=30
		因为，31-17＝14，所以该公司完整的统一社会信用代码为 91512081MA62K0260E。
		*/
    var secondword = this.secondarray[secondkey]
    if (!secondword || secondword != code.substr(17, 1)) {
      return false
    }
    var word = code.substr(0, 16) + firstword + secondword
    if (code != word) {
      return false
    }
    return true
  }
  this.calc = function (code, array1, array2, b) {
    var count = 0
    for (var i = 0; i < array2.length; i++) {
      var a = code[i]
      count += array2[i] * array1.indexOf(a)
    }
    var remainder = count % b
    return remainder === 0 ? 0 : b - remainder
  }
}

export const unifiedCodeCheck = new unifiedCodeCheckCall()
