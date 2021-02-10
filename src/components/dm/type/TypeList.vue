<template>
  <a-card>
    <div class="table-operate">
      <a-space>
        <a-button type="primary" @click="showModal = true">添加</a-button>
        <a-button @click="refresh">刷新</a-button>
      </a-space>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      :loading="loading"
      :pagination="false"
      size="middle"
      rowKey="id"
      :customRow="
        (record) => {
          return {
            onDblclick: () => {
              setting(record);
            },
          };
        }
      "
    >
      <template #service="{ record }">
        {{ displayService(record.service) }}
      </template>
      <template #system="{ record }">
        <span v-show="record.system">✔️</span>
      </template>
      <template #action="{ record }">
        <a-button-group>
          <a-button type="primary" size="small" @click="setting(record)">设置</a-button>
          <a-button size="small" @click="editForm(record)">编辑</a-button>
          <a-popconfirm title="确认删除该数据?" @confirm="remove(record)">
            <a-button size="small" type="danger">删除</a-button>
          </a-popconfirm>
        </a-button-group>
      </template>
    </a-table>
  </a-card>
  <a-modal
    :visible="showModal"
    :title="form.id ? '修改类型' : '创建类型'"
    centered
    @ok="handleOk"
    @cancel="showModal = false"
    :afterClose="modalClose"
  >
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="名称" name="name">
        <a-input v-model:value="form.name" :disabled="!!form.id" />
      </a-form-item>
      <a-form-item label="显示名" name="displayAs">
        <a-input v-model:value="form.displayAs" />
      </a-form-item>
      <a-form-item label="从属" name="parentId">
        <a-select v-model:value="form.parentId" allowClear>
          <a-select-option
            :value="t.id"
            v-for="t in selectList"
            :title="t.displayAs"
            :key="t.id"
          >
            {{ t.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="服务类" name="service">
        <a-input v-model:value="form.service" />
      </a-form-item>
      <a-form-item label="说明">
        <a-input v-model:value="form.description" />
      </a-form-item>
      <a-form-item label="系统">
        <a-switch v-model:checked="form.system" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import api from "../../../api/type";
import { message } from "ant-design-vue";
import { mapActions } from "vuex";

export default {
  props: {
    moduleId: String,
  },
  data() {
    return {
      selectList: [],
      data: [],
      loading: false,
      showModal: false,
      form: {
        id: undefined,
        parentId: undefined,
        name: "",
        displayAs: "",
        service: "com.novice.boot.datamodel.action.ActionService",
        description: "",
        system: false,
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        displayAs: [{ required: true, message: "请输入显示名", trigger: "blur" }],
      },
      columns: [
        {
          title: "名称",
          dataIndex: "name",
        },
        {
          title: "显示名",
          dataIndex: "displayAs",
        },
        {
          title: "服务类",
          dataIndex: "service",
          slots: { customRender: "service" },
        },
        {
          title: "说明",
          dataIndex: "description",
        },
        {
          title: "系统",
          dataIndex: "system",
          slots: { customRender: "system" },
        },
        {
          title: "操作",
          key: "action",
          slots: { customRender: "action" },
        },
      ],
    };
  },
  methods: {
    ...mapActions(["pushAdminTab"]),
    refresh() {
      this.loading = true;
      api.superTree(this.moduleId).then((res) => {
        this.data = res.data;
        this.loading = false;
      });
      api.list(this.moduleId).then((res) => {
        this.selectList = res.data;
      });
    },
    setting(record) {
      let type = { ...record };
      delete type.children;
      this.pushAdminTab({
        key: "module-type-" + type.id,
        title: type.displayAs,
        type: "type-setting",
        currentType: type,
      });
    },
    editForm(record) {
      this.form = { ...record };
      this.showModal = true;
    },
    handleOk() {
      this.$refs.form
        .validate()
        .then(() => {
          let id = this.form.id;
          let data = { ...this.form };
          data.moduleId = this.moduleId;
          data.parentId = this.form.parentId || null;
          var f;
          if (id) {
            delete data.id;
            f = api.update(id, data);
          } else {
            f = api.create(data);
          }
          f.then((res) => {
            if (res.data.code == 1) {
              this.showModal = false;
              this.refresh();
            } else {
              message.error(res.data.description);
            }
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    remove(record) {
      api.remove(record.id).then((res) => {
        if (res.data.code == 1) {
          this.refresh();
        } else {
          message.error(res.data.description);
        }
      });
    },
    modalClose() {
      this.$refs["form"].resetFields();
      this.form = {
        id: undefined,
        parentId: undefined,
        name: "",
        displayAs: "",
        service: "com.novice.boot.datamodel.action.ActionService",
        description: "",
        system: false,
      };
    },
    displayService(service) {
      let arr = service.split(".");
      return arr[arr.length - 1];
    },
  },
  mounted() {
    this.refresh();
  },
};
</script>
