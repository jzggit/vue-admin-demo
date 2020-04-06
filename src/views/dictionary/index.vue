<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 5px">
      <el-input v-model="listQuery.dictType" placeholder="字典类型" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.dictTypeName" placeholder="字典类型名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.dictKey" placeholder="字典编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.dictValue" placeholder="字典值" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.isVail" placeholder="是否启用" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in validType" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" @click="handleRest">
        重置
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
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
        <template slot-scope="scope" >
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="字典类型" width="110">
        <template slot-scope="scope">
          {{ scope.row.dictType }}
        </template>
      </el-table-column>
      <el-table-column label="字典类型名称" width="110">
        <template slot-scope="scope">
          {{ scope.row.dictTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="字典编号" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dictKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字典值" align="center">
        <template slot-scope="scope">
          {{ scope.row.dictValue }}
        </template>
      </el-table-column>
      <el-table-column class-name="isVail-col" label="是否启用" width="110" align="center" :formatter="formatterSexType">
        <template slot-scope="scope">
          <span>{{ getValidType(scope.row.isVail) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="排序" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleUpdate(row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="编号" prop="id">
          <el-input v-model.number="temp.id" maxlength="8" show-word-limit />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="temp.dictType" />
        </el-form-item>
        <el-form-item label="类型名称" prop="dictType">
          <el-input v-model="temp.dictTypeName" />
        </el-form-item>
        <el-form-item label="字典编码" prop="dictKey">
          <el-input v-model="temp.dictKey" />
        </el-form-item>
        <el-form-item label="字典值" prop="dictValue">
          <el-input v-model="temp.dictValue" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isVail">
          <el-select v-model="temp.isVail" class="filter-item" placeholder="请选择">
            <el-option v-for="item in validType" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort" >
          <el-input v-model.number="temp.sort" maxlength="8" show-word-limit/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getDictList, saveDict } from '@/api/dictionary'
import Pagination from '@/components/Pagination'
// eslint-disable-next-line no-unused-vars
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
        dictType: undefined,
        dictTypeName: undefined,
        dictKey: undefined,
        dictValue: undefined,
        isVail: undefined
      },
      validType: [{ dictKey: 0, dictValue: '未知' }],
      temp: {
        id: undefined,
        dictType: undefined,
        dictTypeName: undefined,
        dictKey: undefined,
        dictValue: undefined,
        isVail: undefined,
        sort: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑数据字典',
        create: '添加数据字典'
      },
      rules: {
        id: [{ required: true, message: '编号不能为空', trigger: 'change' }, { type: 'number', message: '编号必须为数字值' }],
        dictType: [{ required: true, message: '字典类型不能为空', trigger: 'change' }],
        dictTypeName: [{ required: true, message: '字典类型名称不能为空', trigger: 'change' }],
        dictKey: [{ required: true, message: '字典编码不能为空', trigger: 'blur' }],
        dictValue: [{ required: true, message: '字典值不能为空', trigger: 'blur' }],
        isVail: [{ required: true, message: '是否有效不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '排序编号不能为空', trigger: 'blur' }, { type: 'number', message: '排序编号必须为数字值' }]
      }
    }
  },
  created() {
    //eslint -disable-next-line no-sequences
    this.getDict()
    this.fetchData()
  },
  methods: {
    fetchData() {
      console.log('---')
      this.listLoading = true
      getDictList(this.listQuery).then(response => {
        this.list = response.data.list
        this.listLoading = false
        this.total = response.data.total
      })
    },
    getDict() {
      getDictByType('isValid').then(response => {
        this.validType = response.data.map(item => { return { dictKey: parseInt(item.dictKey), dictValue: item.dictValue } })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleRest() {
      this.listQuery.dictType = undefined
      this.listQuery.dictTypeName = undefined
      this.listQuery.dictKey = undefined
      this.listQuery.dictValue = undefined
      this.listQuery.isVail = undefined
    },
    formatterSexType(row, column, cellValue, index) {
      console.log('row', cellValue)
    },
    getValidType(validType) {
      const validValue = this.validType.filter(item => { if (item.dictKey === validType) return item.dictValue })
      console.log('09', validType)
      return validValue[0].dictValue
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        // eslint-disable-next-line no-empty
        if (valid) {
          this.save()
        }
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        // eslint-disable-next-line no-empty
        if (valid) {
          this.save()
        }
      })
    },
    save() {
      // eslint-disable-next-line no-undef
      saveDict(this.temp).then(response => {
        this.dialogFormVisible = false
        // eslint-disable-next-line eqeqeq
        if (response.code == '0000') {
          this.$message({
            message: response.data,
            type: 'success'
          })
        } else {
          this.$message.error(response.data)
        }
        this.fetchData()
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        dictType: undefined,
        dictTypeName: undefined,
        dictKey: undefined,
        dictValue: undefined,
        isVail: undefined,
        sort: undefined
      }
    }
  }
}
</script>
