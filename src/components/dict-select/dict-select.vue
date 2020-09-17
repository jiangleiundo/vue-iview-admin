<template>
    <Select ref="DictSelect" :value="curVal" @on-change="handleChange" :placeholder="placeholder" :class="clz"
            :clearable="curClr" :disabled="currentDisabled" transfer :multiple="curMultiple" filterable
            :max-tag-count="maxTagCount">
        <Option v-if="showAll" value="">全部</Option>
        <Option v-for="dict in dicts" :value="dict.value" :key="`dict-col-${dict.dictId}`">{{dict.name}}</Option>
    </Select>
</template>

<script>
    import {Select, Option} from 'view-design';
    import {getDicts} from '../../libs/api.utils'

    export default {
        name: 'DictSelect',
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
                type: String,
                required: true
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
                type: Array
            },
            filterKill: {
                type: Array
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
            }
        },
        computed: {},
        data() {
            return {
                dicts: this.getDicts(),
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
                this.dicts = this.getDicts()
            },
            filterKill(val) {
                this.filterKill = val
                this.dicts = this.getDicts()
            }
        },
        methods: {
            getDicts() {
                return getDicts(this.code, this.filter, this.filterKill)
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
