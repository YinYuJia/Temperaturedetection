<template>
  <div class="login-background site-wrapper site-page--login">
<!--    <swiper :options="swiperOption" class="login-swiper">-->
<!--      <swiper-slide><img src="../../../static/img/login/login_image1.jpg" width="100%" height="100%"></swiper-slide>-->
<!--      <swiper-slide><img src="../../../static/img/login/login_image2.jpg" width="100%" height="100%"></swiper-slide>-->
<!--      <swiper-slide></swiper-slide>-->
<!--      -->
<!--    </swiper>-->
    <img src="../../../static/img/login/login_image4.png" width="100%" height="100%">
    <div class="site-content__wrapper">
      <div class="site-content">
          <div>
            <p class="top-title">四书后台管理系统</p>
            <p class="top-sutitle">Internal &nbsp;Business &nbsp;System</p>
          </div>
        <div class="login-main">
          <h1 class="login-title">用户登录</h1>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                    <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
            <!--<div class="tools">-->
              <!--<a class="czTool"  href="/upload_files/tools/czscV1.0.pdf" download="系统操作手册V1.0.pdf" target="_blank">操作手册下载</a>-->
              <!--<a class="ggTool"  href="/upload_files/tools/chromeX64_61.exe" download="谷歌浏览器(64位).exe" target="_blank">推荐使用谷歌浏览器(下载)</a>-->
            <!--</div>-->
            <!--<el-col :span="12">-->
              <!--<el-form-item>-->
                <!--<el-checkbox v-model="pasCheck">记住密码</el-checkbox>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <!--<el-col :span="12">-->
              <!--<el-form-item>-->
                <!--<el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
          </el-form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import { getUUID} from '@/utils'
  import base64 from 'base64-url'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import 'swiper/dist/css/swiper.css'
  import {getDay} from '@/utils/tools'

  export default {
    data () {
      return {
        swiperOption: {
          autoplay: {
            delay: 5000, // 自动切换的时间间隔，单位ms
            stopOnLastSlide: false, // 当切换到最后一个slide时停止自动切换
            disableOnInteraction: true, // 用户操作swiper之后，是否禁止autoplay。
            reverseDirection: true, // 开启反向自动轮播。
            waitForTransition: true, // 等待过渡完毕。自动切换会在slide过渡完毕后才开始计时。
          },
          speed: 1000,// 播放速度
          loop: true,// 循环
          autoplayStopOnLast: false,// 播放到最后一个自动停止
          effect: 'fade',// 轮播效果
          fadeEffect: {
            crossFade: true
          }
        },
        pasCheck:false,
        dataForm: {
          userName: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        dataRule: {
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          captcha: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        captchaPath: ''
      }
    },
    components: {
      swiper,
      swiperSlide
    },
    created () {
      this.getCaptcha()
    },
    mounted(){
      this.getCookie()
    },
    methods: {
      getCookie(){
        if (window.document.cookie.length > 0) {
          let arr_cookie = window.document.cookie.split('; ');
          for (let i = 0; i < arr_cookie.length; i++) {
            let idx_filed = arr_cookie[i].indexOf("=");
            let first_filed = arr_cookie[i].substr(0,idx_filed);
            if (first_filed == 'userName') {
              this.dataForm.userName = arr_cookie[i].substr(idx_filed+1,arr_cookie[i].length);
            } else if (first_filed == 'password') {
              this.dataForm.password = base64.decode(arr_cookie[i].substr(idx_filed+1,arr_cookie[i].length));
              this.pasCheck = true;
            }
          }
        }
      },
      setCookie(name, pwd, exdays) {
        var exdate = new Date();
        if(pwd != ''){
          pwd = base64.encode(pwd)
        }
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);
        window.document.cookie = "userName" + "=" + name + ";path=/;expires=" + exdate.toGMTString();
        window.document.cookie = "password" + "=" + pwd + ";path=/;expires=" + exdate.toGMTString();
      },
      clearCookie() {
        this.setCookie("", "", -1);
      },
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            //处理记住密码信息
            if (this.pasCheck == true) {
              this.setCookie(this.dataForm.userName, this.dataForm.password, 7);
            }else {
              this.clearCookie();
            }
              this.$http({
                url: this.$http.adornUrl('/emgy/sys/login'),
                method: 'post',
                data: this.$http.adornData({
                  'username': this.dataForm.userName,
                  'password': this.dataForm.password,
                  'uuid': this.dataForm.uuid,
                  'captcha': this.dataForm.captcha,
                  'realDay': getDay(),
                  'isMobile':this.$store.state.user.isMobile
                })
              }).then(({data}) => {
                console.log("---------登录成功---------",data)
                if (data && data.code === 0) {
                  this.$cookie.set('tunnel_token', data.tunnel_token)
                  sessionStorage.setItem("tunnel_token",data.tunnel_token)
                  this.$router.replace({ name: 'Agreement-AgreementManagement' })
                } else {
                  this.getCaptcha()
                  this.$message.error(data.msg)
                }
              })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      }
    }
  }
</script>

<style lang="scss">
  .login-swiper {
    z-index: 0;
    width: 100%;
    height: 100%;
  }
  .login-background{
    width: 100%;
    height: 100%;
    //background-image: url("../../../static/img/login.jpg");
    background-size: 100% 100%;
  }
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(38, 50, 56, .6);
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-size: cover;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
      //padding: 30px 500px 30px 30px;
    }
    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      .el-form{
        width: 65%;
        margin: 0px auto;
      }
      .el-input {
        display: inline-block;
        input {
          &::-webkit-input-placeholder {
            color: #f9fafb;
          }
          &:-moz-placeholder {
            color: #f9fafb;
          }
          &::-moz-placeholder {
            color: #f9fafb;
          }
          &:-ms-input-placeholder {
            color: #f9fafb;
          }
        }
      }
      .el-input__inner {
        color: #f9fafb;
        border: 1px solid rgba(0, 0, 0, 0.74);
        background-color: rgba(0, 0, 0, 0.74);
        height: 50px;
      }
      position: relative;
      top:30%;
      left:29%;
      height: 40%;
      width: 30%;
      //padding: 120px 60px 60px 60px;
      width: 40%;
    }
    .login-title {
      text-align: center;
      color: #eee;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
    }
  }
  .top-title{
    position: relative;
    top:50px;
    color: #eeeeee;
    font-size: 50px;
    font-weight: bold;
    text-align: center;
    letter-spacing: 20px;
  }
  .top-sutitle{
    position: relative;
    color: #eeeeee;
    font-size: 35px;
    text-align: center;
  }
  .tools{
    margin-top: -18px;
    text-align: center;
  }
  .czTool{
    color: #fff;
    width: 50%;
    margin: 0 5px 0 0px;
    cursor: pointer;
  }
  .ggTool{
    color:#fff;
    width:50%;
    margin: 0 5px 0 0;
    cursor: pointer;
  }
</style>
