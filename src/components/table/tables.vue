<template>
  <div :class="clz">
    <div v-if="searchable || btnOnly"
         class="search-con-parent">
      <div class="search-con search-con-top">
        <Card class="search-card">
          <Form ref="condForm" :label-width="labelWidth"
                class="search-con search-con-top j-table-form" inline
                :style="{height: searchable ? 'auto' : '51px'}">
            <Row>
              <Col :span="24-col">
                <slot v-if="searchable" name="search-form"></slot>
                <span v-if="!searchable" class="search-input"></span>
              </Col>
              <Col :span="col">
              <div class="fl-r search-btn">
                <Button v-if="searchable" class="j-search-btn" @click="handleSearch" :loading="loading" type="primary" shape="circle" icon="ios-search"></Button>
                <Button v-if="searchable" class="j-search-btn" @click="handleRefresh" :loading="loading" type="primary" shape="circle" icon="ios-refresh"></Button>
                <Button v-if="exportTable" class="j-export-btn" @click="handleExport" :loading="loading" type="primary">{{exportBtnTxt}}</Button>
                <div v-if="btnOnly" class="fl-r j-search-btn">
                  <slot name="search-btn"></slot>
                </div>
              </div>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
    <div v-if="!isShowTable">
      <Card class="j-con-card">
        <slot name="expand-card"></slot>
      </Card>
    </div>
    <Card v-show="isShowTable"
          class="table-card"
          :class="{ 'no-search': !searchable && !btnOnly }">
      <h4 class="j-table-title"
          v-if="tableTitle">
        {{ tableTitle }}
        <div class="fl-r table-title-btn">
          <slot name="table-title-btn"></slot>
        </div>
      </h4>
      <Table ref="tablesMain"
             :data="insideTableData"
             :columns="insideColumns"
             :stripe="stripe"
             :border="border"
             :show-header="showHeader"
             :width="width"
             :height="height"
             :loading="loading"
             :disabled-hover="disabledHover"
             :highlight-row="highlightRow"
             :row-class-name="rowClassName"
             :size="size"
             :editable="curEditable"
             :no-data-text="noDataText"
             :no-filtered-data-text="noFilteredDataText"
             :span-method="handleSpan"
             @on-current-change="onCurrentChange"
             @on-select="onSelect"
             @on-select-cancel="onSelectCancel"
             @on-select-all="onSelectAll"
             @on-selection-change="onSelectionChange"
             @on-sort-change="onSortChange"
             @on-filter-change="onFilterChange"
             @on-row-click="onRowClick"
             @on-row-dblclick="onRowDblclick"
             @on-expand="onExpand">
        <slot name="header"
              slot="header"></slot>
        <slot name="footer"
              slot="footer"></slot>
        <slot name="loading"
              slot="loading"></slot>
      </Table>

      <div v-if="pageable"
           class="page-card-container">
        <div class="fl-r">
          <Page :total="total"
                :current="currentPage"
                :page-size="currentPageSize"
                @on-change="changePage"
                @keydown.native.enter.prevent="onSize(e.target.value)"
                @on-page-size-change="onSize"
                show-total
                show-elevator
                show-sizer
                transfer></Page>
        </div>
      </div>

      <slot name="table-foot"></slot>
    </Card>
  </div>
</template>

<script>
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  Table,
  Page,
  Tooltip,
  Poptip,
  Icon
} from 'view-design'
import {valueToText, buildTableBtns} from '../../libs/api.utils'
import TablesEdit from './edit.vue'
import handleBtns from './handle-btns'
import './index.less'

