<template>

  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForms" label-width="80px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username" >
    <el-input  v-model="ruleForm.username" autocomplete="off" disabled></el-input>
  </el-form-item>
  <el-form-item label="用户昵称" prop="nickname">
    <el-input v-model="ruleForm.nickname" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="ruleForm.email"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm">提交修改</el-button>
    <el-button @click="$refs.ruleForms.resetFields()">重置</el-button>
  </el-form-item>
</el-form>
  </el-card>
</template>

<script>
export default {
  name: 'UserInfo',

  data() {
    return {
      ruleForm: {
        username: this.$store.state.user.userInfo.username
      },
      rules: {
        nickname: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {

    // 提交修改表单
    submitForm() {
      this.$refs.ruleForms.validate(async valid => {
        if (!valid) return this.$message.error('输入内容有误')
        const { data: res } = await this.$axios.put('/my/userinfo', this.ruleForm)
        console.log(res)
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.$store.commit('user/userInfo', this.ruleForm)
        this.ruleForm = {
          username: this.$store.state.user.userInfo.username
        }
      })
    },
    // 重置表单
    resetForm() {
      this.$refs.ruleForms.resetFields()
    }
  },
  // 因为elementui重置是通过prop属性完成,resetField()方法不是将表单重置为空，
  // 而是重置为初始值,初始值为data中开始的数据
  mounted() {
    this.ruleForm = { ...this.$store.state.user.userInfo }

  }

}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
