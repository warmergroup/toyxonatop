<script lang="ts" setup>
import { storeToRefs } from 'pinia';

const auth = useAuthType();
const { authType } = storeToRefs(auth);

</script>

<template>
    <div>
        <AuthLogin v-if="authType === 'login'" />
        <AuthRegister v-if="authType === 'register'" />
    </div>
</template>