export default {
  name: 'Tables',
  components: {
    Card,
    Form,
    Row,
    Col,
    Button,
    Page,
    Tooltip,
    Poptip,
    Icon,
    Table
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    col: {
      type: Number,
      default: 6
    },
    size: String,
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default() {
        return ''
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可搜索
     */
    searchable: {
      type: Boolean,
      default: true
    },
    /**
     * @description 是否分页
     */
    pageable: {
      type: Boolean,
      default: true
    },
    /**
     * @description 是否只显示button
     */
    btnOnly: {
      type: Boolean,
      default: true
    },
    current: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    authCode: {
      type: String
    },
    labelWidth: {
      type: Number,
      default: 110
    },
    clz: {
      type: String
    },
    isShowTable: {
      type: Boolean,
      default: true
    },
    tableTitle: {
      type: String
    },
    handleSpan: {
      type: Function,
      default() {
        return []
      }
    },
    exportTable: {
      type: Boolean,
      default: false
    },
    exportBtnTxt: {
      type: String,
      default: 'excel导出'
    }
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data() {
    return {
      insideColumns: [],
      insideTableData: [],
      edittingCellId: '',
      edittingText: '',
      searchValue: '',
      searchKey: '',
      currentPage: this.current,
      currentPageSize: this.pageSize,
      curEditable: this.editable
    }
  },
  methods: {
    suportEdit(item, index) {
      item.render = (h, params) => {
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable
          },
          on: {
            input: val => {
              this.edittingText = val
            },
            'on-start-edit': params => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`
              this.$emit('on-start-edit', params)
            },
            'on-cancel-edit': params => {
              this.edittingCellId = ''
              this.$emit('on-cancel-edit', params)
            },
            'on-save-edit': params => {
              // eslint-disable-next-line standard/computed-property-even-spacing
              this.value[params.row.initRowIndex][
                params.column.key
              ] = this.edittingText
              this.$emit('input', this.value)
              this.$emit(
                'on-save-edit',
                Object.assign(params, {value: this.edittingText})
              )
              this.edittingCellId = ''
            }
          }
        })
      }
      return item
    },
    jSupportEdit(item, index) {
      item.render = (h, params) => {
        return h(
          'div',
          {
            style: {
              padding: '4px 0',
              width: '100%'
            },
            props: {
              value: this.insideTableData[params.index][params.column.key]
            },
            attrs: {
              contenteditable: this.editable,
              title: '点击可编辑'
            },
            on: {
              blur: evt => {
                evt.target.innerText =
                  evt.target.innerText || params.row[params.column.key]
                params.row[params.column.key] = evt.target.innerText
                this.insideTableData[params.index][params.column.key] =
                  evt.target.innerText
              }
            }
          },
          params.row[params.column.key]
        )
      }
      return item
    },
    jInputEdit(item, index) {
      item.render = (h, params) => {
        if (params.row.pure) {
          return h('span', {}, params.row[params.column.key])
        } else {
          return h('Input', {
            props: {
              value: params.row[params.column.key],
              type: item.input || 'text',
              disabled: params.row.disabled || false,
              // clearable: !params.row.disabled,
              rows: 2, // type为textarea时才有效
              size: 'small'
            },
            on: {
              'on-blur': evt => {
                this.insideTableData[params.index][params.column.key] =
                  evt.target.value
                this.$emit('on-input-change', params, evt.target.value)
              }
            }
          })
        }
      }
      return item
    },
    jSupportLink(item, index) {
      item.render = (h, params) => {
        return h(
          'a',
          {
            style: {
              textDecoration: 'underline'
            },
            on: {
              click: () => {
                this.handleLink(params.row)
              }
            }
          },
          params.row[params.column.key]
        )
      }
      return item
    },
    jSupportSelect(item, index) {
      item.render = (h, params) => {
        if (params.row.pure) {
          return h(
            'span',
            {},
            item.tableDict.val2Nm[params.row[params.column.key]]
          )
        } else {
          return h(
            'Select',
            {
              props: {
                value: params.row[params.column.key],
                size: 'small',
                disabled: item.disabled || false,
                transfer: true
              },
              on: {
                'on-change': val => {
                  this.insideTableData[params.index][params.column.key] = val
                }
              }
            },
            item.tableDict.option.map(optionItem => {
              return h(
                'Option',
                {
                  props: {
                    value: optionItem.value || optionItem,
                    label: optionItem.label || optionItem
                  }
                },
                optionItem.label || optionItem
              )
            })
          )
        }
      }
      return item
    },
    jLongText(item, index) {
      item.render = (h, params) => {
        let txt = params.row[params.column.key]
        let tableTxt = ''
        if (txt) {
          if (txt.length > item.longText) {
            tableTxt = txt.substring(0, item.longText) + '...'
          } else {
            tableTxt = txt
          }
        }
        return h(
          'Tooltip',
          {
            props: {
              placement: 'top'
            }
          },
          [
            tableTxt,
            h(
              'span',
              {
                slot: 'content',
                style: {
                  whiteSpace: 'normal',
                  wordBreak: 'break-all'
                }
              },
              txt
            )
          ]
        )
      }
      return item
    },
    surportHandle(item) {
      let insideBtns = buildTableBtns(item.options, this.authCode)
      item.button && insideBtns.push(item.button)
      item.render = (h, params) => {
        params.tableData = this.value
        let btns = insideBtns.map(item => item(h, params, this))
        if (item.buttons) {
          let btnArr = item.buttons(h, params, this)
          if (btnArr && btnArr.length > 0) {
            btns = btns.concat(btnArr.map(item => item(h, params, this)))
          }
        }
        return h('div', btns)
      }
      return item
    },
    surportType(item) {
      if (item.type == 'money') {
        item.align = 'right'
        if (!item.minWidth || item.minWidth < 160) item.minWidth = 160
      }
      if (item.type == 'date') {
        if (!item.minWidth || item.minWidth < 120) item.minWidth = 120
      }
      if (item.type == 'datetime') {
        if (!item.minWidth || item.minWidth < 170) item.minWidth = 170
      }
      item.render = (h, params) => {
        return h(
          'span',
          valueToText(params.row[item.key], item.type, item.code)
        )
      }

      return item
    },
    handleColumns(columns) {
      this.insideColumns = columns.map((item, index) => {
        let res = item
        //                    if (res.editable) res = this.suportEdit(res, index)
        if (res.editable) res = this.jSupportEdit(res, index)
        if (res.inputEditable) res = this.jInputEdit(res, index)
        if (res.linkable) res = this.jSupportLink(res, index)
        if (res.tableDict) res = this.jSupportSelect(res, index)
        if (res.longText) res = this.jLongText(res, index)
        if (res.key === 'handle') res = this.surportHandle(res)
        if (res.type && res.type != 'expand') res = this.surportType(res)
        return res
      })
    },
    setDefaultSearchKey() {
      this.searchKey =
        this.columns[0].key !== 'handle'
          ? this.columns[0].key
          : this.columns.length > 1
          ? this.columns[1].key
          : ''
    },
    handleClear(e) {
      if (e.target.value === '') this.insideTableData = this.value
    },

    handleSearch() {
      this.$emit('on-search')
    },
    handleTableData() {
      if (!this.value.map) {
        console.log('tables props value is must be Array!')
        return
      }
      this.insideTableData = this.value.map((item, index) => {
        let res = item
        res.initRowIndex = index
        return res
      })
    },
    exportCsv(params) {
      this.$refs.tablesMain.exportCsv(params)
    },
    clearCurrentRow() {
      this.$refs.talbesMain.clearCurrentRow()
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onSelect(selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel(selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll(selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange(selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange(column, key, order) {
      this.$emit('on-sort-change', column, key, order)
    },
    onFilterChange(row) {
      this.$emit('on-filter-change', row)
    },
    onRowClick(row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick(row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand(row, status) {
      this.$emit('on-expand', row, status)
    },
    changePage(page) {
      if (this.currentPage != page) {
        this.currentPage = page
        this.$emit('update:current', page)
        this.$emit('on-change', page)
      }
    },
    onSize(pageSize) {
      this.changePage(1)
      this.$nextTick(() => {
        this.currentPageSize = pageSize
        this.$emit('on-page-size-change', pageSize)
      })
    },
    handleShowOrHide: function() {
      this.isShow = !this.isShow
    },
    handleRefresh: function() {
      this.$emit('on-refresh')
    },
    handleLink: function(row) {
      this.$emit('on-link', row)
    },
    handleExport: function() {
      this.$emit('on-export')
    }
    // handleSpan ({ row, column, rowIndex, columnIndex }) {
    //     if (rowIndex === 5) {
    //         if(columnIndex === 3) {
    //             return [2, 2];
    //         }
    //     } else if (rowIndex === 6 && columnIndex === 4) {
    //         return  [0, 0];
    //     }
    // }
  },
  watch: {
    editable(val) {
      this.curEditable = val
    },
    columns(columns) {
      this.handleColumns(columns)
      //                this.setDefaultSearchKey()
    },
    value(val) {
      this.handleTableData()
    },
    total(val) {
      let maxPage = Math.ceil(val / this.currentPageSize)
      if (maxPage < this.currentPage) {
        this.currentPage = maxPage === 0 ? 1 : maxPage
      }
    },
    current(val) {
      this.currentPage = val
    },
    pageSize(val) {
      this.currentPageSize = val
    }
  },
  mounted() {
    this.handleColumns(this.columns)
    //            this.setDefaultSearchKey()
    this.handleTableData()
  }
}
</script>

<style lang="less" scoped>
.btnOnly {
  .ivu-card-body {
    padding: 0;
  }
}

.search-con-parent {
  position: relative;

  .search-con {
    .ivu-card-body {
      padding: 0;
    }
  }

  .search-arrow {
    width: 120px;
    height: 14px;
    line-height: 10px;
    position: absolute;
    left: 50%;
    bottom: 7px;
    margin-left: -60px;

    border: 1px solid #ddd;
    background: #fff;
    border-top-color: #fff;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;

    text-align: center;
    font-size: 14px;
    color: #ba9759;

    &:hover {
      cursor: pointer;
    }
  }
}

.search-con-parent-active {
  .search-con {
    .ivu-card-body {
      height: 51px;
      overflow: hidden;
    }
  }
}

.ivu-btn-circle.ivu-btn-icon-only {
  font-size: 20px;
}

.search-btn {
  margin-right: 10px;
}

.no-search {
  margin-top: -5px;
}

.j-table-form {
  padding-bottom: 0;
  .j-search-btn {
    vertical-align: 0;
  }
  .j-export-btn {
    vertical-align: top;
  }
}

.j-table-title {
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  margin-bottom: 4px;
}

.table-title-btn {
  margin-top: -3px;
}
</style>
