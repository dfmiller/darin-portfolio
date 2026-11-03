<template>
  <InfiniteScrollList url="https://jsonfakery.com/users/paginated" item-label="users">
    <template #default="{ item: user }">
      <div class="pa-4 d-flex flex-row align-center gap-4">
          <BaseAvatar
            :src="user.profile_pic"
            :alt="`Profile picture of ${user.first_name} ${user.last_name}`"
            size="96"
            class="mr-4"
          />
          <div>
          <h2 class="text-h6">{{ user.first_name }} {{ user.last_name }}</h2>
          <div class="text-body-2 text-medium-emphasis">{{ user.role }}</div>
          <div class="text-body-2">{{ user.email }}</div>
          <div class="text-body-2">{{ user.address.city }}</div>
          <div class="text-body-2 text-medium-emphasis">
            {{ user.address.street }}, {{ user.address.country }}
          </div>
        </div>
      </div>
    </template>
  </InfiniteScrollList>
</template>

<script lang="ts" setup>
import BaseAvatar from '@/components/Base/BaseAvatar.vue';
import InfiniteScrollList from '@/components/InfiniteScrollList.vue'
</script>
