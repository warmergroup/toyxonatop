<script setup lang="ts">
import { useCreateToyxona } from '~/data';
import { useToyxonaFormStore } from '~/stores/toyxonaForm.store';
import { useQueryClient } from '@tanstack/vue-query';

const coords = useLocationStore().coords;
const storeImages = useToyxonaFormStore();
const toast = useToast();
const queryClient = useQueryClient();
const emit = defineEmits(['created'])
interface Tariff {
    id: number;
    name: string;
}
interface CreatedEventPayload {
    id: number;
    tariffs: Tariff[];
}
const formState = reactive({
    name: '',
    description: '',
    tariff_count: null,
    phone1: '',
    phone2: '',
    telegram: '',
    instagram: '',
});

interface LocationData {
    latitude: number;
    longitude: number;
    address: string;
}
const selectedLocation = ref<LocationData | null>(null);

const handleLocationChange = (location: LocationData) => {
    selectedLocation.value = location;
};
function normalizePhone(phone: string): string {
    return '+998' + phone.replace(/\D/g, '');
}
const createToyxonaMutation = useCreateToyxona();
const handleSubmit = async () => {
    if (!selectedLocation.value) {
        toast.add({ title: 'Manzil tanlanmagan!', color: 'warning' });
        return;
    }
    const payload = {
        name: formState.name,
        description: formState.description,
        status: 'review', // Yangi yaratilgan toyxona review statusda bo'ladi
        tariff_count: Number(formState.tariff_count),
        phone1: normalizePhone(formState.phone1),
        phone2: normalizePhone(formState.phone2),
        telegram: formState.telegram,
        instagram: formState.instagram,
        latitude: String(selectedLocation.value.latitude),
        longitude: String(selectedLocation.value.longitude),
        address: selectedLocation.value.address,
        wedding_hall_pictures: storeImages.images
            .filter(img => !img.isUploading && img.image_url && !img.image_url.startsWith('blob:'))
            .map(img => ({
                image_url: img.image_url
            }))
    };

    try {
        const result = await createToyxonaMutation.mutateAsync(payload);
        toast.add({ title: 'Toyxona muvaffaqiyatli yaratildi!', color: 'success' });

        // Cache'ni invalidate qilish va listni yangilash - admin va superadmin uchun
        queryClient.invalidateQueries({ queryKey: ['venues-infinite', 'admin'] });

        emit('created', { id: result.id, tariffs: result.tariffs.map((t: Tariff) => ({ id: t.id, name: t.name })) } as CreatedEventPayload);
        // Reset form (ixtiyoriy)
    } catch (error: any) {
        toast.add({ title: error.message || 'Xatolik yuz berdi', color: 'warning' });
    }
    storeImages.cleareImage()
};
</script>

<template>
    <div class="flex flex-col gap-4">
        <UiImageUploader />
        <AdminToyxonaForm v-model="formState" />
        <AdminToyxonaYandexMap title="Manzil" address-placeholder="Manzil tanlang..."
            :initial-latitude="coords?.latitude" :initial-longitude="coords?.longitude" :zoom="16"
            @location-change="handleLocationChange" />
        <UButton class="w-full flex items-center justify-center" color="secondary" label="Saqlash"
            :loading="createToyxonaMutation.isPending.value" @click="handleSubmit" />
    </div>
</template>
