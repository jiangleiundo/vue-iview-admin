<!-- super-info-page -->
<template>
    <div>
        <i-col :lg="8" :md="12" v-for="item in infoList" :key="item.key">
            <FormItem :label="infoTitle(item)" :prop="item.key" :type="item.type" :code="item.code">
                <label v-if="isShowTxt" v-text="showInfo(item)" :class="infoCls(item.type)"></label>
                <Input v-else :value="showInfo(item)" class="form-input" disabled placeholder />
            </FormItem>
        </i-col>
    </div>
</template>
<script>
import {valueToText, constPam} from '@/libs/api.utils'
import FormItem from '_c/form-item'
import store from '@/store'

export default {
    name: 'JInfoPage',
    components: {
        FormItem
    },
    props: {
        data: {
            type: Object,
            default: () => {
                return []
            }
        },
        rules: {
            type: Array,
            default: () => {
                return []
            }
        },
        isShowTxt: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        data(val) {
            this.curData = val
        }
    },
    data () {
        return {
            valueToText: valueToText,
            curData: this.data
        }
    },
    methods: {
        showInfo (item) {
            if (!item.type) return item.value
            if (['live', 'rate'].includes(item.type)) {
                return valueToText(item.value, item.type, constPam[item.code])
            }
            return valueToText(item.value, item.type, item.code)
        },
        infoCls (type) {
            if (type === 'money') return 'form-inline j-money-red'
            return 'form-inline'
        },
        infoTitle (item) {
            let title = item.title
            it (item.type === 'money') {
                title += '(元)'
            }
            return title += '：'
        }
    },
    computed: {
        infoList () {
            let list = []
            this.rules.forEach(info => {
                let [title, key, type, code] = info
                let value = this.curData[key]
                let item = {title, value, key, type, code}
                let hidePam = store.state.bus.hidePam || []
                if (!hidePam.includes(key)) {
                    list.push(item)
                }
            })

            return list
        }
    }
}
</script>
