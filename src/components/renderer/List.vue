<template>
  <a-card
    class="renderer-pannel"
    :title="isPannel ? rendererTitle : null"
    :bordered="isPannel"
  >
    <a-row type="flex" justify="start" style="margin-bottom: 10px">
      <a-col
        v-for="field in conditionFields"
        :key="field.name"
        :span="8"
        style="margin-top: 10px"
      >
        <component
          :is="'DM_' + field.searcher"
          :label="field.displayAs"
          :name="field.name"
          :config="field.config"
          :field="loadField(business.typeId, field.name)"
          :readOnly="field.readOnly"
          :defaultValue="getConditionFieldValue(field.name)"
          :ref="`dm-${field.name}`"
        ></component>
      </a-col>
    </a-row>
    <a-row type="flex" justify="end" style="margin-bottom: 15px">
      <a-space>
        <a-button type="primary" @click="search">查询</a-button>
        <a-button @click="reset">重置</a-button>
      </a-space>
    </a-row>
    <div class="table-operate">
      <a-space>
        <a-button
          v-for="item in business.operations"
          :type="item.buttonType.toLowerCase()"
          :key="item.id"
          :disabled="!operationAvailable(item, entity)"
          @click="executeOperation(item)"
          >{{ item.name }}</a-button
        >
        <a-button @click="refresh">刷新</a-button>
      </a-space>
    </div>
    <a-table
      ref="entity-table"
      size="middle"
      :data-source="data"
      :loading="loading"
      rowKey="id"
      @change="onTableChange"
      :rowSelection="{
        type: 'radio',
        hideDefaultSelections: true,
        selectedRowKeys: entity ? [entity.id] : [],
        onChange: onSelectChange,
      }"
      :pagination="{
        current: pageNumber,
        pageSize: pageSize,
        total: total,
        showTotal: (total) => `共 ${total} 条`,
      }"
      :customRow="
        (record) => {
          return {
            onDblclick: () => rowDblclick(record),
            onClick: () => rowClick(record),
          };
        }
      "
    >
      <a-table-column
        v-for="item in rowFields"
        :key="item.name"
        :title="item.displayAs"
        :width="item.realWidth"
        :ellipsis="true"
        :sorter="item.sort"
        :sortOrder="
          sort && sort.sortBy === 'properties.' + item.name
            ? sort.asc
              ? 'ascend'
              : 'descend'
            : false
        "
      >
        <template #default="{ record }">
          {{ displayFieldValue(record, item.name) }}
        </template>
      </a-table-column>
    </a-table>
  </a-card>
</template>
<script>
import Renderer from "./Renderer";
export default {
  extends: Renderer,
  data() {
    return {
      data: [],
      total: 0,
      loading: false,
      sort: null,
      pagination: null,
      expressions: null,
      pageNumber: 1,
    };
  },
  computed: {
    conditionFields() {
      return this.business.view.conditionFields;
    },
    rowFields() {
      return this.business.view.rowFields;
    },
    responseFields() {
      return this.rowFields.map((field) => field.name);
    },
    pageSize() {
      return this.business.view.pageSize;
    },
    defaultSort() {
      return {
        sortBy: this.business.view.sortBy
          ? "properties." + this.business.view.sortBy
          : "dateModified",
        asc: this.business.view.asc,
      };
    },
    defaultPagination() {
      return {
        pageSize: this.pageSize,
        pageNumber: 1,
      };
    },
  },
  methods: {
    getConditionFieldValue(name) {
      if (this.expressions) {
        let ex = this.expressions.find((e) => e.field === name);
        if (ex && ex.value) {
          return ex.value + "";
        }
      }
      return null;
    },
    displayFieldValue(record, name) {
      return record.displays[name] || record.properties[name];
    },
    rendererInit() {
      this.sort = this.business.params.sort || this.defaultSort;
      this.pagination = this.business.params.pagination || this.defaultPagination;
      this.expressions = this.business.params.expressions;
    },
    refresh() {
      this.syncBusinessParams({
        name: this.business.standardName,
        params: {
          sort: this.sort,
          pagination: this.pagination,
          expressions: this.expressions,
        },
      });
      this.loading = true;
      let that = this;
      this.executeInitAction(
        {
          sort: this.sort,
          pagination: this.pagination,
          expressions: this.expressions,
          responseFields: this.responseFields,
        },
        (res) => {
          that.pageNumber = res.data.number + 1;
          that.data = res.data.content;
          that.total = res.data.totalElements;
          that.entity = null;
          that.loading = false;
        }
      );
    },
    search() {
      let condition = [];
      this.getFieldComponents().forEach((dm) => {
        if (dm.isNotNull()) {
          condition.push({
            field: dm.name,
            operator: dm.getOperator(),
            value: dm.value,
          });
        }
      });
      this.expressions = condition.length > 0 ? condition : null;
      this.refresh();
    },
    reset() {
      this.getFieldComponents().forEach((dm) => {
        dm.setValue(null);
      });
      if (this.expressions) {
        this.expressions = null;
        this.refresh();
      }
    },
    onTableChange(pagination, filters, sorter) {
      var changed = false;
      if (this.pageNumber !== pagination.current) {
        this.pageNumber = pagination.current;
        this.pagination =
          this.pageNumber === 1
            ? null
            : { pageSize: this.pageSize, pageNumber: this.pageNumber };
        changed = true;
      } else if (sorter && sorter.columnKey) {
        let sortBy = "properties." + sorter.columnKey;
        if (!sorter.order && this.sort) {
          this.sort = null;
          changed = true;
        } else {
          let asc = sorter.order === "ascend";
          changed = !this.sort || this.sort.sortBy !== sortBy || this.sort.asc !== asc;
          this.sort = { sortBy: sortBy, asc: asc };
        }
      }
      if (changed) {
        this.refresh();
      }
    },
    getOperationParams() {
      return this.entity ? { entityId: this.entity.id } : null;
    },
    rowClick(row) {
      this.entity = row;
    },
    rowDblclick(row) {
      this.entity = row;
      this.executeDefaultOperation();
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      if (selectedRows) {
        this.entity = selectedRows[0];
      } else {
        this.entity = null;
      }
    },
    adaptTableWidth() {
      let table = this.$refs["entity-table"];
      if (table) {
        let clientWidth = table.$el.clientWidth;
        this.rowFields.forEach((field) => {
          field.realWidth = (clientWidth * field.width) / 100;
        });
      }
    },
  },
  created() {
    let that = this;
    if (!this.business.view.windows) {
      window.onresize = () => that.adaptTableWidth();
    }
  },
  mounted() {
    this.adaptTableWidth();
  },
};
</script>
