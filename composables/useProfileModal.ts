// composables/useProfileModals.ts
import { computed } from 'vue'
import type { IToyxonalar } from '~/interfaces'

import ProfileEdit from '~/components/profile/Edit.vue'
import ProfileAuth from '~/components/profile/Auth.vue'
import TheAbout from '~/components/TheAbout.vue'
import UiToyxonalarList from '~/components/ui/toyxonalarList/index.vue'
import UiDiscountList from '~/components/ui/discountList/index.vue'
import SuperadminAdmins from '~/components/Superadmin/admins.vue'
import SuperadminAddDiscount from '~/components/Superadmin/addDiscount.vue'
import AdminToyxonaCreate from '~/components/admin/toyxona/create.vue'
import AdminTarif from '~/components/admin/tarif/index.vue'
import MobileChangeLanguage from '~/components/mobile/ChangeLanguage.vue'

interface ProfileModalsParams {
  t: Function
  isLargeScreen: Ref<boolean>
  openComponent: any
  adminListRef: Ref<any>
  superadminListRef: Ref<any>
  showAddDiscount: Ref<boolean>
  discountListRef: Ref<any>
  showAddAdmins: Ref<boolean>
  handleToyxonaCreated: (args: { id: number, tariffs: { id: number, name: string }[] }) => void
  refreshToyxonalarList: () => void
  openToyxonaActionModal: (toyxona: IToyxonalar, tab: string) => void
  refetchMe: () => void
}

export function useProfileModals(params: ProfileModalsParams) {
  const {
    t, isLargeScreen, openComponent,
    adminListRef, superadminListRef,
    showAddDiscount, discountListRef,
    showAddAdmins,
    handleToyxonaCreated, refreshToyxonalarList,
    openToyxonaActionModal,
    refetchMe
  } = params

  const slideovers = [
    {
      key: 'editProfile',
      show: computed(() => isLargeScreen.value && openComponent.isOpen && openComponent.componentType === 'editProfile'),
      title: () => t('profileActions.editProfile'),
      component: ProfileEdit,
      props: { onProfileUpdated: refetchMe }
    },
    {
      key: 'auth',
      show: computed(() => openComponent.isOpen && openComponent.componentType === 'auth'),
      title: () => '',
      component: ProfileAuth,
      props: {}
    },
    {
      key: 'about',
      show: computed(() => openComponent.isOpen && openComponent.componentType === 'about'),
      title: () => t('about.aboutUs'),
      component: TheAbout,
      props: {}
    },
    {
      key: 'adminToyxonalar',
      show: computed(() => openComponent.isOpen && openComponent.componentType === 'adminToyxonalar'),
      title: () => t('admin.myWeddingHalls'),
      component: UiToyxonalarList,
      props: { ref: adminListRef, onAction: openToyxonaActionModal }
    },
    {
      key: 'allVenues',
      show: computed(() => openComponent.isOpen && openComponent.componentType === 'allVenues'),
      title: () => t('superadmin.allWeddingHalls'),
      component: UiToyxonalarList,
      props: { ref: superadminListRef, onAction: openToyxonaActionModal }
    },
    {
      key: 'discounts',
      show: computed(() => openComponent.isOpen && openComponent.componentType === 'discounts'),
      title: () => t('weddingHall.discounts'),
      component: UiDiscountList,
      props: { onAddDiscounts: () => showAddDiscount.value = true,ref: discountListRef }
    },
    {
      key: 'addDiscount',
      show: computed(() => showAddDiscount.value),
      title: () => t('profileActions.addDiscounts'),
      component: SuperadminAddDiscount,
      props: {
        onSuccess: () => {
          showAddDiscount.value = false
          // discounts slideoverini qayta ochish
          openComponent.onOpen('discounts')
          // discountListni yangilash
          discountListRef.value?.refetch?.()
        }
      }
    },
    {
      key: 'admins',
      show: computed(() => openComponent.isOpen && openComponent.componentType === 'admins'),
      title: () => t('profileActions.adminList'),
      component: SuperadminAdmins,
      props: { onAddAdmin: () => showAddAdmins.value = true }
    },
    {
      key: 'addToyxona',
      show: computed(() => openComponent.isOpen && openComponent.componentType === 'addToyxona'),
      title: () => t('admin.addWeddingHall'),
      component: AdminToyxonaCreate,
      props: { onCreated: handleToyxonaCreated }
    },
    {
      key: 'createTariff',
      show: computed(() => openComponent.isOpen && openComponent.componentType === 'createTariff'),
      title: () => 'Tariflar',
      component: AdminTarif,
      props: () => ({
        toyxonaId: openComponent.payload?.toyxonaId ?? null,
        tariffs: openComponent.payload?.tariffs || [],
        onCompleted: refreshToyxonalarList
      })
    }
  ]

  const drawers = [
    {
      key: 'changeLanguage',
      show: computed(() => !isLargeScreen.value && openComponent.isOpen && openComponent.componentType === 'changeLanguage'),
      title: () => t('common.changeLanguage'),
      component: MobileChangeLanguage,
      props: {}
    },
    {
      key: 'editProfile',
      show: computed(() => !isLargeScreen.value && openComponent.isOpen && openComponent.componentType === 'editProfile'),
      title: () => t('profileActions.editProfile'),
      component: ProfileEdit,
      props: {}
    }
  ]

  return { slideovers, drawers }
}