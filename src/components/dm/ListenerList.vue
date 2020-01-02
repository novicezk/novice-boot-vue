<template>
  <a-card>
    <div class="table-operate">
      <a-space>
        <a-button type="primary" @click="showModal = true">添加</a-button>
        <a-button @click="list">刷新</a-button>
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
      <template #typeId="{ record }">
        {{ typeDisplay(record.typeId) }}
      </template>
      <template #system="{ record }">
        <span v-show="record.system">✔️</span>
      </template>
      <template #enabled="{ record }">
        <span v-show="record.enabled">✔️</span>
      </template>
      <template #action="{ record }">
        <a-button-group>
          <a-button type="primary" size="small" @click="editForm(record)">编辑</a-button>
          <a-popconfirm title="确认删除该数据?" @confirm="remove(record)">
            <a-button size="small" type="danger">删除</a-button>
          </a-popconfirm>
        </a-button-group>
      </template>
    </a-table>
  </a-card>

  <a-modal
    :visible="showModal"
    :title="form.id ? '修改侦听器' : '创建侦听器'"
    @ok="handleOk"
    centered
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
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item label="执行类" name="className">
        <a-input v-model:value="form.className" />
      </a-form-item>
      <a-form-item label="类型">
        <a-cascader
          :fieldNames="{ label: 'label', value: 'id', children: 'children' }"
          v-model:value="form.selectTypeId"
          :options="typeOpts"
          expand-trigger="hover"
        />
      </a-form-item>
      <a-form-item label="事件">
        <a-select
          mode="multiple"
          v-model:value="form.events"
          placeholder="请选择"
          style="width: 100%"
        >
          <a-select-option v-for="item in allEvents" :key="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="说明">
        <a-input v-model:value="form.description" />
      </a-form-item>
      <a-form-item label="启用">
        <a-switch v-model:checked="form.enabled" />
      </a-form-item>
      <a-form-item label="系统">
        <a-switch v-model:checked="form.system" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import api from "../../api/listener";
import utils from "../../util/tree-data-utils";
import { message } from "ant-design-vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      data: [],
      loading: false,
      showModal: false,
      form: {
        enabled: true,
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        className: [{ required: true, message: "请输入执行类", trigger: "blur" }],
      },
      allEvents: [
        { value: "beforecreateentity", label: "创建之前" },
        { value: "aftercreateentity", label: "创建之后" },
        { value: "beforeupdateentity", label: "修改之前" },
        { value: "afterupdateentity", label: "修改之后" },
        { value: "beforetrashentity", label: "删除之前" },
        { value: "aftertrashentity", label: "删除之后" },
      ],
      columns: [
        {
          title: "名称",
          dataIndex: "name",
        },
        {
          title: "执行类",
          dataIndex: "className",
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
          title: "启用",
          dataIndex: "enabled",
          slots: { customRender: "enabled" },
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
    ...mapGetters(["loadType", "modules"]),
    typeOpts() {
      let options = [];
      this.modules.forEach((m) => {
        let option = {
          id: m.id,
          label: `${m.displayAs}(${m.name})`,
          children: [],
        };
        m.types.forEach((type) => {
          let typeOpt = {
            id: type.id,
            label: `${type.displayAs}(${type.name})`,
          };
          option.children.push(typeOpt);
        });
        options.push(option);
      });
      return options;
    },
  },
  methods: {
    typeDisplay(typeId) {
      if (!typeId) return "";
      let type = this.loadType(typeId);
      return type ? type.displayAs : "";
    },
    list() {
      this.loading = true;
      api.list().then((res) => {
        this.data = res.data;
        this.loading = false;
      });
    },
    editForm(record) {
      record.selectTypeId = utils.findTreePathByArray(record.typeId, this.typeOpts);
      this.form = { ...record };
      this.showModal = true;
    },
    handleOk() {
      this.$refs.form
        .validate()
        .then(() => {
          let id = this.form.id;
          let data = { ...this.form };
          data.typeId = utils.findLastByArray(data.selectTypeId);
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
        enabled: true,
      };
    },
  },
  mounted() {
    this.list();
  },
};
</script>
