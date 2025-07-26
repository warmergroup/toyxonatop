<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';

const config = useRuntimeConfig();
const apiKey = config.public.yandexMapsApiKey;
const mapContainer = ref<HTMLElement | null>(null);
const error = ref<string | null>(null);
const isLoading = ref(true);
let yandexMap: any = null;
const languageStore = useLanguageStore();
const langCode = computed(() => getYandexLangCode(languageStore.getLang()));

const props = defineProps({
  center: {
    type: Object as () => { lat: number; lng: number },
    required: true,
  },
  title: {
    type: String,
    default: 'Toʻyxona joylashuvi',
  },
  zoom: {
    type: Number,
    default: 15,
  },
  height: {
    type: String,
    default: 'h-80',
  },
});

function getYandexLangCode(lang: string) {
  if (lang === 'ru') return 'ru_RU';
  if (lang === 'en') return 'en_US';
  if (lang === 'uz') return 'uz_UZ';
  return 'ru_RU'; // default
}

function loadYandexMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.ymaps) {
      resolve();
      return;
    }

    // Mavjud script tekshirish
    const existingScript = document.getElementById('ymaps-script');
    if (existingScript) {
      const check = setInterval(() => {
        if (window.ymaps) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = 'ymaps-script';
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=${langCode.value}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Yandex Maps API yuklanmadi'));
    document.head.appendChild(script);
  });
}

// Container elementining o'lchamlarini tekshirish
function isContainerReady(): boolean {
  if (!mapContainer.value) return false;

  const rect = mapContainer.value.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

// Xarita yaratish uchun kutish
function waitForContainer(): Promise<void> {
  return new Promise((resolve) => {
    if (isContainerReady()) {
      resolve();
      return;
    }

    const check = setInterval(() => {
      if (isContainerReady()) {
        clearInterval(check);
        resolve();
      }
    }, 50);

    // 5 soniyadan keyin timeout
    setTimeout(() => {
      clearInterval(check);
      resolve();
    }, 5000);
  });
}

const initializeMap = async () => {
  if (!mapContainer.value) {
    error.value = 'Xarita container topilmadi';
    isLoading.value = false;
    return;
  }

  try {
    await waitForContainer();
    await loadYandexMapsScript();
    await new Promise<void>((resolve) => {
      window.ymaps.ready(() => resolve());
    });

    if (!isContainerReady()) {
      throw new Error('Container o\'lchamlari aniqlanmadi');
    }

    yandexMap = new window.ymaps.Map(mapContainer.value, {
      center: [props.center.lat, props.center.lng],
      zoom: props.zoom,
      controls: ['zoomControl', 'typeSelector'],
      behaviors: ['drag', 'scrollZoom', 'dblClickZoom'],
    });

    const placemark = new window.ymaps.Placemark(
      [props.center.lat, props.center.lng],
      {
        hintContent: props.title,
        balloonContent: props.title,
      },
      {
        preset: 'islands#greenDotIcon',
        iconColor: '#22c55e',
      }
    );

    yandexMap.geoObjects.add(placemark);

    isLoading.value = false; // <-- BU YERDA
    yandexMap.events.add('load', () => {
      isLoading.value = false;
    });

  } catch (err) {
    console.error('Xarita ishga tushmadi:', err);
    error.value = 'Xarita yuklanmadi';
    isLoading.value = false;
  }
};

// Til o'zgarishida xaritani qayta yaratish
watch(langCode, () => {
  if (yandexMap) {
    yandexMap.destroy();
    yandexMap = null;
  }
  error.value = null;
  isLoading.value = true;
  nextTick(() => {
    initializeMap();
  });
});

onMounted(async () => {
  await nextTick();

  setTimeout(() => {
    initializeMap();
  }, 100);
});

onUnmounted(() => {
  if (yandexMap) {
    yandexMap.destroy();
    yandexMap = null;
  }
});
</script>

<template>
  <div class="w-full" :class="props.height">
    <div class="bg-white rounded-2xl overflow-hidden shadow-lg h-full">
      <div ref="mapContainer" class="relative w-full h-full bg-gray-100 flex items-center justify-center"
        role="application" aria-label="Xarita" :aria-describedby="`map-description-${props.title}`">
        <!-- Loading holati -->
        <div v-if="isLoading && !error" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10"
          role="status" aria-live="polite">
          <div class="flex flex-col items-center gap-2">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span class="text-sm text-gray-600">Xarita yuklanmoqda...</span>
          </div>
        </div>

        <!-- Xatolik holati -->
        <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10 text-red-600"
          role="alert" aria-live="assertive">
          <div class="flex flex-col items-center gap-2 text-center">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>{{ error }}</span>
            <button @click="initializeMap"
              class="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label="Xaritani qayta yuklash">
              Qayta urinish
            </button>
          </div>
        </div>

        <!-- Screen reader uchun tavsif -->
        <div :id="`map-description-${props.title}`" class="sr-only">
          {{ props.title }} joylashuvi xaritasi. Zoom va harakatlanish elementlari mavjud.
        </div>
      </div>
    </div>
  </div>
</template>
