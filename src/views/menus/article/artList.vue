<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="p">
          <el-form-item label="文章分类">
            <el-select v-model="p.cate_id" placeholder="请选择分类" size="small">
              <el-option :label="item.cate_name" v-model="item.id" v-for="item in CateList" :key="item.id" ></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="p.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small"
            @click="fifterArt">筛选</el-button>
            <el-button type="info" size="small" @click='resetArt'>重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="dialogVisible=true">发表文章</el-button>
      </div>

      <!-- 文章表格区域 -->
  <el-table
    :data="artList"
    border
    style="width: 100%">
    <el-table-column
      label="标题"
      width="180">
      <template v-slot='{row}'>
       <el-link type="primary" @click="Artinfo(row.id)">{{row.title}}</el-link>
      </template>
    </el-table-column>
    <el-table-column
      prop="cate_name"
      label="分类"
      width="180">
    </el-table-column>
    <el-table-column
      label="发布时间">
      {{ForDate(CateList.pub_date)}}
    </el-table-column>
      <el-table-column
      prop="state"
      label="状态">
    </el-table-column>
    <el-table-column
      prop="address"
      label="操作">
     <template v-slot="{row}">
 <el-button type="danger" size="mini" @click='delArt(row)'>删除</el-button>
     </template>
    </el-table-column>
  </el-table>
      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="q.pagenum"
      :page-sizes="[2, 3, 5, 10]"
      :page-size="q.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 发布文章dialog -->
    <el-dialog
    @closed="closed"
    fullscreen
  title="文章发布"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
<el-form ref="form" :model="artForm" label-width="80px" :rules="artrules" >
  <el-form-item label="文章标题" prop="title">
    <el-input v-model="artForm.title" placeholder="请输入文章标题"></el-input>
  </el-form-item>
  <el-form-item label="文章分类" prop="cate_id">
    <el-select  v-model="artForm.cate_id" style="display:block" placeholder="请选择文章分类">
      <el-option v-for="item in CateList" :key="item.id"  :label="item.cate_name" v-model="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="文章内容" prop="content">
    <quill-editor v-model="artForm.content"
    @blur="$refs.form.validateField('content')" ></quill-editor>
  </el-form-item>
  <el-form-item label="文章封面" prop="cover_img">
<input type="file" name="" id="" style="display:none"  @blur="$refs.form.validateField('cover_img')" ref="inp" @change="updateImg">
<img v-if="artForm.cover_img" :src="cover" alt="" class="cover-img" ref="imgRef"/>
<img v-else src="../../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef"/>
<br>
<el-button style="border:0" type="text" @click="$refs.inp.click()">+选择封面</el-button>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="showArt('已发布')">发布</el-button>
<el-button type="info"  @click="showArt('草稿')">存为草稿</el-button>
  </el-form-item>
  </el-form>
</el-dialog>
<!-- 文章详情dialog -->
<el-dialog

  title="文章预览"
  :visible.sync="dialogVisibles"
  width="75%">
  <h1 class="title">{{detailsList.title}}</h1>
  <div class="info">
        <span>作者：{{ detailsList.nickname || detailsList.username }}</span>
        <span>发布时间：{{ ForDate(detailsList.pub_date) }}</span>
        <span>所属分类：{{ detailsList.cate_name }}</span>
        <span>状态：{{ detailsList.state }}</span>
      </div>
<!-- 分割线 -->
      <el-divider></el-divider>

      <img :src="'http://www.liulongbin.top:3008' + detailsList.cover_img" alt="" />

      <div v-html="detailsList.content"></div>
</el-dialog>
  </div>
</template>

<script>
// 引入dayjs
import dayjs from 'dayjs'
export default {
  name: 'ArtList',
  data() {
    return {
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      p: {
        cate_id: '',
        state: ''
      },
      // 储存总页数
      total: 0,
      // 获取下拉列表
      CateList: [],
      // dialog开关
      dialogVisible: false,
      // 文章详情dialog
      dialogVisibles: false,
      // 文章详情
      detailsList: {},
      // 存储图片url地址
      cover: '',
      // 渲染文章表格
      artList: [],
      // dialog表单
      artForm: {
        title: '',
        cate_id: '',
        content: '',
        state: '',
        cover_img: ''
      },
      // 规则
      artrules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '文章标题的长度为1-30个字符',
            trigger: 'blur'
          }
        ],
        cate_id: [
          { required: true, message: '请选择文章标题', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请需入文章内容', trigger: 'change' }
        ],
        cover_img: [
          { required: true, message: '请选择图片', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 关闭dialog询问
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 获取文章数据
    async initCateList() {
      const { data: res } = await this.$axios.get('/my/cate/list')
      this.CateList = res.data
      console.log(res.data)
    },
    // 更新图片预览
    updateImg(e) {
      const file = e.target.files[0]
      if (file) {
        this.cover = URL.createObjectURL(file)
        this.artForm.cover_img = file
        console.log(file)
        console.log(this.cover)
      } else {
        this.cover = ''
        this.artForm.cover_img = ''
      }
    },
    // 点击发布文章
    showArt(txt) {
      this.artForm.state = txt
      this.$refs.form.validate(async valid => {
        if (!valid) return
        const fd = new FormData()
        Object.keys(this.artForm).forEach((k) => fd.append(k, this.artForm[k]))
        await this.$axios.post('/my/article/add', fd)
        this.renderList()
        this.dialogVisible = false
      })
    },
    // 渲染文章列表
    async renderList() {
      const { data: res } = await this.$axios.get('/my/article/list', {
        params: this.q
      })
      this.artList = res.data
      this.total = res.total
    },
    // 修改时间格式
    ForDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    // 分页符
    // 每页显示多少条
    handleSizeChange(val) {
      this.q.pagesize = val
      this.renderList()
    },
    // 当前页面
    handleCurrentChange(val) {
      this.q.pagenum = val
      this.renderList()
    },
    // 筛选文章分类
    fifterArt() {
      this.q.pagenum = 1
      this.q.cate_id = this.p.cate_id
      this.q.state = this.p.state
      this.renderList()
    },
    // 重置文章筛选
    resetArt() {
      this.p = {
        cate_id: '',
        state: ''
      }
      this.q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      }
      this.renderList()
    },
    // 删除文章
    delArt(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.$axios.delete('/my/article/info', {
          params: {
            id: row.id
          }
        })
        if (this.q.pagenum > 1 && this.artList.length === 1) {
          console.log(111)
          this.q.pagenum--
        }
        this.renderList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 文章详情
    async  Artinfo(id) {
      const { data: res } = await this.$axios.get('/my/article/info', {
        params: {
          id
        }
      })
      this.detailsList = res.data
      this.dialogVisibles = true
      console.log(res)
    },
    // 关闭文章
    closed() {
      console.log(111)
      this.$refs.form.resetFields()
    }

  },
  created() {
    // 调用获取文章数据方法

    this.initCateList()
    this.renderList()
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
/deep/.ql-container{
  height: 300px;
}
.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}
.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}
</style>
