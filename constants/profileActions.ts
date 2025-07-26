import type { IProfileAction } from '~/interfaces';

export const PROFILE_ACTIONS: IProfileAction[] = [  // Har qanday holatda ko'rinadigan actionlar
  {
    id: 'changeLanguage',
    label: 'common.appLanguage',
    icon: 'globe-02',
    component: 'changeLanguage',
    roles: [] // Bo'sh array - hamma ko'ra oladi
  },
  {
    id: 'about',
    label: 'about.aboutUs',
    icon: 'information',
    component: 'about',
    roles: [] // Bo'sh array - hamma ko'ra oladi
  },
  // Admin uchun maxsus actionlar
  {
    id: 'myVenues',
    label: 'admin.myWeddingHalls',
    icon: 'list',
    component: 'adminToyxonalar',
    roles: ['admin']
  },
  // Superadmin uchun maxsus actionlar
  {
    id: 'allVenues',
    label: 'profile.allWeddingHalls',
    icon: 'list',
    component: 'allVenues',
    roles: ['superadmin']
  },
  {
    id: 'admins',
    label: 'profileActions.adminList',
    icon: 'person',
    component: 'admins',
    roles: ['superadmin']
  },

  // ham superadmin, ham admin uchun ko'rinadigan actionlar
  {
    id: 'discounts',
    label: 'weddingHall.discounts',
    icon: 'discounts',
    component: 'discounts',
    roles: ['admin', 'superadmin']
  },
];
