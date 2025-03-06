<script setup>
import { VariationVue } from "@thg-altitude/elements/vue";
import { ref, onMounted } from "vue";
import productMock from "./product.json";
const props = defineProps({
  sku: String,
});
const productData = ref(null);

productData.value = productMock;
</script>

<template>
  <VariationVue
    id="demo-vue"
    :options="{
      product: productData?.product,
      activeVariant: productData?.product?.defaultVariant?.sku,
      layout: {
        button: ['Size', 'Colour'],
      },
    }"
  >
  </VariationVue>
</template>
