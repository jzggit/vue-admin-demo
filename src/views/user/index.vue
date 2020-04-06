<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 5px">
      <el-input v-model="listQuery.sysUserName" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sysUserSex" placeholder="性别" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in sexData" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" @click="handleRest">
        重置
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="编号" width="95">
        <template slot-scope="scope">
          {{ scope.row.sysUserId }}
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{ scope.row.sysUserName }}
        </template>
      </el-table-column>
      <el-table-column label="密码" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sysUserPassword }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.sysUserAge }}
        </template>
      </el-table-column>
      <el-table-column class-name="sysUserSex-col" label="性别" width="110" align="center" :formatter="formatterSexType">
        <template slot-scope="scope">
          <!--          <span>{{ scope.row.sysUserSex==1?'男':'女' }}</span>-->
          <span>{{ getSexType(scope.row.sysUserSex) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sysUserPhone" label="联系电话" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.sysUserPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sysUserIdCard" label="证件号" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.sysUserIdCard }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sysUserCardType" label="证件类型" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.sysUserCardType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sysUserEmail" label="邮件" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.sysUserEmail }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sysUserQq" label="QQ号" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.sysUserQq }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sysUserWx" label="微信号" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.sysUserWx }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sysUserLock" label="是否锁定" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.sysUserLock }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sysLockDate" label="锁定日期" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.sysLockDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sysUserExpired" label="是否过期" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.sysUserExpired }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sysExpiredDate" label="过期日期" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.sysExpiredDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sysUserType" label="用户类型" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.sysUserType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sysUserSort" label="排序码" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.sysUserSort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
import { getList } from '@/api/user'
import Pagination from '@/components/Pagination'
import { getDictByType } from '@/api/common'

export default {
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        sysUserName: undefined,
        sysUserSex: undefined,
        type: undefined
      },
      sexData: [{ dictKey: 0, dictValue: '未知' }]
    }
  },
  created() {
    this.getDict()
    this.fetchData()
    console.log('create', 'eee')
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.list
        this.listLoading = false
        this.total = response.data.total
      })
    },
    getDict() {
      getDictByType('sex').then(response => {
        this.sexData = response.data.map(item => { return { dictKey: parseInt(item.dictKey), dictValue: item.dictValue } })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleRest() {
      this.listQuery.sysUserName = undefined
      this.listQuery.sysUserSex = undefined
    },
    formatterSexType(row, column, cellValue, index) {
      console.log('row', cellValue)
    },
    getSexType(sexType) {
      // eslint-disable-next-line no-unused-vars,eqeqeq
      const sexValue = this.sexData.filter(item => { if (item.dictKey === sexType) return item.dictValue })
      console.log(sexValue)
      return sexValue[0].dictValue
    },
    handleUpdate(row) {
      console.log('edit', row)
    }
  }
}
</script>
