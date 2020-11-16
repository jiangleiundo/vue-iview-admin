<template>
    <InputNumber
        :min="curMin" :max="curMax" :value="currentValue" @on-change="handleChange" :class="clz"
        :formatter="value => value + this.suffix" :parser="value => value.replace(this.suffix, '')"
        :disabled="currentDisabled" :precision="curPrecision" :placeholder="curPlaceholder"></InputNumber>
</template>

<script>
    import InputNumber from '../input-number';
    import math from 'mathjs'

    export default {
        name: 'RateInput',
        components: {
            InputNumber
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            max: {
                type: Number,
                default: 100
            },
            min: {
                type: Number,
                default: 0.01
            },
            value: {
                type: [Number, String],
                default: null
            },
            placeholder: {
                type: String
            },
            clz: {
                type: String
            },
            disabled: {
                type: Boolean,
                default: false
            },
            suffix: {
                type: String,
                default: '%'
            },
            precision: {
                type: Number,
                default: 2
            },
            divide: { // 缩小倍数
                type: Number,
                default: 100
            }
        },
        computed: {},
        data() {
            return {
                currentValue: this.formatValue(this.value),
                currentDisabled: this.disabled,
                curPlaceholder: this.placeholder,
                curPrecision: this.precision,
                curMax: this.max,
                curMin: this.min
            }
        },
        watch: {
            value(val) {
                this.currentValue = this.formatValue(val)
            },
            disabled(val) {
                this.currentDisabled = val
            },
            precision(val) {
                this.curPrecision = val
            },
            placeholder(val) {
                this.curPlaceholder = val
            },
            max(val) {
                this.curMax = val
            },
            min(val) {
                this.curMin = val
            }
        },
        methods: {
            handleChange(val) {
                this.currentValue = val;
                this.setValue(val)
            },
            handleBlur(event) {
                this.$emit('blur', this.setValue(event.target.value))
            },
            formatValue(val) {
                if (val && !isNaN(val)) {
                    return math.chain(val).multiply(this.divide).round(6).value
                } else {
                    return ''
                }
            },
            setValue(val) {
                if (val !== null) {
                    val = math.chain(val).divide(this.divide).round(6).value
                }
                this.$nextTick(() => {
                    this.$emit('input', val);
                    this.$emit('change', val);
                });
            }
        }
    }
</script>

<style>

</style>
