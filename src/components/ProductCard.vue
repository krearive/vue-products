<script setup>
defineProps(['product'])
</script>

<template>
  <div class="border rounded-lg p-4 hover:shadow-(--shadow-black) relative">
    <div class="flex flex-col justify-between h-full">
      <div>
        <img :src="product.image" :alt="product.title" class="h-40 w-full object-contain mb-2" loading="lazy" />
        <div class="flex flex-row justify-between items-start gap-2">
          <div class="flex flex-col justify-between">
            <h2 class="text-base font-semibold">{{ product.title }}</h2>
            <p class="text-gray-600 text-sm capitalize">{{ product.category }}</p>
          </div>
          <p class="text-white bg-pink-500 shadow-(--shadow-black) rounded-full px-2">${{ product.price }}</p>
        </div>
        <p class="text-black absolute top-2 bg-white border rounded-full px-2 text-sm shadow-(--shadow-black)">
          ⭐ {{ product.rating.rate }} ({{ product.rating.count }})
        </p>
      </div>

      <button @click="$emit('add-to-cart', product)"
        class="mt-2 text-base lg:text-sm bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 hover:shadow-(--shadow-pink) w-full">
        Add to Cart
      </button>
    </div>
  </div>
</template>
