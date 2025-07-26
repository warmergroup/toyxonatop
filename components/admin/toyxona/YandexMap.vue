<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useLanguageStore } from '~/stores/language';

const languageStore = useLanguageStore();
const config = useRuntimeConfig();
const apiKey = config.public.yandexMapsApiKey;

const mapContainer = ref<HTMLElement>();
const currentAddress = ref<string>('');
const isLoading = ref<boolean>(true);

let yandexMap: any = null;
let updateTimeout: number | null = null;

function getYandexLangCode(lang: string): string {
  if (lang === 'ru') return 'ru_RU';
  if (lang === 'en') return 'en_US';
  if (lang === 'uz') return 'uz_UZ';
  return 'ru_RU';
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface Props {
  title?: string;
  addressPlaceholder?: string;
  initialLatitude?: number;
  initialLongitude?: number;
  zoom?: number;
}

declare global {
  interface Window {
    ymaps: {
      ready: (callback: () => void) => void;
      Map: new (element: HTMLElement, options: any) => any;
      Placemark: new (coordinates: [number, number], properties?: any, options?: any) => any;
      geocode: (query: string, options?: any) => Promise<any>;
      // add other methods if needed
    };
  }
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  addressPlaceholder: '',
  initialLatitude: 41.2995,
  initialLongitude: 69.2401,
  zoom: 15
});

const { t } = useI18n();

const title = computed(() => props.title || t('weddingHall.location'));
const addressPlaceholder = computed(() => props.addressPlaceholder || t('weddingHall.enterAddress'));

const emit = defineEmits<{
  (e: 'locationChange', location: LocationData): void;
}>();

async function loadYandexMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Window not available'));

    if (window.ymaps) return resolve();

    if (document.getElementById('ymaps-script')) {
      const interval = setInterval(() => {
        if (window.ymaps) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = 'ymaps-script';
    const langCode = getYandexLangCode(languageStore.getLang());
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=${langCode}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Yandex Maps API yuklanmadi'));
    document.head.appendChild(script);
  });
}

async function initializeMap(): Promise<void> {
  if (!mapContainer.value) return;

  try {
    await loadYandexMapsScript();
    await new Promise<void>((res) => window.ymaps.ready(res));

    yandexMap = new window.ymaps.Map(mapContainer.value, {
      center: [props.initialLatitude, props.initialLongitude],
      zoom: props.zoom,
      controls: ['zoomControl', 'typeSelector']
    });

    yandexMap.events.add('boundschange', handleMapMove);

    await updateAddress(props.initialLatitude, props.initialLongitude);
    isLoading.value = false;
  } catch (error) {
    console.error(error);
    currentAddress.value = 'Xarita yuklanmadi';
    isLoading.value = false;
  }
}

function handleMapMove(): void {
  if (updateTimeout) clearTimeout(updateTimeout);
  updateTimeout = window.setTimeout(async () => {
    if (yandexMap) {
      const center = yandexMap.getCenter();
      await updateAddress(center[0], center[1]);
    }
  }, 300);
}

async function updateAddress(latitude: number, longitude: number): Promise<void> {
  try {
    const result = await window.ymaps.geocode(`${latitude},${longitude}`, { kind: 'house', results: 1 });
    const geoObj = result.geoObjects.get(0);
    let address = geoObj?.getAddressLine?.() || geoObj?.get('text') || geoObj?.get('name') || geoObj?.get('description') || 'Manzil topilmadi';

    currentAddress.value = address;

    emit('locationChange', {
      latitude: +latitude.toFixed(6),
      longitude: +longitude.toFixed(6),
      address
    });
  } catch (error) {
    console.error(error);
    currentAddress.value = 'Manzil olishda xatolik';
  }
}

async function searchByAddress(address: string): Promise<void> {
  try {
    const result = await window.ymaps.geocode(address);
    const geoObj = result.geoObjects.get(0);

    if (geoObj) {
      const coords = geoObj.geometry.getCoordinates();
      const foundAddress = geoObj?.getAddressLine?.() || geoObj?.get('text') || geoObj?.get('name') || geoObj?.get('description') || address;

      yandexMap.setCenter(coords, props.zoom);
      currentAddress.value = foundAddress;

      emit('locationChange', {
        latitude: +coords[0].toFixed(6),
        longitude: +coords[1].toFixed(6),
        address: foundAddress
      });
    } else {
      currentAddress.value = 'Manzil topilmadi';
    }
  } catch (error) {
    console.error(error);
    currentAddress.value = 'Manzil topishda xatolik';
  }
}

onMounted(() => {
  setTimeout(() => initializeMap(), 500);
});

onUnmounted(() => {
  if (updateTimeout) clearTimeout(updateTimeout);
  if (yandexMap) yandexMap.destroy();
});
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <div class="bg-white rounded-2xl overflow-hidden">
      <div ref="mapContainer" class="relative w-full h-72 bg-gray-100 flex items-center justify-center">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div class="w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow relative">
            <div
              class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-green-500" />
          </div>
        </div>
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-100/90 z-20">
          <div class="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
        </div>
      </div>
      <div class="p-5 bg-white">
        <h2 class="text-2xl font-semibold text-gray-900 mb-5 text-left">{{ t('weddingHall.location') }}</h2>
        <UInput v-model="currentAddress" type="text" :placeholder="t('weddingHall.enterAddress')"
          class="w-full text-base font-normal text-gray-900 bg-gray-50 border border-gray-200 rounded-lg outline-none transition focus:border-green-500 focus:bg-white placeholder-gray-400"
          @keydown.enter.prevent="searchByAddress(currentAddress)" />
      </div>
    </div>
  </div>
</template>
