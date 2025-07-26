import { ref, onMounted, onUnmounted } from 'vue'

export function useScreenSize(breakpoint = 1024) {
  const isLargeScreen = ref(false)

  function checkScreen() {
    isLargeScreen.value = window.matchMedia(`(min-width: ${breakpoint}px)`).matches
  }

  onMounted(() => {
    checkScreen()
    window.addEventListener('resize', checkScreen)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', checkScreen)
  })

  return { isLargeScreen }
}