<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
     <el-form :label-position="labelPosition"  :rules="regrules" :model="regFrom" ref="regFrom">
  <el-form-item prop='username'>
    <el-input v-model="regFrom.username"  placeholder="请输入用户名"></el-input>
  </el-form-item>
  <el-form-item prop='password'>
    <el-input v-model="regFrom.password" placeholder="请输入密码" type="password"></el-input>
  </el-form-item>
  <el-form-item prop='repassword'>
    <el-input v-model="regFrom.repassword" placeholder="请再次确认密码" type='password'></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary"
    style="width:100%" @click="regFN"  >注册</el-button>
     <el-link type="info" @click="$router.push('/login')">去登录</el-link>
  </el-form-item>
</el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reg',

  data() {
    // 注册规则
    const validatepwd = (rule, value, callback) => {
      const reg1 = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*.])[\da-zA-Z~!@#$%^&*.]{6,}$/ // 密码必须是8位以上、必须含有字母、数字、特殊符号
      if (!reg1.test(value)) {
        callback(new Error('密码必须是6位以上、必须含有字母、数字、特殊符号'))
      } else {
        callback()
      }
    }

    const validatepwds = (rule, value, callback) => {
      if (value !== this.regFrom.password) {
        console.log(value)
        console.log(this.paw)
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }

    return {
      labelPosition: 'left',
      regFrom: {
        username: '',
        password: '',
        repassword: ''
      },
      // 注册规则
      regrules: {
        username: [

          { required: true, message: '管理员姓名不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            required: true,
            trigger: 'blur',
            validator: validatepwd
          }
        ],
        repassword: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          {
            required: true,
            trigger: 'blur',
            validator: validatepwds
          }]
      }
    }
  },
  methods: {
    regFN() {
      // 兜底校验
      console.log(this.$refs)
      this.$refs.regFrom.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post('/api/reg', this.regFrom)
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.$router.push('/login')
        // {username: "aa12315", password: "a.12345", repassword: "a.12345"}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;
.el-form {
  padding: 0 30px;
}
  .reg-box {
    width: 460px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }
  }
}
</style>
