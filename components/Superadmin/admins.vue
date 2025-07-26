<script setup lang="ts">
import { filteredAdminUsers } from "~/data";
import { useAvatarImage } from '~/composables/useAvatarImage'

const config = useRuntimeConfig()
const getAvatar = useAvatarImage(config)
const { formatPhone } = useFormat();
const { t } = useI18n()
const { data, isLoading, error, refetch } = filteredAdminUsers();

defineExpose({ refetch });
const search = ref('')
const items = [
  { label: t('users.all'), value: 'all' },
  { label: t('users.superadmin'), value: 'superadmin' },
  { label: t('users.admin'), value: 'admin' }
];
const selectedRole = ref('all');

const filteredUsers = computed(() => {
  if (!data.value) return []
  return data.value.filter(user => {
    const matchName = user.name.toLowerCase().includes(search.value.toLowerCase())
    const matchRole = selectedRole.value === 'all' || user.role === selectedRole.value
    return matchName && matchRole
  })
})
</script>

<template>
  <div>
    <div
      class="container mx-auto absolute top-10 left-0 right-0 flex items-center justify-center rounded-b-xl bg-white w-full min-h-16 px-5 py-3 z-40">
      <UInput v-model="search" :autofocus="false" class="w-full" size="xl" color="neutral" variant="soft"
        :placeholder="t('common.search')" icon="custom:navbar-search">
        <template #trailing>
          <USelect v-model="selectedRole" trailing-icon="custom:filter-icon" variant="soft" :items="items"
            option-attribute="value" :ui="{
              base: 'w-0',
              item: ' bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
              label: 'text-sm font-medium text-red-300',
              content: 'w-35',
            }" />
        </template>
      </UInput>
    </div>
    <div v-if="isLoading">{{ t('common.loading') }}</div>
    <div v-else-if="error">{{ t('error.title') }} {{ error.message }}</div>
    <ul v-else class="bg-white px-4 mt-8 mb-15">
      <template v-for="(user, index) in filteredUsers" :key="user.id">
        <USeparator v-if="index > 0" />
        <li class="flex w-full items-center justify-between py-2">
          <div class="flex items-center gap-4 lg:gap-5 ">
            <div class="w-16 h-16 flex items-center justify-center rounded-full">
              <NuxtImg :src="getAvatar(user.avatar)" loading="lazy"
                class="w-full rounded-full aspect-square object-cover" />
            </div>
            <div class="flex flex-col gap-1">
              <h2 class="text-base font-medium text-black capitalize">{{ user.name }}</h2>
              <p class="text-sm font-normal text-gray-600 dark:text-gray-400">+{{ formatPhone(user.phone) }}</p>
              <span class="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium"
                :class="user.role === 'superadmin' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'">
                {{ user.role === 'superadmin' ? `${t('profile.superadmin')}` : `${t('profile.admin')}` }}
              </span>
            </div>
          </div>
          <Icon name="i-heroicons-chevron-right" class="text-gray-400" />
        </li>
      </template>
    </ul>
    <div
      class="container mx-auto absolute bottom-0 left-0 right-0 flex items-center justify-center bg-white w-full min-h-16 border-t border-gray-300 px-5 py-3 z-30">
      <UButton class="w-full flex items-center justify-center" color="secondary" size="xl" icon="custom:plus"
        :label="t('profileActions.addAdmin')" @click="$emit('add-admin')" />
    </div>
  </div>
</template>