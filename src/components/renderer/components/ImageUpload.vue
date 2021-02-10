<template>
  <a-row :gutter="15">
    <a-col :span="labelWidth" v-if="label" class="dm-label">
      <span v-if="!allowBlank" style="color: red">*</span>
      {{ label }}
    </a-col>
    <a-col :span="componentWidth" class="dm-component">
      <a-upload
        :disabled="loading"
        name="file"
        list-type="picture-card"
        class="avatar-uploader"
        :class="{ 'dm-verify-error': !verify }"
        :show-upload-list="false"
        :action="fileApi.uploadUrl()"
        :beforeUpload="beforeUpload"
        @change="handleChange"
      >
        <img
          v-if="value"
          :src="fileApi.generateViewUrl(value)"
          style="max-height: 150px"
        />
        <div v-else>
          <loading-outlined v-if="loading" />
          <plus-outlined v-else />
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
    </a-col>
  </a-row>
</template>
<script>
import Component from "./Component";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import fileApi from "../../../api/file";
export default {
  extends: Component,
  components: {
    PlusOutlined,
    LoadingOutlined,
  },
  data() {
    return {
      loading: false,
      fileApi,
    };
  },
  methods: {
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
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
      } else if (info.file.status === "done") {
        let res = info.file.response;
        if (res.code === 1) {
          this.value = res.result.fileId;
        } else {
          message.error(res.description);
        }
        this.loading = false;
        this.validate();
      }
    },
  },
};
</script>
<style lang="less">
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.dm-verify-error {
  .ant-upload-select-picture-card {
    border-color: #f56c6c !important;
  }
}
</style>
