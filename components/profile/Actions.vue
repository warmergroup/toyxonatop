<script setup lang="ts">
import { openState } from '~/stores/isOpen.store';
import { PROFILE_ACTIONS } from '~/constants/profileActions';

const { isLargeScreen } = useScreenSize();
const { t } = useI18n();
const openComponent = openState();

type UserRole = 'user' | 'admin' | 'superadmin' | undefined;

const props = defineProps<{ user?: { role?: UserRole } }>();
// Computed property to filter and sort actions based on role and device type
const sortedActions = computed(() => {
    const filtered = PROFILE_ACTIONS.filter(action => {
        // Always-visible actions
        if (action.id === 'about') return true;
        if (action.id === 'changeLanguage') return !isLargeScreen.value;

        // Role-based actions
        return props.user?.role ? action.roles.includes(props.user.role) : false;
    });

    // 'about' har doim oxirida
    return filtered.sort((a, b) => {
        if (a.id === 'about') return 1;
        if (b.id === 'about') return -1;
        return 0;
    });
});
</script>

<template>
    <div class="flex flex-col rounded-xl bg-white p-0 overflow-hidden">
        <div v-for="(action, index) in sortedActions" :key="action.id"
            class="flex items-center justify-between cursor-pointer px-4 py-4" :class="[
                index === 0 ? 'rounded-t-xl' : '',
                index === sortedActions.length - 1 ? 'rounded-b-xl' : '',
                index !== sortedActions.length - 1 ? 'border-b border-slate-100' : ''
            ]" @click="openComponent.onOpen(action.component)">
            <div class="flex items-center gap-2">
                <span class="flex w-[40px] h-[40px] items-center justify-center rounded-full bg-slate-200/40">
                    <Icon class="text-[var(--primary-color)]" size="22px" :name="`custom:${action.icon}`" />
                </span>
                <p class="text-black text-base font-medium">{{ t(action.label) }}</p>
            </div>
            <Icon size="15px" name="custom:chevron-right" />
        </div>
    </div>
</template>