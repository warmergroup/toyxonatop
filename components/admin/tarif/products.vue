<script setup lang="ts">
import { useCreateTariffProduct, useUploadImage, useDeleteTariffProduct, useGetTarifDetailQuery, useChangeToyxonaStatus } from '~/data'
import { useQueryClient } from '@tanstack/vue-query'
import type { Product, FormState, Section } from '~/interfaces'

const config = useRuntimeConfig()
const imageUrl = config.public.imageUrl

const props = defineProps<{
    tariffId: number | null,
    toyxonaId?: number | null, // Yangi prop qo'shamiz
    initialProducts?: Array<{
        id: number
        name: string
        description: string
        image_url: string
        type: string
        category_id?: string | number
    }>
}>()

const sections = reactive<Section[]>([
    { label: '1-taom', type: 'meals', category_id: 1, form: { name: '', description: '', image_url: '', imageUploading: false }, items: [] },
    { label: '2-taom', type: 'meals', category_id: 2, form: { name: '', description: '', image_url: '', imageUploading: false }, items: [] },
    { label: 'Salatlar', type: 'salads', category_id: 1, form: { name: '', description: '', image_url: '', imageUploading: false }, items: [] },
    { label: "To'y dasturxoni", type: 'wedding_table', category_id: 1, form: { name: '', description: '', image_url: '', imageUploading: false }, items: [] },
    { label: "Qo'shimcha noz ne'matlar", type: 'wedding_table', category_id: 2, form: { name: '', description: '', image_url: '', imageUploading: false }, items: [] },
    { label: 'Bonuslar', type: 'bonuses', category_id: 1, form: { name: '', description: '', image_url: '', imageUploading: false }, items: [] }
])

// Fetch existing products if tariffId is provided but no initialProducts
const { data: tariffDetail } = useGetTarifDetailQuery(
    props.tariffId && !props.initialProducts ? String(props.tariffId) : ''
)

// AVVALGI PRODUCTLARNI TO'G'RI TAQSIMLASH
watchEffect(() => {
    // Foydalanuvchi productlar yoki fetched productlar
    const productsToUse = props.initialProducts && props.initialProducts.length > 0
        ? props.initialProducts
        : (tariffDetail.value?.tariff_products || []);

    if (Array.isArray(productsToUse)) {
        // Har bir section uchun mahsulotlarni tozalash va qayta to'ldirish
        sections.forEach(section => {
            const sectionProducts = productsToUse.filter(product => {
                const prodCat = product.category_id !== undefined ? Number(product.category_id) : undefined;
                return section.type === product.type &&
                    (section.category_id === undefined || Number(section.category_id) === prodCat);
            });
            section.items = sectionProducts;
        });
    }
});

const uploadImage = useUploadImage()
const createProduct = useCreateTariffProduct()
const deleteProduct = useDeleteTariffProduct()
const changeStatus = useChangeToyxonaStatus()
const queryClient = useQueryClient()

function handleImageUpload(e: Event, form: FormState) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    form.imageUploading = true
    uploadImage.mutate(file, {
        onSuccess: (data: any) => {
            form.image_url = data?.image
            form.imageUploading = false
        },
        onError: () => {
            form.image_url = ''
            form.imageUploading = false
        }
    })
        ; (e.target as HTMLInputElement).value = ''
}

function addProduct(section: Section) {
    if (!props.tariffId || !section.form.name || !section.form.image_url || section.isCreating) return
    section.isCreating = true
    const payload: any = {
        tariff_id: props.tariffId,
        type: section.type,
        name: section.form.name,
        description: section.form.description,
        image_url: section.form.image_url
    }
    if (section.category_id) payload.category_id = Number(section.category_id)
    createProduct.mutate(payload, {
        onSuccess(data: Product[] | Product) {
            if (Array.isArray(data)) {
                // API dan qaytgan array'dan bizning section'ga mos keladiganini topamiz
                const newProducts = data.filter(
                    item =>
                        item.type === section.type &&
                        Number(item.category_id) === section.category_id
                )
                // Faqat yangi mahsulotlarni qo'shamiz (duplicat bo'lmasligi uchun)
                newProducts.forEach(newProduct => {
                    const existingProduct = section.items.find(item => item.id === newProduct.id)
                    if (!existingProduct) {
                        section.items.unshift(newProduct)
                    }
                })
            } else if (data) {
                // Yagona mahsulot qaytsa, uni qo'shamiz
                const existingProduct = section.items.find(item => item.id === data.id)
                if (!existingProduct) {
                    section.items.unshift(data)
                }
            }
            section.form.name = ''
            section.form.description = ''
            section.form.image_url = ''
            section.isCreating = false
            // Mahsulot qo'shilganda toyxona statusini review ga o'tkazish
            if (props.toyxonaId) {
                changeStatus.mutate({
                    wedding_hall_id: props.toyxonaId,
                    status: 'review'
                }, {
                    onSuccess: () => {
                        // Cache'ni invalidate qilish
                        queryClient.invalidateQueries({ queryKey: ['venues-infinite', 'admin'] });
                        queryClient.invalidateQueries({ queryKey: ['venues-infinite', 'superadmin'] });
                        queryClient.invalidateQueries({ queryKey: ['toyxona-by-id', props.toyxonaId] });
                    }
                })
            }
        },
        onError() {
            section.isCreating = false
        }
    })
}

