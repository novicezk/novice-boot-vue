<template>
  <div class="login-container">
    <div class="top">
      <a-avatar :src="`${baseUrl}/favicon.ico`" :size="60" />
      <span class="title">Novice Boot</span>
    </div>
    <div class="desc">Novice Boot 后台管理系统的低代码开发框架</div>
    <div class="main">
      <a-form
        :model="form"
        :label-col="{ span: 0 }"
        :wrapper-col="{ span: 24 }"
        @submit="handleSubmit"
        @submit.prevent
      >
        <a-form-item>
          <a-input
            v-model:value="form.username"
            @blur="checkShouldShowCaptcha"
            size="large"
            placeholder="用户名"
          >
            <template #prefix>
              <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password v-model:value="form.password" size="large" placeholder="密码">
            <template #prefix>
              <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item style="text-align: left" v-if="showCaptch">
          <a-input v-model:value="form.code" style="width: 60%" size="large" placeholder="验证码">
            <template #prefix>
              <TagOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
          <a style="float: right; line-height: 37px" @click="refreshCaptcha">
            <a-image :preview="false" :src="captchaSrc" />
          </a>
        </a-form-item>
        <a-form-item style="text-align: left">
          <a-checkbox v-model:checked="form['remember-me']">自动登录</a-checkbox>
          <a style="float: right; line-height: 40px">忘记密码</a>
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="loggingIn"
            class="login-button"
            type="primary"
            html-type="submit"
            size="large"
          >登录</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="copyright">Copyright © 2020 novicezk</div>
  </div>
</template>
<script>
import api from "../api/user";
import { UserOutlined, LockOutlined, TagOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { mapActions } from "vuex";
const captchaSrc =
  process.env.BACKEND_URL + "/core.System/captcha?height=38&width=120";
export default {
  components: {
    UserOutlined,
    LockOutlined,
    TagOutlined
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      captchaSrc: null,
      showCaptch: false,
      loggingIn: false,
      form: {
        username: "",
        password: "",
        code: "",
        "remember-me": false
      }
    };
  },
  methods: {
    ...mapActions(["setCurrentUser"]),
    checkShouldShowCaptcha() {
      if (!this.form.username) {
        return;
      }
      api.shouldShowCaptcha(this.form.username).then(res => {
        if (res.data && !this.showCaptch) {
          this.refreshCaptcha();
          this.showCaptch = true;
        } else if (!res.data) {
          this.showCaptch = false;
        }
      });
    },
    refreshCaptcha() {
      this.captchaSrc = captchaSrc + "&v=" + new Date().getTime();
    },
    handleSubmit() {
      this.loggingIn = true;
      api.login({ ...this.form }).then(res => {
        this.loggingIn = false;
        if (res.data.code === 1) {
          let user = res.data.result;
          this.setCurrentUser(user);
          if (user.roles.indexOf("8b674539e0994d22b9353ee93e9f54fd") !== -1) {
            location.href = "/#/admin";
          } else {
            location.href = "/#/";
          }
        } else {
          message.error(res.data.description);
        }
        if (res.data.verificationCode) {
          this.refreshCaptcha();
          this.showCaptch = true;
        }
      });
    }
  }
};
</script>
<style lang="less">
.login-container {
  width: 100%;
  min-height: 100%;
  background: #f0f2f5 url(../assets/background.svg) no-repeat 50%;
  background-size: 100%;
  position: relative;
  padding: 150px 0;
  .top {
    line-height: 50px;
    .title {
      font-size: 33px;
      color: rgba(0, 0, 0, 0.85);
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      font-weight: 600;
      position: relative;
      top: 8px;
      margin-left: 10px;
    }
  }
  .desc {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    margin-top: 12px;
    margin-bottom: 40px;
  }
  .main {
    min-width: 260px;
    width: 368px;
    margin: 0 auto;
    .ant-form-item {
      margin-bottom: 18px !important;
    }
    .login-button {
      width: 100%;
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
