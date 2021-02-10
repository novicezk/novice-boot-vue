<template>
  <a-row type="flex" justify="end" style="margin-right: 10px">
    <a-dropdown>
      <a-space>
        <a-avatar
          :size="28"
          :src="fileApi.generateViewUrl(getCurrentUser().avatar, 0.2)"
          v-if="getCurrentUser().avatar"
        />
        <a-avatar :size="28" v-else>
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <a class="ant-dropdown-link" @click="(e) => e.preventDefault()"
          >{{ getCurrentUser().nickname }}
        </a>
      </a-space>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <UserOutlined />
            <span @click="userSetting"> 用户设置</span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item>
            <LogoutOutlined />
            <span @click="logout">退出登陆</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </a-row>
  <a-modal
    :visible="showUserModal"
    centered
    title="用户设置"
    @ok="handleOk"
    @cancel="showUserModal = false"
  >
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="form.username" disabled />
      </a-form-item>
      <a-form-item label="昵称" name="nickname">
        <a-input v-model:value="form.nickname" />
      </a-form-item>
      <a-form-item label="性别">
        <a-select v-model:value="form.gender">
          <a-select-option
            :value="item.value"
            v-for="item in loadEnum('com.novice.boot.usersystem.enums.Gender')"
            :key="item.value"
          >
            {{ item.display }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="手机号">
        <a-input v-model:value="form.mobile" />
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input v-model:value="form.email" />
      </a-form-item>
      <a-form-item label="头像">
        <a-upload
          :disabled="loading"
          name="file"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          :action="fileApi.uploadUrl()"
          :beforeUpload="beforeUpload"
          @change="handleAvatarChange"
        >
          <a-avatar
            v-if="form.avatar"
            :src="fileApi.generateViewUrl(form.avatar, 0.5)"
            shape="square"
            :size="100"
          />
          <div v-else>
            <loading-outlined v-if="loading" />
            <plus-outlined v-else />
          </div>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import {
  UserOutlined,
  LogoutOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons-vue";
import { mapGetters, mapActions } from "vuex";
import { message } from "ant-design-vue";
import api from "../api/user";
import fileApi from "../api/file";
export default {
  components: {
    UserOutlined,
    LogoutOutlined,
    PlusOutlined,
    LoadingOutlined,
  },
  data() {
    return {
      fileApi,
      form: {},
      showUserModal: false,
      loading: false,
      rules: {
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser", "loadEnum"]),
  },
  methods: {
    ...mapActions(["setCurrentUser"]),
    userSetting() {
      this.form = { ...this.getCurrentUser() };
      this.showUserModal = true;
    },
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        fileApi.maxsize().then((res) => {
          if (res.data.value > file.size) {
            resolve(file);
          } else {
            message.error("上传文件大小不能超过" + res.data.display);
            reject();
          }
        });
      });
    },
    handleAvatarChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
      } else if (info.file.status === "done") {
        let res = info.file.response;
        if (res.code === 1) {
          this.form.avatar = res.result.fileId;
        } else {
          message.error(res.description);
        }
        this.loading = false;
      }
    },
    handleOk() {
      let data = { ...this.form };
      api.updateCurrent(data).then((res) => {
        if (res.data.code === 1) {
          this.setCurrentUser(res.data.result);
          this.showUserModal = false;
        } else {
          message.error(res.data.description);
        }
      });
    },
    logout() {
      api.logout().then((res) => {
        if (res.data.code === 1) {
          this.setCurrentUser(null);
          location.href = "/#/login";
        } else {
          message.error(res.data.description);
        }
      });
    },
  },
};
</script>
