<template>
  <InfiniteScrollList
    url="https://dummyjson.com/products"
    item-label="products"
  >
    <template #default="{ item: product }">
      <div class="product-card">
        <div class="product-card__media">
          <v-img :src="product.thumbnail" :alt="product.title" aspect-ratio="1" />
        </div>

        <div class="product-card__body">
          <h2 class="text-h6">{{ product.title }}</h2>
          <div class="text-body-2 text-medium-emphasis text-capitalize">
            {{ metaFor(product) }}
          </div>

          <div class="product-card__price-row">
            <span class="text-h6">{{ currency.format(product.price) }}</span>
            <v-chip
              v-if="product.discountPercentage"
              size="small"
              color="success"
              variant="tonal"
            >
              {{ Math.round(product.discountPercentage) }}% off
            </v-chip>
            <span v-if="product.rating" class="product-card__rating">
              <v-rating
                :model-value="product.rating"
                color="amber"
                density="compact"
                size="small"
                half-increments
                readonly
              />
              <span class="text-body-2">
                {{ product.rating.toFixed(1) }}
                <template v-if="product.reviews?.length">
                  ({{ product.reviews.length }}
                  {{ product.reviews.length === 1 ? 'review' : 'reviews' }})
                </template>
              </span>
            </span>
          </div>

          <p class="text-body-2 mb-0">{{ product.description }}</p>

          <div v-if="product.tags?.length" class="product-card__tags">
            <v-chip v-for="tag in product.tags" :key="tag" size="small" variant="outlined">
              {{ tag }}
            </v-chip>
          </div>

          <dl class="product-card__details text-body-2">
            <template v-for="[label, value] in detailsFor(product)" :key="label">
              <dt class="text-medium-emphasis">{{ label }}</dt>
              <dd>{{ value }}</dd>
            </template>
          </dl>
        </div>
      </div>
    </template>
  </InfiniteScrollList>
</template>

<script setup>
import InfiniteScrollList from '@/components/InfiniteScrollList.vue'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function metaFor(product) {
  return [product.brand, product.category?.replace(/-/g, ' ')].filter(Boolean).join(' · ')
}

function detailsFor(product) {
  const { width, height, depth } = product.dimensions ?? {}
  return [
    ['Availability', product.availabilityStatus && `${product.availabilityStatus} (${product.stock} in stock)`],
    ['Shipping', product.shippingInformation],
    ['Warranty', product.warrantyInformation],
    ['Returns', product.returnPolicy],
    ['Min. order', product.minimumOrderQuantity],
    ['Weight', product.weight],
    ['Dimensions', width && `${width} × ${height} × ${depth}`],
    ['SKU', product.sku],
  ].filter(([, value]) => value)
}
</script>

<style scoped>
.product-card {
  display: grid;
  grid-template-columns: minmax(100px, 35%) 1fr;
  min-height: 300px;
}

.product-card__media {
  display: flex;
  align-items: center;
  background: rgba(var(--v-theme-on-surface), 0.06);
}

.product-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  padding: 0.75rem;
}

.product-card__price-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.75rem;
}

.product-card__rating {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.product-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.product-card__details {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.15rem 0.75rem;
  margin: 0;
}

.product-card__details dd {
  margin: 0;
}
</style>