<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUploadImage, useInfiniteToyxonalarQuery, useAddDiscount } from '~/data'

const config = useRuntimeConfig()
const imgUrl = config.public.imageUrl

const toast = useToast()
const { t } = useI18n()
const uploadImage = useUploadImage()
const addDiscount = useAddDiscount()
const uploading = ref(false)
const imageUrl = ref('')
const previewUrl = ref<string | null>(null)
const selectedToyxonaId = ref<number | null>(null)
const notes = ref('notes')
const isActive = ref(1)

// Form validation
const isFormValid = computed(() => {
    return imageUrl.value && selectedToyxonaId.value && !uploading.value && !addDiscount.isPending.value
})

// Form tozalash funksiyasi
function resetForm() {
    imageUrl.value = ''
    previewUrl.value = null
    selectedToyxonaId.value = null
    notes.value = 'notes'
    isActive.value = 1
}

const {
    data: toyxonalarData,
    isLoading: toyxonaLoading,
    fetchNextPage,
    isFetchingNextPage,
    error,
    refetch
} = useInfiniteToyxonalarQuery(20, 'admin');

function onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    // Local preview uchun
    previewUrl.value = URL.createObjectURL(file)
    uploading.value = true

    uploadImage.mutate(file, {
        onSuccess: (res) => {
            imageUrl.value = res.image
            uploading.value = false
            // Serverdan kelgan rasmga o‘tganda local blobni tozalash
            if (previewUrl.value) {
                URL.revokeObjectURL(previewUrl.value)
                previewUrl.value = null
            }
        },
        onError: () => {
            toast.add({
                description: t('discount.addError'),
                color: 'error'
            })
            uploading.value = false
        }
    })
}

const toyxonaOptions = computed(() => {
    return (toyxonalarData.value?.pages?.flat() || []).map((t: any) => ({
        label: t.name,
        value: t.id
    }))
})
const emit = defineEmits(['success'])
function handleSave() {
    if (!isFormValid.value) {
        toast.add({ description: t('discount.selectImageAndHallError'), color: 'error' })
        return
    }
    addDiscount.mutate({
        notes: notes.value,
        image_url: imageUrl.value,
        is_active: isActive.value,
        wedding_hall_id: Number(selectedToyxonaId.value)
    }, {
        onSuccess: () => {
            toast.add({
                description: t('discount.addedSuccesfull'),
                color: 'success'
            })
            // Form tozalash
            resetForm()
            // Parent componentga signal yuborish
            emit('success')
        },
        onError: (err: any) => {
            toast.add({
                title: t('error.title'),
                description: err.message,
                color: 'error'
            })
        }
    })
}

</script>

<template>
    <div class="flex flex-col items-center space-y-3 justify-center w-full">
        <!-- Rasm tanlash qismi -->
        <label v-if="!imageUrl" for="dropzone-file"
            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            :class="{ 'opacity-50 pointer-events-none': uploading }">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <!-- Yuklanish animatsiyasi -->
                <div v-if="uploading" class="mb-4">
                    <div class="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                    <span class="text-gray-500 mt-2 block">{{ t('common.loading') }}</span>
                </div>
                <!-- Normal ikonka -->
                <svg v-else class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input id="dropzone-file" type="file" class="hidden" @change="onFileChange" :disabled="uploading" />
        </label>

        <!-- Tanlangan rasm ko'rsatish -->
        <div v-else class="w-full aspect-video flex items-center justify-center relative">
            <NuxtImg v-if="imageUrl" :src="`${imgUrl}/${imageUrl}`" alt="Yuklangan rasm"
                class="object-contain h-full rounded-lg" />
            <img v-else-if="previewUrl" :src="previewUrl" alt="Preview" class="object-contain h-full rounded-lg" />
            <UiNoImage v-else />
            <!-- Rasm ustiga overlay -->
            <div v-if="uploading"
                class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div class="text-center">
                    <div class="w-8 h-8 border-4 border-white border-t-blue-500 rounded-full animate-spin mb-2"></div>
                    <span class="text-white text-sm">{{ t('common.loading') }}</span>
                </div>
            </div>
        </div>

        <!-- Toyxona tanlash -->
        <USelect v-model="selectedToyxonaId" :items="toyxonaOptions" placeholder="Select wedding hall..." class="w-full"
            size="lg" :disabled="uploading" />

        <!-- Saqlash tugmasi -->
        <div
            class="container mx-auto absolute bottom-0 left-0 right-0 flex items-center justify-center bg-white w-full min-h-16 border-t border-gray-300 px-5 py-3 z-30">
            <UButton class="w-full flex items-center justify-center" color="secondary" size="xl" icon="custom:plus"
                :loading="addDiscount.isPending.value" :disabled="!isFormValid" @click="handleSave"
                :label="t('common.save')" />
        </div>
    </div>
</template>