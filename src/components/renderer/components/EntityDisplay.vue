<template>
  <a-row :gutter="15">
    <a-col :span="labelWidth" v-if="label" class="dm-label">
      {{ label }}
    </a-col>
    <a-col :span="componentWidth" class="dm-component">
      <a-button @click="showModal = true" v-if="viewBusiness">{{
        entityDisplay
      }}</a-button>
      <span v-else>
        {{ entityDisplay }}
      </span>
    </a-col>
  </a-row>
  <a-modal
    :title="modelTitle"
    centered
    v-model:visible="showModal"
    :bodyStyle="{ padding: '0' }"
    :width="`calc(${viewBusiness.view.width}vw)`"
  >
    <template #footer>
      <a-button @click="showModal = false">关闭</a-button>
    </template>
    <component
      :is="'RE_VIEW'"
      v-if="showModal"
      :business="viewBusiness"
      :windows="true"
    />
  </a-modal>
</template>
<script>
import Component from "./Component";
import { mapGetters } from "vuex";
export default {
  extends: Component,
  data() {
    return {
      showModal: false,
      entityDisplay: this.displayValue,
    };
  },
  computed: {
    ...mapGetters(["loadBusiness", "loadType", "loadView"]),
    viewBusiness() {
      let business = this.loadBusiness(this.field.schema, "info");
      if (business == null) {
        return null;
      }
      let view = this.loadView(this.field.schema, business.viewName);
      return Object.assign({ params: { entityId: this.value }, view: view }, business);
    },
    modelTitle() {
      return this.loadType(this.field.schema).displayAs + " - " + this.entityDisplay;
    },
  },
};
</script>
