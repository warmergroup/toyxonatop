<script setup lang="ts">
import { DialogContent, DialogTitle } from 'reka-ui';

import { openState } from '~/stores/isOpen.store';
import type { ComponentType } from '~/interfaces';

const { isLargeScreen } = useScreenSize();
const open = openState();
const props = defineProps<{
  open: boolean;
  componentType: ComponentType;
  tarif: Record<string, any>;
}>();

const emit = defineEmits(['update:open', 'close']);

const isLocalOpen = computed({
  get: () => open.isOpen && open.componentType === props.componentType,
  set: (value) => open.isOpen = value
})

function closeDrawer() {
  emit('update:open', false);
  emit('close');
}

</script>

<template>
  <UDrawer :handle="false" :open="props.open" :direction="isLargeScreen ? 'right' : 'bottom'"
    :class="[isLargeScreen ? ' bg-[var(--background-color)]' : 'w-full bg-[var(--background-color)]']"
    :should-scale-background="!isLargeScreen" set-background-color-on-scale @close="closeDrawer">
    <template #body>

      <DialogTitle class="sr-only">{{ props.tarif?.name || 'VIP tarif' }}</DialogTitle>
      <DialogContent aria-describedby="tarif-description">
        <div id="tarif-description" class="flex flex-col gap-3 w-full h-full ">
          <div
            class="absolute top-0 left-0 right-0 w-full h-[50px] flex items-center justify-between p-3 bg-white border-b border-gray-200">
            <UButton color="neutral" variant="ghost" icon="custom:back" class="order-1" @click="closeDrawer" />
            <h2 class="text-highlighted font-semibold flex-1 text-center order-2">
              {{ props.tarif?.name || 'VIP tarif' }}</h2>
            <div></div> <!-- Bo'sh joy, title markazda bo'lishi uchun -->
          </div>

          <div v-if="props.tarif" class="mt-10 lg:mt-[52px] flex flex-col gap-4">
            <div class="bg-white rounded-xl p-4 flex flex-col gap-5">
              <h2 class="text-xl font-bold">{{ tarif?.name || 'VIP tarif ' }}</h2>
              <div class="flex items-center justify-between">
                <p class="">{{ props.tarif.people_count }} kishi</p>
                <span class="">{{ props.tarif.total_price }}</span>
              </div>
            </div>
            <UiTarifTabs :foods="props.tarif.foods" />
          </div>
          <div v-else>
            <span class="text-gray-400">Tarif ma'lumotlari topilmadi</span>
          </div>
        </div>
      </DialogContent>
    </template>
  </UDrawer>
</template>
