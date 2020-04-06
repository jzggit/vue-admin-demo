<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 5px">
<!--      <el-input v-model="listQuery.pid" placeholder="父级区划" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
      <el-select v-model="listQuery.path" clearable filterable placeholder="请选择父级区划" class="filter-item">
        <el-option
          v-for="item in selectList"
          :key="item.path"
          :label="item.codeName"
          :value="item.path">
          <span style="float: left">{{ item.codeName }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
        </el-option>
      </el-select>
      <el-input v-model="listQuery.codeName" placeholder="行政区划名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.codeType" placeholder="行政区划类型" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in codeTypeData" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
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
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="父级区划编号">
        <template slot-scope="scope">
          {{ scope.row.pid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="区划代码">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="区划名称">
        <template slot-scope="scope">
          {{ scope.row.codeName }}
        </template>
      </el-table-column>
      <el-table-column class-name="codeType-col" label="区划类型" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ getCodeType(scope.row.codeType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleNextCreate(row)">
            添加下级
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="编号" prop="id">
          <el-input v-model.number="temp.id" maxlength="8" show-word-limit />
        </el-form-item>
        <el-form-item label="父级区划" prop="dictType">
          <!--          <el-input v-model="temp.pid" />-->
          <SelectTree
            :props="props"
            :options="optionData"
            :value="temp.pid"
            :clearable="isClearable"
            :accordion="isAccordion"
            @getValue="getValue"
          />
        </el-form-item>
        <el-form-item label="区划编码" prop="dictType">
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item label="区划名称" prop="dictKey">
          <el-input v-model="temp.codeName" />
        </el-form-item>
        <el-form-item label="区划类型" prop="dictValue">
          <el-select v-model="temp.codeType" placeholder="行政区划类型" clearable style="width: 190px" class="filter-item">
            <el-option v-for="item in codeTypeData" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="temp.sort" maxlength="8" show-word-limit />
        </el-form-item>
        <el-input v-model="temp.path" type="hidden" maxlength="8" show-word-limit />
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
// eslint-disable-next-line no-unused-vars
import { getList, getQueryList, saveZoning, updateZoning } from '@/api/zoning'
import { getDictByType } from '@/api/common'
// eslint-disable-next-line no-unused-vars
import SelectTree from '../../components/SelectTree/index.vue'
export default {
  components: {
    SelectTree
  },
  data() {
    return {
      list: [
        {
          'id': undefined,
          'pid': undefined,
          'path': undefined,
          'code': undefined,
          'codeName': undefined,
          'codeType': undefined,
          'isLeaf': undefined,
          'isExpand': undefined,
          'sort': undefined }],
      listLoading: true,
      listQuery: {
        id: undefined,
        codeName: undefined,
        codeType: undefined,
        pid: undefined,
        path: undefined
      },
      codeTypeData: [{ dictKey: 0, dictValue: '未知' }],
      temp: {
        id: undefined,
        pid: undefined,
        code: undefined,
        codeName: undefined,
        codeType: undefined,
        sort: undefined,
        path: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑行政区划',
        create: '添加行政区划'
      },
      rules: {
        id: [{ required: true, message: '编号不能为空', trigger: 'change' }, { type: 'number', message: '编号必须为数字值' }],
        code: [{ required: true, message: '区划代码不能为空', trigger: 'change' }],
        codeName: [{ required: true, message: '区划名称不能为空', trigger: 'blur' }],
        codeType: [{ required: true, message: '区划类型不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '排序编号不能为空', trigger: 'blur' }, { type: 'number', message: '排序编号必须为数字值' }]
      },
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: 200, // 初始ID（可选）
      props: { // 配置项（必选）
        value: 'id',
        label: 'codeName',
        children: 'children',
        path: 'path'
        // disabled:true
      },
      // 选项列表（必选）
      // eslint-disable-next-line no-dupe-keys,vue/no-dupe-keys
      list1: [{ id: undefined, pid: undefined, name: undefined }],
      selectList: [{ id: undefined, pid: undefined, name: undefined }]
    }
  },
  computed: {
    /* 转树形数据 */
    // eslint-disable-next-line vue/return-in-computed-property
    optionData() {
      // eslint-disable-next-line no-undef,no-empty
      if (this.list1 != null) {
        const cloneData = JSON.parse(JSON.stringify(this.list1)) // 对源数据深度克隆
        return cloneData.filter(father => { // 循环所有项，并添加children属性
          // eslint-disable-next-line eqeqeq
          const branchArr = cloneData.filter(child => father.id == child.pid) // 返回每一项的子级数组
          branchArr.length > 0 ? father.children = branchArr : '' // 给父级添加一个children属性，并赋值
          // eslint-disable-next-line eqeqeq
          return father.pid == 0 // 返回第一层
        })
      }
    }
  },
  created() {
    this.getDict()
    this.fetchData()
    this.getZoningList()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data
        console.log('list-', this.list, response)
        this.listLoading = false
        // this.total = response.data.total
      })
    },
    handleFilter() {
      // this.listQuery.page = 1
      this.fetchData()
    },
    handleRest() {
      this.listQuery.codeName = undefined
      this.listQuery.codeType = undefined
      this.listQuery.pid = undefined
      this.listQuery.path = undefined
    },
    getDict() {
      getDictByType('zoningType').then(response => {
        this.codeTypeData = response.data.map(item => { return { dictKey: parseInt(item.dictKey), dictValue: item.dictValue } })
      })
    },
    getCodeType(codeType) {
      if (codeType == null) { return '未知' }
      // eslint-disable-next-line no-unused-vars,eqeqeq
      const codeValue = this.codeTypeData.filter(item => { if (item.dictKey === codeType) { return item.dictValue } else { return 0 } })
      return codeValue[0].dictValue
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.valueId = row.pid
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
          this.update()
        }
      })
    },
    handleCreate() {
      this.resetTemp()
      this.temp.pid = undefined
      // this.valueId = ''
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleNextCreate(row) {
      this.resetTemp()
      this.temp.pid = row.id
      // this.valueId = row.id
      this.temp.path = row.path
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
      saveZoning(this.temp).then(response => {
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
    update() {
      // eslint-disable-next-line no-undef
      updateZoning(this.temp).then(response => {
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
        pid: undefined,
        code: undefined,
        codeName: undefined,
        codeType: undefined,
        sort: undefined,
        path: undefined
      }
    },
    getValue(value, path) {console.log("op-",value,path)
      this.temp.pid = value
      this.temp.path = path
    },
    getZoningList() {
      getQueryList(this.temp).then(response => {
        this.list1 = response.data
        this.selectList = response.data
      })
    }
  }
}
</script>
