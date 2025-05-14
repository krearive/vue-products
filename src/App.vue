<script setup>
import { ref, computed, onMounted } from "vue";
import ProductCard from "./components/ProductCard.vue";
import { calculateDiscount } from "./utils/discount";

const products = ref([])
const search = ref("")
const cart = ref([])
const category = ref("all")

const totalAmount = ref(0)
const isMember = ref(false)
const promoCode = ref("")

onMounted(async () => {
  const response = await fetch("https://fakestoreapi.com/products");
  products.value = await response.json();
})

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesCategory = category.value === "all" || product.category.toLowerCase().includes(category.value.toLowerCase());
    const matchesTitle = product.title.toLowerCase().includes(search.value.toLowerCase());
    return matchesCategory && matchesTitle;
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

const discountResult = computed(() => {
  return calculateDiscount(
    totalAmount.value,
    isMember.value,
    promoCode.value
  );
});

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}
</script>

<template>
  <div class="border-2 font-inter" id="app">
    <!-- Header -->
    <header class="flex justify-between items-center p-4 border-b-2">
      <h1 class="text-xl font-bold">Vue Store</h1>
      <ul class="flex space-x-4 text-sm font-semibold">
        <li class="hover:underline">
          <a href="#app">Home</a>
        </li>
        <li class="hover:underline">
          <a href="#main-content">Product</a>
        </li>
      </ul>
      <div class="bg-black text-white px-3 py-1 rounded hover:shadow-(--shadow-pink)">
        Cart: {{ cart.length }} {{ cart.length === 1 ? "item" : "items" }}
      </div>
    </header>
    <!-- End Header -->

    <!-- Main Content with Sidebar -->
    <div class="flex flex-1 flex-col md:flex-row">
      <!-- Sidebar -->
      <aside class="bg-white border-r-2 border-b-2 p-4 md:1/4 hidden md:block">
        <h2 class="font-semibold mb-2">Categories</h2>
        <ul class="space-y-2 text-sm">
          <li :class="{ 'font-bold': category === 'all', 'text-pink-500': category === 'all' }">
            <a class="cursor-pointer" @click="category = 'all'">All Products</a>
          </li>
          <li :class="{ 'font-bold': category === 'electronics', 'text-pink-500': category === 'electronics' }">
            <a class="cursor-pointer" @click="category = 'electronics'">Electronics</a>
          </li>
          <li :class="{ 'font-bold': category === 'clothing', 'text-pink-500': category === 'clothing' }">
            <a class="cursor-pointer" @click="category = 'clothing'">Clothing</a>
          </li>
          <li :class="{ 'font-bold': category === 'jewelery', 'text-pink-500': category === 'jewelery' }">
            <a class="cursor-pointer" @click="category = 'jewelery'">Accessories</a>
          </li>
        </ul>
      </aside>
      <!-- End Sidebar -->

      <!-- Content -->
      <main class="flex-1 border-b-2" id="main-content">
        <input type="text" placeholder="Search products..." v-model="search"
          class="border-b-2 p-2 mb-4 w-full focus:outline" />

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product"
            @add-to-cart="addToCart" />
        </div>

        <!-- Discount -->
        <section class="mt-4 border-t-2">
          <div class="flex flex-col lg:flex-row justify-between">
            <div class="flex-7/12 p-4">
              <h2 class="text-lg font-semibold mb-2">Discount Simulation</h2>

              <div class="space-y-2">
                <label for="totalAmount" class="text-sm">Total Amount</label>
                <input type="number" v-model.number="totalAmount" placeholder="Enter total amount"
                  class="border-b-2 p-2 w-full focus:outline focus:shadow-(--shadow-black)" />
              </div>

              <label for="isMember" class="flex flex-col items-start mt-4">
                <div class="flex items-center">
                  <span class="text-sm">Are you a member?</span>
                  <span class="text-sm text-gray-500 ml-2">(Check to apply member discount)</span>
                </div>
                <div class="flex items-center pl-2">
                  <input type="checkbox" v-model="isMember" id="isMember"
                    class="mr-2 checked:shadow-(--shadow-black)" />
                  <span>Yes, I'm a member</span>
                </div>
              </label>

              <div class="space-y-2 mt-4">
                <label for="promoCode" class="text-sm">Promo Code (Optional)</label>
                <input type="text" v-model="promoCode" placeholder="Enter promo code (optional)"
                  class="border-b-2 p-2 w-full focus:outline focus:shadow-(--shadow-black)" />
              </div>
            </div>

            <div class="flex-1 lg:ml-2 lg:border-l p-4">
              <div v-if="discountResult" class="">
                <h3 class="text-lg font-semibold">Discount Result</h3>
                <p class="text-sm">Total Amount: {{ formatCurrency(totalAmount) }}</p>
                <p class="text-sm">Member Discount: {{ isMember ? "Yes" : "No" }}</p>
                <p class="text-sm">Promo Code: {{ promoCode || "None" }}</p>
                <p class="text-sm">Discount Percent: {{ discountResult.discount }}%</p>
                <hr class="my-2" />
                <p class="text-sm">Final Amount: {{ formatCurrency(discountResult.finalTotal) }}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <!-- End Content -->

    </div>
    <!-- End Main Content with Sidebar -->

    <!-- Footer -->
    <footer class="bg-white text-center p-4">
      <p class="text-sm">&copy; 2025 Vue Store. All rights reserved.</p>
      <p class="text-sm">Made with ❤️ by Arif Nur Rochman</p>
      <p class="text-sm">
        Follow us on <a href="https://instagram.com" class="text-pink-500 hover:text-pink-600">Instagram</a> and <a
          href="https://github.com" class="text-pink-500 hover:text-pink-600">GitHub</a>
      </p>
    </footer>
  </div>
</template>