<template>
  <a-card>
    <a-table
      :columns="columns"
      :data-source="data"
      :loading="loading"
      :pagination="false"
      size="middle"
      rowKey="name"
    >
      <template #mode="{ record }">
        <span>{{
          enumDisplay("com.novice.boot.datamodel.enums.Mode", record.mode)
        }}</span>
      </template>
    </a-table>
  </a-card>
</template>
<script>
import api from "../../api/action";
import { mapGetters } from "vuex";

export default {
  components: {},
  props: {
    typeId: String,
  },
  data() {
    return {
      data: [],
      loading: false,
      columns: [
        {
          title: "名称",
          dataIndex: "name",
        },
        {
          title: "模式",
          dataIndex: "mode",
          slots: { customRender: "mode" },
        },
        {
          title: "显示名",
          dataIndex: "displayAs",
        },
        {
          title: "描述",
          dataIndex: "description",
        },
        {
          title: "class",
          dataIndex: "serviceName",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["enumDisplay"]),
  },
  methods: {
    list() {
      this.loading = true;
      api.list(this.typeId).then((res) => {
        this.data = res.data;
        this.loading = false;
      });
    },
  },
  mounted() {
    this.list();
  },
};
</script>
