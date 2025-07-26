import { defineStore } from 'pinia';

export type ImageType = {
  id?: number | string;
  image_url: string;
  isUploading?: boolean;
  isDeleting?: boolean;
};

export const useToyxonaFormStore = defineStore('toyxona', {
  state: () => ({
    images: [] as ImageType[],
    // boshqa...
  }),
  actions: {
    setImages(imgs: ImageType[]) {
      this.images = imgs;
    },
    addImage(img: ImageType) {
      this.images.push(img);
    },
    removeImage(idx: number) {
      this.images.splice(idx, 1);
    },
    cleareImage() {
      this.images = [];
    }
  }
});