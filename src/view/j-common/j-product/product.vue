<template>
    <div>
      <tables ref="pdRef" v-model="mainTable" :columns="mainTableColumns"
      :total="mainList.total" :current="mainList.page" :page-size="mainList.pageSize">
         <div slot="search-form" class="search-form">
              <Input v-model="searchData.pdNm" clearable placeholder="产品名称" class="search-input" />
              <Input v-model="searchData.pdId" clearable placeholder="产品编号" class="search-input" />
          </div>
      </tables>
    </div>
</template>

<script>
  import tables from '_c/table'
  import {initTableColumns} from '@/libs/api.const'
  import dConst from './map'

  export default {
    name: 'product_page',
    components: {
      tables
    },
    data: function () {
      return {
        searchData: {},
        mainTableColumns: {},
        mainTable: [],
        mainList: {
          page: 1,
          pageSize: 10,
          total: 10
        }
      }
    },
    methods: {
      getMainList: function() {
        for (let i = 0; i < 10; i++) {
          let item = {
            pdNm: `产品${i + 1}`,
            pdId: `CP000${i}`,
            stat: '启用'
          }

          this.mainTable.push(item)
        }
      }
    },
    created () {
      this.mainTableColumns = initTableColumns(dConst.MA_TC0)
      this.getMainList()
    }
  }
</script>