function removeProduct(section: Section, id: number) {
    // Delete from database if product has an ID (exists in database)
    if (id) {
        deleteProduct.mutate(id, {
            onSuccess() {
                section.items = section.items.filter(i => i.id !== id)
                // Mahsulot o'chirilganda toyxona statusini review ga o'tkazish
                if (props.toyxonaId) {
                    changeStatus.mutate({
                        wedding_hall_id: props.toyxonaId,
                        status: 'review'
                    }, {
                        onSuccess: () => {
                            // Cache'ni invalidate qilish
                            queryClient.invalidateQueries({ queryKey: ['venues-infinite', 'admin'] });
                            queryClient.invalidateQueries({ queryKey: ['venues-infinite', 'superadmin'] });
                            queryClient.invalidateQueries({ queryKey: ['toyxona-by-id', props.toyxonaId] });
                        }
                    })
                }
            },
            onError(error: any) {
                alert(error.message || 'Xatolik yuz berdi')
            }
        })
    } else {
        // Remove from local state if not yet saved
        section.items = section.items.filter(i => i.id !== id)
    }
}

function removeImage(form: FormState) {
    form.image_url = ''
}

const tabs = [
    { label: 'Taomlar', keys: ['1-taom', '2-taom'] },
    { label: 'Salatlar', keys: ['Salatlar'] },
    { label: 'To\'y dasturxoni', keys: ["To'y dasturxoni", "Qo'shimcha noz ne'matlar"] },
    { label: 'Bonuslar', keys: ['Bonuslar'] }
]
const activeTab = ref(tabs[0].label)
function reset() {
    sections.forEach(section => {
        section.form.name = ''
        section.form.description = ''
        section.form.image_url = ''
        section.items = []
        if ('imageUploading' in section.form) section.form.imageUploading = false
        if ('isCreating' in section) section.isCreating = false
    })
}
defineExpose({ sections, reset })
</script>

<template>
    <div>
        <!-- Tabs: horizontal scroll, fixed height, no shrink -->
        <div class="flex gap-2  overflow-x-auto hide-scrollbar min-h-[44px]">
            <button v-for="tab in tabs" :key="tab.label" @click="activeTab = tab.label"
                class="px-4 py-2 rounded-xl font-medium whitespace-nowrap transition"
                :class="activeTab === tab.label ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'"
                style="flex-shrink: 0;">
                {{ tab.label }}
            </button>
        </div>

        <!-- Sectionlar -->
        <div v-for="section in sections.filter(s => tabs.find(t => t.label === activeTab)?.keys.includes(s.label))"
            :key="section.label" class="bg-white rounded-xl p-4 shadow mt-4">
            <div class="flex items-center justify-between mb-2 font-semibold">
                <span>{{ section.label }}</span>
                <button @click="addProduct(section)"
                    class="text-2xl px-2 py-1 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                    :disabled="section.isCreating">
                    <span v-if="section.isCreating">
                        <Icon name="i-heroicons-arrow-path-20-solid" class="animate-spin" size="20" />
                    </span>
                    <span v-else>+</span>
                </button>
            </div>
            <div class="flex flex-col gap-2">
                <UFormField class="w-full" label="nomi" name="name">
                    <UInput v-model="section.form.name" class="w-full" variant="soft" type="text" size="xl"
                        placeholder="Taom nomi" color="secondary" />
                </UFormField>
                <UFormField class="w-full" label="tavsifi" name="description">
                    <UInput v-model="section.form.description" class="w-full" variant="soft" type="text" size="xl"
                        placeholder="Taom tavsifi" color="secondary" />
                </UFormField>
                <div>
                    <label v-if="!section.form.image_url"
                        class="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer bg-gray-50 relative">
                        <span v-if="section.form.imageUploading">
                            <Icon name="i-heroicons-arrow-path-20-solid" class="animate-spin" size="32" />
                        </span>
                        <span v-else>
                            <Icon name="custom:plus-image" size="32" />
                        </span>
                        <input type="file" class="hidden" accept="image/*"
                            @change="e => handleImageUpload(e, section.form)"
                            :disabled="section.form.imageUploading || !!section.form.image_url" />
                    </label>
                    <div v-else class="relative w-24 h-24 rounded-lg overflow-hidden group">
                        <NuxtImg
                            :src="section.form.image_url.startsWith('http') ? section.form.image_url : `${imageUrl}/${section.form.image_url}`"
                            alt="preview" class="object-cover w-full h-full" />
                        <UButton class="absolute top-1 right-1 bg-black/40 rounded-full hover:bg-black/80"
                            variant="soft" color="neutral" icon="i-heroicons-x-mark"
                            @click="removeImage(section.form)" />
                    </div>
                </div>
            </div>

            <!-- Products list - View only -->
            <div v-for="item in section.items" :key="item.id" class="relative flex flex-col gap-2 mt-5">
                <div class="">
                    <div>
                        <span>nomi</span>
                        <div class="w-full p-2 bg-gray-50 rounded-lg">{{ item.name }}</div>
                    </div>
                    <div>
                        <span>tavsifi</span>
                        <div class="w-full p-2 bg-gray-50 rounded-lg">{{ item.description }}</div>
                    </div>
                </div>
                <NuxtImg v-if="item.image_url"
                    :src="item.image_url.startsWith('http') ? item.image_url : `${imageUrl}/${item.image_url}`"
                    class="w-24 h-24 object-cover rounded-lg" />
                <div v-if="item.image_url" class="text-xs text-gray-500 mt-1">

                </div>
                <button @click="removeProduct(section, item.id)" class="absolute right-0 top-0 text-red-500">
                    <Icon name="custom:trash-icon" />
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>