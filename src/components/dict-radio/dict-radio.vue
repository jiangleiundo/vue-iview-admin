<template>
    <RadioGroup ref="DictRadio" v-model="value" @on-change="handleChange" :class="clz">
        <Radio v-for="(dict, index) in dicts" :key="index" :label="dict.value" class="dict-radio"
               :disabled="currentDisabled || (disabledList && disabledList.indexOf(dict.value) >=0)">
            {{ dict.name }}
        </Radio>
    </RadioGroup>
</template>

<script>
    import {RadioGroup, Radio} from 'view-design';
    import { getDicts } from '../../libs/api.utils'
    export default {
        name: 'DictRadio',
        components: {
            RadioGroup,
            Radio
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: {
                type: [String, Number, Array]
            },
            code: {
                type: String,
                required: true
            },
            clz: {
                type: String
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
            }
        },
        computed: {},
        data() {
            return {
                dicts: this.getDicts(),
                currentDisabled: this.disabled
            }
        },
        watch: {
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
            handleChange (selected) {
                this.$emit('change', selected)
                this.$emit('on-change', selected)
            }
        }
    }
</script>

<style>
    .dict-radio {
        height: 40px;
        line-height: 2.5;
    }
</style>
