<template>
  <div class="login-container">
    <head-top :head-title="loginWay ? '登录' : '密码登录'" goBack="true">
    </head-top>
    <form class="loginForm">
      <section class="input_container">
        <input
          type="text"
          placeholder="手机号"
          name="phone"
          maxlength="11"
          v-model="phoneNumber"
        />
        <button
          @click.prevent="getVerifyCode"
          :class="{ right_phone_number: rightPhoneNumber }"
          v-show="!computedTime"
        >
          获取验证码
        </button>
        <button @click.prevent v-show="computedTime">
          已发送({{ computedTime }}s)
        </button>
      </section>
      <section class="input_container">
        <input
          type="text"
          placeholder="验证码"
          name="mobileCode"
          maxlength="6"
          v-model="mobileCode"
        />
      </section>
    </form>
    <p class="login_tips">
      温馨提示：未注册过的账号，登录时将自动注册注册过的用户可凭账号密码登录
      &lt;<a href="">用户服务协议</a>&gt;
    </p>
    <div class="login_container" @click="mobileLogin">登录</div>
    <alert-tip
      v-if="showAlert"
      :showHide="showAlert"
      @closeTip="closeTip"
      :alertText="alertText"
    ></alert-tip>
  </div>
</template>

<script>
import headTop from "@/components/header/head.vue";
import { mobileCode, checkExsis ,getcaptchas, accountLogin} from "@/service/getData.js";
import alertTip from "@/components/common/alertTip.vue";
export default {
  data() {
    return {
      loginWay: false, //登录方式，默认短信登录
      phoneNumber: "", //电话号码
      mobileCode: "", //短信验证码
      computedTime: 0, //倒数记时
      showAlert: false, //显示提示组件
    };
  },
  components: {
    headTop,
    alertTip,
  },
  computed: {
    //判断手机号码
    rightPhoneNumber: function() {
      return /^1\d{10}$/gi.test(this.phoneNumber);
    },
  },
  methods: {
    changeLoginWay() {
      this.loginWay = !this.loginWay;
    },
    //获取短信验证码
    async getVerifyCode() {
      if (this.rightPhoneNumber) {
        this.computedTime = 30;
        this.timer = setInterval(() => {
          this.computedTime--;
          if (this.computedTime == 0) {
            clearInterval(this.timer);
          }
        }, 1000);
        //判读用户是否存在
        let exsis = await checkExsis(this.phoneNumber, "mobile");
        if (exsis.message) {
          this.showAlert = true;
          this.alertText = exsis.message;
          return;
        } else if (!exsis.is_exists) {
          this.showAlert = true;
          this.alertText = "您输入的手机号尚未绑定";
          return;
        }
        //发送短信验证码
        let res = await mobileCode(this.phoneNumber);
        if (res.message) {
          this.showAlert = true;
          this.alertText = res.message;
          return;
        }
        this.validate_token = res.validate_token;
      }
    },
    //发送登录信息
     async mobileLogin() {
         this.$router.push('/home')
    // if (this.loginWay) {
    //   if (!this.rightPhoneNumber) {
    //     this.showAlert = true;
    //     this.alertText = "手机号码不正确";
    //     return;
    //   } else if (!/^\d{6}$/gi.test(this.mobileCode)) {
    //     this.showAlert = true;
    //     this.alertText = "短信验证码不正确";
    //     return;
    //   }
    //   //手机号登录
    //   this.userInfo = await sendLogin(
    //     this.mobileCode,
    //     this.phoneNumber,
    //     this.validate_token
    //   );
    // } else {
    //   if (!this.userAccount) {
    //     this.showAlert = true;
    //     this.alertText = "请输入手机号/邮箱/用户名";
    //     return;
    //   } else if (!this.passWord) {
    //     this.showAlert = true;
    //     this.alertText = "请输入密码";
    //     return;
    //   } else if (!this.codeNumber) {
    //     this.showAlert = true;
    //     this.alertText = "请输入验证码";
    //     return;
    //   }
    //   //用户名登录
    //   this.userInfo = await accountLogin(
    //     this.userAccount,
    //     this.passWord,
    //     this.codeNumber
    //   );
    // }
    // //如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
    // if (!this.userInfo.user_id) {
    //   this.showAlert = true;
    //   this.alertText = this.userInfo.message;
    //   if (!this.loginWay) this.getCaptchaCode();
    // } else {
    //   this.RECORD_USERINFO(this.userInfo);
    //   this.$router.go(-1);
    // }
  },
  closeTip() {
    this.showAlert = false;
  }
 }
};
</script>

<style lang="scss" scoped>
.login-container {
  padding-top: 1.95rem;
  p,
  span,
  input {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
  .loginForm {
    background-color: #fff;
    margin-top: 0.6rem;
    .input_container {
      display: flex;
      justify-content: space-between;
      padding: 0.6rem 0.8rem;
      border-bottom: 1px solid #f1f1f1;
      button {
        font-family: Helvetica Neue, Tahoma, Arial;
        padding: 0.28rem 0.4rem;
        border: 1px;
        border-radius: 0.15rem;
      }
      .right_phone_number {
        background-color: #4cd964;
      }
    }
  }
}
.login_tips {
  opacity: 0.5;
  font-size: 0.5rem;
  padding: 0.2rem 0.4rem;
  line-height: 0.8rem;
  a {
    color: #3b95e9;
  }
}
.login_container {
  margin: 0 0.5rem 1rem;
  font-size: 0.7rem;
  color: #fff;
  background-color: #4cd964;
  padding: 0.5rem 0;
  border: 1px;
  border-radius: 0.15rem;
  text-align: center;
}
</style>
