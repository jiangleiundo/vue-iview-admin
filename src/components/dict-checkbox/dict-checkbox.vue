<template>
    <CheckboxGroup ref="DictCheckbox" v-model="values" :class="clz" @on-change="handleChange">
        <Checkbox v-for="(dict, index) in dicts" :key="index" :label="dict.value" class="dict-checkbox"
                  :disabled="currentDisabled || (disabledList && disabledList.indexOf(dict.value) >=0)">
            {{ dict.name }}
        </Checkbox>
    </CheckboxGroup>
</template>

<script>
    import {CheckboxGroup, Checkbox} from 'view-design';
    import {getDicts, arrayToStr} from '../../libs/api.utils'

    export default {
        name: 'DictCheckbox',
        components: {
            CheckboxGroup,
            Checkbox
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: {
                type: [String, Array]
            },
            code: {
                type: String,
                required: true
            },
            clz: {
                type: String
            },
            split: {
                type: String,
                default: ','
            },
            disabled: {
                type: Boolean,
                default: false
            },
            filter: {
                type: Array
            },
            filterKill: {
                type: Array
            },
            disabledList: {
                type: Array
            },
            pure: {
                type: Boolean,
                default: false
            }
        },
        computed: {},
        data() {
            let vm = this
            return {
                dicts: this.getDicts(),
                values: vm.setValue(vm.value),
                currentDisabled: this.disabled,
                currentValue: this.value
            }
        },
        watch: {
            value(val) {
                this.values = this.setValue(val)
            },
            disabled(val) {
                this.currentDisabled = val
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
            setValue(val) {
                let values = []
                if (this.pure) {
                    values = val
                } else {
                    values = val ? val.split(this.split) : []
                }
                return values
            },
            getValue() {
                return this.pure ? this.values : arrayToStr(this.values, this.split)
            },
            handleChange(selected) {
                this.values = selected
                if (this.pure) {
                    this.$emit('change', selected)
                    this.$emit('on-change', selected)
                } else {
                    this.currentValue = this.getValue()
                    this.$emit('change', this.currentValue)
                    this.$emit('on-change', this.currentValue)
                }
            }
        }
    }
</script>

<style>
    .dict-checkbox {
        height: 40px;
        line-height: 2.5;
    }
</style>
