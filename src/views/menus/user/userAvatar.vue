<!-- eslint-disable no-return-assign -->
<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <!-- v-if判断有没传入图片 -->
      <img v-if="avatar" :src="avatar" alt="" class="preview" />
      <img v-else src="../../../assets/images/avatar.jpg" alt="" class="preview" />

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" name="" id="" style="display:none" ref="inp" @change="fileChange">
        <el-button type="primary" icon="el-icon-plus" @click="$refs.inp.click()">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled='avatar=== ""' @click="updatafile" >上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'UserAvatar',
  data() {
    return {
      avatar: ''

    }
  },
  methods: {
    // 接口需要base64字符串形式
    fileChange(e) {
      console.dir(e.target.files[0])
      const file = e.target.files
      if (file.length > 0) {
        // 使用FileReader方法将文件转化为字符串
        const fr = new FileReader()
        fr.readAsDataURL(file[0])
        // eslint-disable-next-line no-return-assign
        fr.onload = e => this.avatar = e.target.result
      } else {
        this.avatar = ''
      }
    },
    // 上传头像
    async updatafile() {
      const { data: res } = await this.$axios.patch('/my/update/avatar', {
        avatar: this.avatar
      })
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 更新头像信息
      this.$store.dispatch('user/initUser')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
  width: 350px;
  height: 350px;
}
</style>
