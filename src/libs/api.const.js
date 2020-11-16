// const map

/**
   * Get the raw type string of a value, e.g., [object Object].
   */
const _toString = Object.prototype.toString

// has chinese
const hasCh = /^[\u4e00-\u9fa5a]/

// 月份切换
const switchM = '|一|二|三|四|五|六|七|八|九|十|十一|一年'

// table index
const indexType = ['index', 'section']

// table dict
const dictType = ['dict', 'suffix', 'prefix', 'tLive']

// table rate
const rateType = ['rate', 'money', 'date']

// table linkable
const linkType = ['linkable', 'longText', 'exLink', 'radioable', 'dateable']

/**
 * 初始化table表头
 * @param {*} tArr 表头数据数组
 * @param {*} filter 过滤器数组
 * [title,width,fixed|key|type|code]
 * 当type为options时，code是按钮图标eg：'view,edit'
 */
export const initTableColumns = (tArr = [], filter = []) => {
    if (!tArr.length) return []

    let cArr = []
    let align = 'center'
    let fn = 'includes'
    tArr.forEach(tt => {
        let [tit, key, type, code] = tt.split('|')
        let t = tit.split(',')
        let title = t[0]
        let minWidth = t[1] ? Number(t[1]) : initWidth(title)
        let item = {title, key, align, minWidth, type}

        if (t[2]) {
            item.fixed = t[2]
        }

        if (indexType[fn](type)) {
            item.width = minWidth
            delete item.minWidth
            delete item.key
        } else if (dictType[fn](type)) {
            item.code = code
        } else if (type === 'options') {
            delete item.type
            item.options = code.split(',')
        } else if (rateType[fn](type)) {
            if (type === 'money') {
                item.className = 'j-money-red'
            }
        } else if (linkType[fn](type)) {
            if (type === 'exLink') {
                item.linkable = true
            }
            delete item.type
            item[type] = code ? Number(code) : true
        } else {
            delete item.type
        }

        if (!filter.length) {
            cArr.push(item)
        } else {
            if (!key && filter.includes(key)) {
                cArr.push(item)
            }
        }
    })

    return cArr
}

/**
 * 计算table表头最小宽度
 * @param {*} s table-title
 */
export const initWidth = (s) => {
    let w = 0
    let i = -1
    let len = s.length
    while (++i < len) {
        let f = hasCh.test(s[i])
        w += f ? 20 : 12
    }

    w = w < 90 ? 90 : w
    return w
}

/**
 * 获取对象类型
 * @param {*} obj 对象参数
 */
export const objType = obj => {
    let map = {
        '[object Boolean]': 'boolean',
        '[object number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regexp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    }
    if (obj instanceof Element) {
        return 'element'
    }
    return map[_toString.call(obj)]
}

/**
 * 判空
 * @param {*} val
 */
export const isNull = val => {
    let type = objType(val)
    if (['boolean', 'number'].includes(type)) return false
    if (type === 'array') {
        return val.length === 0
    } else if (type === 'object') {
        return JSON.stringify(val) === '{}'
    } else {
        return (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '')
    }
}

/**
 * 日期快捷键
 * @param {*} val 当前日期(默认值)
 * @param {*} af -1 向前 1 向后
 * @param {*} tr 要展示的月份
 */
export const dShortcut = (val, af = -1, tr = [1, 3, 6, 12]) => {
    if (isNull(val)) {
        val = new Date()
    }
    let o = af === -1
    let scut = []
    tr.forEach(m => {
        let t = switchM.split('|')
        let text = t[m] + '个月'
        if (m === 12) text = t[m]
        let item = {
            text,
            value () {
                const s = new Date(val)
                const e = new Date(val)
                s.setMonth(e.getMonth() + m * af)
                return o ? [s, e] : [e, s]
            }
        }
        scut.push(item)
    })

    return scut
}

/**
 * 判断日期区间是否大于d天
 * @param {*} dateRange
 * @param {*} d
 */
export const overRange = (dateRange = [], d = 0) => {
    let [s, e] = dateRange
    let rs = new Date(s).valueOf()
    let re = new Date(e).valueOf() - d * 24 * 60 * 60 * 1000
    return re - rs > 0
}

/**
 * 当前月
 */
export const curMonth = () => {
    let dd = new Date()
    let [y, m, d] = valueToText(dd, 'date').split('-')
    let last = new Date(y * 1, m * 1, 0).getDate()
    let s = [y, m, '01'].join('-')
    let e = [y, m, last].join('-')
    return [s, e]
}

/**
 * 对象数组排序
 * @param {*} p 排序属性
 */
export const dynamicSort = (p) => {
    let order = 1
    if (p[0] === '-') {
        order = -1
        p = p.substr(1)
    }

    return function (a, b) {
        let ac = Number(a[p])
        let bc = Number(b[p])
        if (isNull(ac)) {
            ac = a[p]
            bc = b[p]
        }
        let res = (ac < bc) ? -1 : (ac > bc) ? 1 : 0
        return res * order
    }
}

/**
 * 根据当前日期或传入日期向前推n天，-7 表示向前推7天
 * @param {*} val
 * @param {*} d
 */
export const setDays = (val, d) => {
    val = val || new Date()
    d = d > 0 ? d - 1 : d + 1
    const start = new Date(val)
    const end = new Date(val)
    start.setDate(end.getDate() + d)
    return [start, end]
}

/**
 * 是否包含目标值
 * @param {*} val String & Array
 * @param {*} tar string
 */
export const hasTar = (val, tar) => {
    return (val + '').includes(tar)
}

/**
 * 两个字符是否相等
 * @param {*} s1
 * @param {*} s2
 */
export const equalNm = (s1, s2) => {
    return s1 === s2
}
