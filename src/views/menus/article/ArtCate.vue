<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="add">添加分类</el-button>
      </div>
      <!-- 添加表格 -->
      <el-table
      stripe
    :data="cateList"
    border
    style="width: 100%">
     <el-table-column
  type="index"
       width="100"
      label="序号">
    </el-table-column>
    <el-table-column
      prop="cate_name"
      label="名称">
    </el-table-column>
    <el-table-column
      prop="cate_alias"
      label="分类别名">
    </el-table-column>
    <el-table-column
      label="操作">

  <template v-slot='{row}'>
    <el-button type="primary" size='mini' @click="edit(row)">编辑</el-button>
  <el-button type="danger"  size='mini' @click="del(row)">删除</el-button>
  </template>

    </el-table-column>
  </el-table>
  <!-- 添加dialog对话框 -->
  <!-- 关闭时清空dialog对话框
   @closed="$refs.pubForm.resetFields()" -->
  <el-dialog
   @closed="$refs.form.resetFields()"
  :title="hint"
  :visible.sync="dialogVisible"
  width="60%"
  ref=dialog
>
<!-- 添加表单 -->
  <el-form ref="form" :model="form" label-width="70px" :rules="rules">
  <el-form-item label="分类名称" prop="cate_name">
    <el-input v-model="form.cate_name"></el-input>
  </el-form-item>
  <el-form-item label="分类别名" prop="cate_alias">
    <el-input v-model="form.cate_alias"></el-input>
  </el-form-item>
   </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArtCate',
  data() {
    return {
      // 模态框默认属性
      hint: '添加',
      // 保存id编辑框id
      rows: {},
      dialogVisible: false,
      cateList: [],
      // 表单双向绑定
      form: {
        cate_name: '',
        cate_alias: ''
      },
      // 表单规则
      rules: {
        cate_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }],
        cate_alias: [{ required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{3,15}$/, message: '长度必须在 3 到 15 位字母数字', trigger: 'blur' }]
      }

    }
  },
  created() {
    this.renderList()
  },
  methods: {
    async renderList() {
      const { data: res } = await this.$axios.get('/my/cate/list')
      if (res.code === 0) {
        console.log(res.data)
        this.cateList = res.data
      }
    },
    // dialog复用修改title
    add() {
      this.hint = '添加'
      this.dialogVisible = true
    },
    edit(row) {
      if (row.id === 1 || row.id === 2) return this.$message.error('管理员不允许操作此条数据')
      this.hint = '修改'
      this.rows = row
      this.form = { ...row }
      this.dialogVisible = true
    },
    // 发送请求添加文章分类,或修改数据
    addCate() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        // 执行添加操作
        if (this.hint === '添加') {
          const { data: res } = await this.$axios.post('/my/cate/add', this.form)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
        } else {
          // 执行编辑操作
          this.$axios.put('/my/cate/info', this.form).then(({ data: res }) => {
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          })
        }
        this.renderList()
        this.dialogVisible = false
      })
    },
    del(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/my/cate/del', {
          params: {
            id: row.id
          }
        }).then(({ data: res }) => {
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          this.renderList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
