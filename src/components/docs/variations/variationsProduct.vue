<script setup>
import { ref } from "vue";
import { VariationVue } from "@thg-altitude/elements/vue";
import productMock from "./product.json";

const activeVariant = ref(
  productMock.product?.defaultVariant.sku
    ? productMock.product?.defaultVariant
    : productMock.product?.variants.find((variant) => variant.inStock) ||
        productMock.product?.variants?.[0]
);

function handleVariationUpdate(data) {
  activeVariant.value = productMock.product?.variants?.find(
    (variant) => variant.sku == data.sku
  );
}
</script>

<template>
  <div class="elements-reactive-demo">
    <h3>{{ activeVariant.title }}</h3>
    <div class="elements-reactive-data">
      <span><b>Sku:</b> {{ activeVariant.sku }}</span>
      <span><b>In Stock:</b> {{ activeVariant.inStock }}</span>
    </div>
  </div>
  <VariationVue
    :id="activeVariant.sku.toString()"
    mode="ssr"
    :options="{
      product: productMock.product,
      activeVariant: activeVariant.sku.toString(),
      layout: { button: ['Size', 'Colour'] },
    }"
    @variationUpdated="handleVariationUpdate"
    @linkedVariationUpdated="handleVariationUpdate"
  />
</template>
