<template>
    <Select ref="DictSelect" :value="curVal" @on-change="handleChange" :placeholder="placeholder" :class="clz"
            :clearable="curClr" :disabled="currentDisabled" transfer :multiple="curMultiple" filterable
            :max-tag-count="maxTagCount">
        <!--<Option v-if="showAll" value="">全部</Option>-->
        <Option v-for="(dict, index) in options" :value="dict.value" :key="`live-col-${index}`">{{dict.name}}</Option>
    </Select>
</template>

<script>
    import {Select, Option} from 'view-design'

    export default {
        name: 'LiveSelect',
        components: {
            Select,
            Option
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: {
                type: [String, Number, Array],
                default: ''
            },
            code: {
                type: Object,
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
            clearable: {
                type: Boolean,
                default: false
            },
            filter: {
                type: Array,
                default() {
                    return []
                }
            },
            filterKill: {
                type: Array,
                default() {
                    return []
                }
            },
            multiple: {
                type: Boolean,
                default: false
            },
            showAll: {
                type: Boolean,
                default: false
            },
            maxTagCount: {
                type: Number,
                default: 1
            },
            option: { // 字典项
                type: Array,
                default() {
                    return []
                }
            }
        },
        computed: {},
        data() {
            return {
                options: this.getOptions(),
                currentDisabled: this.disabled,
                curClr: this.clearable,
                curVal: typeof this.value === 'object' ? this.value : this.value + '',
                curMultiple: this.multiple
            }
        },
        watch: {
            value(val) {
                this.curVal = typeof val === 'object' ? val : val + ''
            },
            disabled(val) {
                this.currentDisabled = val
            },
            clearable(val) {
                this.curClr = val
            },
            filter(val) {
                this.filter = val
            },
            filterKill(val) {
                this.filterKill = val
            }
        },
        methods: {
            getOptions() {
                let filterOption = []
                if (this.option.length === 0) return []
                let filter = this.filter.length > 0 ? this.filter : this.filterKill
                if (filter.length > 0) {
                    this.option.forEach(d => {
                        let isFilter = this.filter.length > 0 ? filter.includes(d.value) : !filter.includes(d.value)
                        isFilter && filterOption.push(d)
                    })
                    return filterOption
                }
                return this.option
            },

            handleChange(selected) {
                this.$emit('change', selected)
                this.$emit('on-change', selected)
            }
        }
    }
</script>

<style>

</style>
