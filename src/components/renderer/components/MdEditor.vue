<template>
  <a-row :gutter="15">
    <a-col :span="labelWidth" v-if="label" class="dm-label"
      ><span v-if="!allowBlank" style="color: red">*</span> {{ label }}</a-col
    >
    <a-col :span="componentWidth" class="dm-component">
      <v-md-editor
        v-model="value"
        height="400px"
        left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table horizontal | link customImage code"
        right-toolbar="preview fullscreen"
        :toolbar="toolbar"
        :disabled-menus="[]"
        :disabled="readOnly"
        @upload-image="handleUploadImage"
      />
    </a-col>
  </a-row>
</template>
<script>
import Component from "./Component";
import axios from "axios";
import { message } from "ant-design-vue";
import { image } from "@kangc/v-md-editor/lib/utils/constants/command";
import { filesFilter } from "@kangc/v-md-editor/lib/utils/file";
import fileApi from "../../../api/file";
export default {
  extends: Component,
  data() {
    return {
      toolbar: {
        customImage: {
          title: "插入图片",
          icon: "v-md-icon-img",
          action(editor) {
            editor.$nextTick(async () => {
              const event = await editor.$refs.uploadFile.upload();
              const files = filesFilter(event.target.files, editor.uploadImgConfig);
              if (editor.hasUploadImage && files.length) {
                event.preventDefault();
                editor.$emit(
                  "upload-image",
                  event,
                  function (imageRef) {
                    editor.execCommand(image, imageRef);
                  },
                  files
                );
              }
            });
          },
        },
      },
    };
  },
  methods: {
    getOperator() {
      return "CONTAINS";
    },
    handleUploadImage(event, insertImage, files) {
      let file = files[0];
      fileApi.maxsize().then((res) => {
        if (res.data.value > file.size) {
          let param = new FormData();
          param.append("file", file);
          let config = {
            headers: { "Content-Type": "multipart/form-data" },
          };
          axios.post(fileApi.uploadUrl(), param, config).then((res) => {
            if (res.data.code === 1) {
              insertImage({
                url: fileApi.generateViewUrl(res.data.result.fileId),
                desc: res.data.result.name,
                width: "300",
                height: "auto",
              });
            } else {
              message.error(res.data.description);
            }
          });
        } else {
          message.error("上传文件大小不能超过" + res.data.display);
        }
      });
    },
  },
};
</script>
