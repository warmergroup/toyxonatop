<script lang="ts" setup>
import { openState } from '~/stores/isOpen.store';
import { useUploadImage, useUploadAvatar } from '~/data';
import { useAvatarImage } from '~/composables/useAvatarImage'

const config = useRuntimeConfig()
const getAvatar = useAvatarImage(config)

const { formatPhone } = useFormat();
const openComponent = openState();
const { t } = useI18n();

const props = defineProps<{
  name: string;
  phone: string;
  status: string;
  role: string;
  avatar?: string;
  isLoading: boolean;
  onAvatarUpdated?: () => void
}>();

const isUploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const { mutateAsync: uploadImage, isPending: isImageUploading } = useUploadImage();
const { mutateAsync: uploadAvatar, isPending: isAvatarUploading } = useUploadAvatar();

const loading = computed(() => props.isLoading || isUploading.value || isImageUploading.value || isAvatarUploading.value);

// Role matnini olish
const roleText = computed(() => {
  switch (props.role) {
    case 'user':
      return t('profile.user');
    case 'admin':
      return t('profile.admin');
    case 'superadmin':
      return t('profile.superadmin');
    default:
      return t('profile.user');
  }
});
// Avatar URL ni tekshirish
const avatarUrl = computed(() => {
  return props.avatar === 'https://toyxonachi.uz/storage/images' ? '/avatar.jpg' : props.avatar;
});
const image = computed(() => getAvatar(props.avatar))

// Fayl tanlash oynasini ochish
function openFileDialog() {
  if (!loading.value && fileInput.value) {
    fileInput.value.value = ''; // eski faylni tozalash
    fileInput.value.click();
  }
}

// Fayl tanlanganda yuklash
async function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  isUploading.value = true;
  try {

    const uploadRes = await uploadImage(file);
    await uploadAvatar(uploadRes.image);
    if (props.onAvatarUpdated) {
      props.onAvatarUpdated();
    }
    useToast().add({ description: t('profile.avatarUpdated'), color: 'success' });
  } catch (err) {
    useToast().add({ description: t('error.title'), color: 'error' });
  } finally {
    isUploading.value = false;
  }
}
</script>

<template>
  <div class="flex items-center justify-between rounded-md bg-white p-4">
    <div class="flex items-center gap-4">
      <div class="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center rounded-full">
        <NuxtImg v-if="!loading" :src="image" loading="lazy" :alt="name"
          class="w-full h-full rounded-full aspect-square object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center">
          <span class="loader"></span>
        </div>
        <!-- Camera icon and file input -->
        <div @click="openFileDialog"
          class="absolute right-0 bottom-0 z-10 w-6 h-6 flex items-center justify-center overflow-hidden bg-gray-200 border border-gray-400 rounded-full cursor-pointer hover:bg-gray-300 transition">
          <div class="flex items-center p-1 justify-center w-full">
            <Icon name="custom:camera" class="w-4 object-cover" />
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange"
            :disabled="loading" />
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <h2 class="text-[17px] font-[590] capitalize">{{ name }}</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">+{{ formatPhone(phone) }}</p>
        <span class="bg-[var(--success-color)] py-1.5 px-3 rounded-full text-white text-sm">
          {{ t('profile.role') }} : {{ roleText }}
        </span>
      </div>
    </div>
    <div class="w-20 h-20 flex items-center justify-end cursor-pointer" @click="openComponent.onOpen('editProfile')">
      <Icon size="15px" name="custom:chevron-right" />
    </div>
  </div>
</template>

<style scoped>
.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #10b981;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>