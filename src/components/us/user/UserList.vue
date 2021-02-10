<template>
  <a-card>
    <div class="table-operate">
      <a-space>
        <a-button
          type="primary"
          @click="
            showModal = true;
            form = {};
          "
          >添加</a-button
        >
        <a-button @click="refresh">刷新</a-button>
      </a-space>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      :loading="loading"
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
      <template #gender="{ record }">
        {{ enumDisplay("com.novice.boot.usersystem.enums.Gender", record.gender) }}
      </template>
      <template #roles="{ record }">
        {{ rolesDisplay(record.roles) }}
      </template>
      <template #registerTime="{ record }">
        {{ new Date(record.registerTime).toLocaleString() }}
      </template>
      <template #action="{ record }">
        <a-button-group>
          <a-button type="primary" size="small" @click="editForm(record)">编辑</a-button>
          <a-popconfirm title="确认重置为默认密码?" @confirm="resetPassword(record)">
            <a-button size="small">重置密码</a-button>
          </a-popconfirm>
          <a-popconfirm title="确认删除该数据?" @confirm="remove(record)">
            <a-button size="small" type="danger">删除</a-button>
          </a-popconfirm>
        </a-button-group>
      </template>
    </a-table>
  </a-card>

  <a-modal
    :visible="showModal"
    centered
    :title="form.id ? '修改用户' : '创建用户'"
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
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="form.username" :disabled="!!form.id" />
      </a-form-item>
      <a-form-item label="昵称" name="nickname">
        <a-input v-model:value="form.nickname" />
      </a-form-item>
      <a-form-item label="初始密码" v-if="!form.id">
        <a-input v-model:value="form.initPassword" />
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
      <a-form-item label="角色">
        <a-select mode="multiple" v-model:value="form.roles" style="width: 100%">
          <a-select-option v-for="role in allRoles" :key="role.id">
            {{ role.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="手机号">
        <a-input v-model:value="form.mobile" />
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input v-model:value="form.email" />
      </a-form-item>
      <a-form-item label="到期时间">
        <a-date-picker v-model:value="form.expirationTime" />
      </a-form-item>
      <a-form-item label="禁用">
        <a-switch v-model:checked="form.disabled" />
      </a-form-item>
      <a-form-item label="锁定">
        <a-switch v-model:checked="form.locked" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import api from "../../../api/user";
import roleApi from "../../../api/role";
import { message } from "ant-design-vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      data: [],
      allRoles: [],
      loading: false,
      showModal: false,
      form: {},
      rules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
      },
      columns: [
        {
          title: "用户名",
          dataIndex: "username",
        },
        {
          title: "昵称",
          dataIndex: "nickname",
        },
        {
          title: "性别",
          dataIndex: "gender",
          slots: { customRender: "gender" },
        },
        {
          title: "角色",
          dataIndex: "roles",
          slots: { customRender: "roles" },
        },
        {
          title: "注册时间",
          dataIndex: "registerTime",
          slots: { customRender: "registerTime" },
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
    rolesDisplay(roles) {
      var display = "[";
      for (let i in roles) {
        let role = this.allRoles.find((r) => r.id === roles[i]);
        display += role ? role.name : "NotFound";
        if (i < roles.length - 1) {
          display += ",";
        }
      }
      return display + "]";
    },
    loadAllRoles() {
      roleApi.list().then((result) => {
        this.allRoles = result.data;
      });
    },
    refresh() {
      this.loading = true;
      api.search().then((res) => {
        this.data = res.data.content;
        this.loading = false;
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
    resetPassword(record) {
      api.resetPassword(record.id).then((res) => {
        if (res.data.code == 1) {
          message.success("用户[" + record.username + "]已重置为初始密码");
        } else {
          message.error(res.data.description);
        }
      });
    },
    modalClose() {
      this.$refs["form"].resetFields();
    },
  },
  mounted() {
    this.loadAllRoles();
    this.refresh();
  },
};
</script>
