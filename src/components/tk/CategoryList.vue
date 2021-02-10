<template>
  <a-card>
    <div class="table-operate">
      <a-space>
        <a-button size="small" type="primary" @click="create(true)">添加根节点</a-button>
        <a-button
          size="small"
          type="primary"
          @click="create(false)"
          :disabled="!selectedId"
          >添加子节点</a-button
        >
        <a-button size="small" @click="update" :disabled="!selectedId">编辑</a-button>
        <a-popconfirm title="确认删除该数据?" @confirm="remove">
          <a-button size="small" type="danger" :disabled="!selectedId">删除</a-button>
        </a-popconfirm>
        <a-button size="small" @click="list">刷新</a-button>
      </a-space>
    </div>
    <div v-if="loading" style="text-align: center">
      <a-spin />
    </div>
    <a-tree
      v-if="!loading"
      showLine
      blockNode
      v-model:selectedKeys="selectedKeys"
      :tree-data="data"
      :replaceFields="{ children: 'children', title: 'displayAs', key: 'id' }"
    >
    </a-tree>
  </a-card>
  <a-modal
    width="60%"
    centered
    :visible="showModal"
    :title="!form.id ? '创建字典' : '修改字典'"
    @ok="createOrUpdateOperation"
    @cancel="showModal = false"
  >
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="ID" v-if="form.id">
        <a-input v-model:value="form.id" disabled />
      </a-form-item>
      <a-form-item label="类型" name="type">
        <a-select v-model:value="form.type">
          <a-select-option
            :value="item.value"
            v-for="item in loadEnum('com.novice.boot.toolkit.enums.CategoryType')"
            :key="item.value"
          >
            {{ item.display }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="form.name" placeholder="为空时id作为实际值" />
      </a-form-item>
      <a-form-item label="显示值" name="displayAs">
        <a-input v-model:value="form.displayAs" />
      </a-form-item>
      <a-form-item label="说明">
        <a-input v-model:value="form.description" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import api from "../../api/category";
import { message } from "ant-design-vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      data: [],
      loading: false,
      showModal: false,
      selectedKeys: [],
      form: {},
      rules: {
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        displayAs: [{ required: true, message: "请输入显示值", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters(["loadEnum"]),
    selectedId() {
      return this.selectedKeys ? this.selectedKeys[this.selectedKeys.length - 1] : null;
    },
  },
  methods: {
    list() {
      this.loading = true;
      this.selectedKeys = [];
      api.list().then((res) => {
        this.data = res.data;
        this.loading = false;
      });
    },
    create(isRoot) {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      let parentId = !isRoot ? this.selectedId : null;
      this.form = {
        parentId: parentId,
        type: parentId ? "ITEM" : "SET",
      };
      this.showModal = true;
    },
    update() {
      var category = api.view(this.selectedId);
      if (!category) {
        message.error("数据未找到");
      }
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      this.form = { ...category };
      this.showModal = true;
    },
    createOrUpdateOperation() {
      this.$refs.form
        .validate()
        .then(() => {
          let id = this.form.id;
          let parentId = this.form.parentId;
          let data = { ...this.form };
          delete data.parentId;
          delete data.children;
          var f;
          if (id) {
            delete data.id;
            f = api.update(id, data);
          } else {
            f = api.create(data, parentId);
          }
          f.then((res) => {
            if (res.data.code == 1) {
              this.showModal = false;
              this.list();
            } else {
              message.error(res.data.description);
            }
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    remove() {
      api.remove(this.selectedId).then((res) => {
        if (res.data.code == 1) {
          this.list();
        } else {
          message.error(res.data.description);
        }
      });
    },
  },
  mounted() {
    this.list();
  },
};
</script>
