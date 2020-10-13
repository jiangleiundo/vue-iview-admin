// const map

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
