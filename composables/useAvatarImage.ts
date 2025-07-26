// composables/useAvatarImage.ts
export function useAvatarImage(config: ReturnType<typeof useRuntimeConfig>) {
  const baseImgUrl = config.public?.imgUrl || 'https://api.toyxonachi.uz/storage/images'

  return (avatar?: string) => {
    if (
      !avatar ||
      avatar === baseImgUrl ||
      avatar === baseImgUrl + '/' ||
      avatar === 'https://toyxonachi.uz/storage/images' ||
      avatar === 'https://toyxonachi.uz/storage/images/'
    ) {
      return '/avatar.jpg'
    }
    if (!avatar.startsWith('http')) {
      return `${baseImgUrl}/${avatar}`
    }
    return avatar
  }
}
