<template>
    <InputNumber
        :min="curMin" :max="curMax" :value="value" @on-change="handleChange" @on-blur='handleBlur' :class="clz" :disabled="currentDisabled"
        :formatter="formatMoney" :precision="precision"
        :parser="parseMoney" :placeholder="curPlaceholder" :clearable="true"></InputNumber>
</template>

<script>
    import InputNumber from '../input-number';
    import {formatMoney, parseMoney} from '../../libs/api.utils'

    export default {
        name: 'MoneyInput',
        components: {
            InputNumber
        },
        model: {
            prop: 'value',
            event: 'on-change'
        },
        props: {
            value: {
                type: [String, Number],
                default: ''
            },
            placeholder: {
                type: String
            },
            max: {
                type: [String, Number],
                default: "99999999999999.99"
            },
            min: {
                type: [String, Number],
                default: "0"
            },
            clz: {
                type: String
            },
            disabled: {
                type: Boolean,
                default: false
            },
            precision: {
                type: Number,
                default: 2
            },
            zoomout: { // 缩小展示倍数
                type: Number
            }
        },
        computed: {},
        data() {
            return {
                currentDisabled: this.disabled,
                curPlaceholder: this.placeholder,
                curMax: this.max,
                curMin: this.min
            }
        },
        watch: {
            disabled(val) {
                this.currentDisabled = val
            },
            placeholder(val){
                this.curPlaceholder = val
            },
            max(val){
                this.curMax = val
            },
            min(val){
                this.curMin = val
            }
        },
        methods: {
            formatMoney(val) {
                return formatMoney(val, this.zoomout)
            },
            parseMoney(val) {
                return parseMoney(val, this.zoomout)
            },
            handleChange(selected) {
                this.$emit('change', selected)
                this.$emit('on-change', selected)
            },
            handleBlur(selected){
                 this.$emit('on-blur', selected)
            }
        }
    }
</script>

<style>

</style>
