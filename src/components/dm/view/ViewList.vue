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
              setting(record);
            },
          };
        }
      "
    >
      <template #name="{ record }">
        <span v-if="record.display">{{ record.name }} 💥</span>
        <span v-else>{{ record.name }}</span>
      </template>
      <template #viewType="{ record }">
        <span>{{
          enumDisplay("com.novice.boot.datamodel.enums.ViewType", record.viewType)
        }}</span>
      </template>
      <template #system="{ record }">
        <span v-show="record.system">✔️</span>
      </template>
      <template #action="{ record }">
        <a-button-group>
          <a-button type="primary" size="small" @click="setting(record)">设置</a-button>
          <a-button size="small" @click="editForm(record)">编辑</a-button>
          <a-popconfirm title="确认删除该数据?" @confirm="remove(record)">
            <a-button type="danger" size="small">删除</a-button>
          </a-popconfirm>
        </a-button-group>
      </template>
    </a-table>
  </a-card>
  <a-modal
    :visible="showSettingModal"
    :title="`视图设置 ${form.name}`"
    centered
    width="70%"
    @ok="handleSetting"
    @cancel="showSettingModal = false"
  >
    <detail-view-config :view="form" v-if="form.viewType === 'DETAIL'" />
    <list-view-config :view="form" v-else-if="form.viewType === 'LIST'" />
  </a-modal>
  <a-modal
    :visible="showModal"
    centered
    :title="form.id ? '修改视图' : '创建视图'"
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
      <a-form-item label="类型" name="viewType">
        <a-select v-model:value="form.viewType" :disabled="!!form.id">
          <a-select-option
            :value="item.value"
            v-for="item in loadEnum('com.novice.boot.datamodel.enums.ViewType')"
            :key="item.value"
          >
            {{ item.display }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="form.name" :disabled="!!form.id" />
      </a-form-item>
      <a-form-item label="显示名" name="displayAs">
        <a-input v-model:value="form.displayAs" />
      </a-form-item>
      <a-form-item label="说明">
        <a-input v-model:value="form.description" />
      </a-form-item>
      <a-form-item label="窗口模式">
        <a-switch v-model:checked="form.windows" />
      </a-form-item>
      <a-form-item label="宽度占比">
        <a-slider v-model:value="form.width" :min="1" :max="90" />
      </a-form-item>
      <a-form-item label="系统">
        <a-switch v-model:checked="form.system" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import api from "../../../api/view";
import { message } from "ant-design-vue";
import { mapGetters } from "vuex";
import ListViewConfig from "./ListViewConfig";
import DetailViewConfig from "./DetailViewConfig";

const defaultForm = {
  id: undefined,
  name: "",
  displayAs: "",
  system: false,
  windows: false,
  viewType: "DETAIL",
  width: 70,
};
export default {
  components: {
    ListViewConfig,
    DetailViewConfig,
  },
  props: {
    typeId: String,
  },
  data() {
    return {
      data: [],
      loading: false,
      showModal: false,
      showSettingModal: false,
      form: { ...defaultForm },
      rules: {
        viewType: [{ required: true, message: "请输入视图类型", trigger: "blur" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        displayAs: [{ required: true, message: "请输入显示名", trigger: "blur" }],
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
          title: "类型",
          dataIndex: "viewType",
          slots: { customRender: "viewType" },
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
    ...mapGetters(["loadEnum", "enumDisplay"]),
  },
  methods: {
    list() {
      this.loading = true;
      api.list(this.typeId).then((res) => {
        this.data = res.data;
        this.loading = false;
      });
    },
    createForm() {
      this.showModal = true;
    },
    editForm(record) {
      this.form = { ...record };
      this.showModal = true;
    },
    setting(record) {
      this.form = JSON.parse(JSON.stringify(record));
      this.showSettingModal = true;
    },
    handleSetting() {
      let id = this.form.id;
      let data = { ...this.form };
      delete data.id;
      api.update(id, data).then((res) => {
        if (res.data.code == 1) {
          this.showSettingModal = false;
          this.list();
        } else {
          message.error(res.data.description);
        }
      });
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
            if ("DETAIL" === data.viewType) {
              f = api.createDetailView(data);
            } else {
              f = api.createListView(data);
            }
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
      this.form = { ...defaultForm };
    },
  },
  mounted() {
    this.list();
  },
};
</script>
