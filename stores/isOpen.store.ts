import {defineStore} from "pinia";
import type {ComponentType, IToyxonalar} from "~/interfaces";

export const openState = defineStore("openDrawer", {
  state: () => ({
    isOpen: false,
    componentType: null as ComponentType | null,
    toyxonalar: [] as IToyxonalar[],
    payload: null as any // Yangi universal prop saqlash maydoni
  }),
  actions: {
    onOpen(type: ComponentType, payload: any = null) {
      this.componentType = type;
      this.isOpen = true;
      this.payload = payload;
    },
    onClose() {
      this.isOpen = false;
      this.componentType = null;
      this.payload = null; // Payloadni ham tozalaymiz
    },
  },
});