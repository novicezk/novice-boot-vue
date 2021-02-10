<template>
  <a-card>
    <div class="table-operate">
      <a-space>
        <a-button type="primary" @click="createForm" size="small">添加</a-button>
        <a-button @click="list" size="small">刷新</a-button>
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
              editForm(record);
            },
          };
        }
      "
    >
      <template #name="{ record }">
        <span v-if="record.display">{{ record.name }} 💥</span>
        <span v-else>{{ record.name }}</span>
      </template>
      <template #dataType="{ record }">
        <span>{{ dataTypeDisplay(record.dataType) }}</span>
      </template>
      <template #system="{ record }">
        <span v-show="record.system">✔️</span>
      </template>
      <template #action="{ record }">
        <a-button-group>
          <a-button type="primary" size="small" @click="editForm(record)">编辑</a-button>
          <a-popconfirm title="确认删除该数据?" @confirm="remove(record)">
            <a-button type="danger" size="small">删除</a-button>
          </a-popconfirm>
        </a-button-group>
      </template>
    </a-table>
  </a-card>

  <a-modal
    :visible="showModal"
    :title="form.id ? '修改字段' : '创建字段'"
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
      <a-form-item label="数据类型" name="dataType">
        <a-select v-model:value="form.dataType" @change="changeDataType">
          <a-select-option :value="d.id" v-for="d in dataTypes" :key="d.id">
            {{ d.displayAs }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="控件" name="widget">
        <a-button
          type="primary"
          size="small"
          @click="
            widget = { ...form.widget };
            showWidget = true;
          "
          >设置</a-button
        >
      </a-form-item>
      <a-form-item label="schema">
        <a-input v-model:value="form.schema" />
      </a-form-item>
      <a-form-item label="格式">
        <a-input v-model:value="form.format" />
      </a-form-item>
      <a-form-item label="描述">
        <a-input v-model:value="form.description" />
      </a-form-item>
      <a-form-item label="默认值">
        <a-input v-model:value="form.defaultValue" />
      </a-form-item>
      <a-form-item label="wrapper">
        <a-input v-model:value="form.wrapper" />
      </a-form-item>
      <a-form-item label="主显示">
        <a-switch v-model:checked="form.display" />
      </a-form-item>
      <a-form-item label="系统">
        <a-switch v-model:checked="form.system" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    :visible="showWidget"
    centered
    title="控件属性"
    @cancel="showWidget = false"
    @ok="
      form.widget = widget;
      showWidget = false;
    "
  >
    <widget :widget="widget" :dataType="form.dataType" v-if="showWidget"></widget>
  </a-modal>
</template>
<script>
import api from "../../../api/field";
import { message } from "ant-design-vue";
import { mapGetters } from "vuex";
import Widget from "./Widget";

export default {
  props: {
    typeId: String,
  },
  components: { Widget },
  data() {
    return {
      data: [],
      loading: false,
      showModal: false,
      showWidget: false,
      form: {
        id: undefined,
        name: "",
        displayAs: "",
        system: false,
        display: false,
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        displayAs: [{ required: true, message: "请输入显示名", trigger: "blur" }],
        dataType: [{ required: true, message: "数据类型不能为空", trigger: "blur" }],
      },
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          slots: { customRender: "name" },
        },
        {
          title: "显示名",
          dataIndex: "displayAs",
        },
        {
          title: "数据类型",
          dataIndex: "dataType",
          slots: { customRender: "dataType" },
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
  computed: {
    ...mapGetters(["dataTypes", "loadDataType"]),
  },
  methods: {
    list() {
      this.loading = true;
      api.list(this.typeId).then((res) => {
        this.data = res.data;
        this.loading = false;
      });
    },
    dataTypeDisplay(dataTypeId) {
      let dataType = this.loadDataType(dataTypeId);
      return dataType ? dataType.displayAs : "";
    },
    changeDataType(dataTypeId) {
      let dataType = this.loadDataType(dataTypeId);
      this.form.widget = { ...dataType.widget };
    },
    createForm() {
      let d = this.loadDataType("String");
      this.form.dataType = d.id;
      this.form.widget = { ...d.widget };
      this.showModal = true;
    },
    editForm(record) {
      this.form = { ...record };
      this.showModal = true;
    },
    handleOk() {
      let that = this;
      this.$refs.form
        .validate()
        .then(() => {
          let id = this.form.id;
          let data = { ...this.form };
          data.typeId = that.typeId;
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
    remove(record) {
      api.remove(record.id).then((res) => {
        if (res.data.code == 1) {
          this.list();
        } else {
          message.error(res.data.description);
        }
      });
    },
    modalClose() {
      this.$refs["form"].resetFields();
      this.form = {
        id: undefined,
        name: "",
        displayAs: "",
        system: false,
        display: false,
      };
    },
  },
  mounted() {
    this.list();
  },
};
</script>
