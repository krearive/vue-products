<script setup>
import { ref, computed, onMounted } from "vue";
import ProductCard from "./components/ProductCard.vue";

const products = ref([])
const search = ref("")
const cart = ref([])

onMounted(async () => {
  const response = await fetch("https://fakestoreapi.com/products");
  products.value = await response.json();
})

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    return product.title.toLowerCase().includes(search.value.toLowerCase());
  });
})

function addToCart(product) {
  const existingProduct = cart.value.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
}
</script>

<template>
  <div class="border-2 font-inter">
    <header class="flex justify-between items-center p-4 border-b-2">
      <h1 class="text-xl font-bold">Vue Store</h1>
      <div class="bg-black text-white px-3 py-1 rounded hover:shadow-(--shadow-pink)">
        Cart: {{ cart.length }} {{ cart.length === 1 ? "item" : "items" }}
      </div>
    </header>

    <input type="text" placeholder="Search products..." v-model="search"
      class="border-b-2 p-2 mb-4 w-full focus:outline" />

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" @add-to-cart="addToCart" />
    </div>
  </div>
</template>