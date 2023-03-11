<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <!-- 表单 -->
    <el-form :model="pwdForm" :rules="pwdFormRules" status-icon ref="pwdFormRef" label-width="100px">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">修改密码</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'UserPwd',
  data() {
    const validatepwd = (rule, value, callback) => {
      const reg1 = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*.])[\da-zA-Z~!@#$%^&*.]{6,}$/ // 密码必须是8位以上、必须含有字母、数字、特殊符号
      if (!reg1.test(value)) {
        callback(new Error('密码必须是6位以上、必须含有字母、数字、特殊符号'))
      } else {
        callback()
      }
    }

    const validatepwds = (rule, value, callback) => {
      if (value !== this.pwdForm.new_pwd) {
        console.log(value)
        console.log(this.paw)
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    return {
      // 表单的数据对象
      pwdForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      // 表单的验证规则对象
      pwdFormRules: {
        old_pwd: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            required: true,
            trigger: 'blur',
            validator: validatepwd
          }
        ],
        new_pwd: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            required: true,
            trigger: 'blur',
            validator: validatepwd
          }
        ],
        re_pwd: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          {
            required: true,
            trigger: 'blur',
            validator: validatepwds
          }]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}

</style>
