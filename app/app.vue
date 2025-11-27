<script setup lang="ts">
import { motion } from "motion-v"
const route = useRoute();
const showSidebar = computed(() => {
    return route.path.startsWith('/projects');
});
</script>

<template>
    <div class="w-screen h-screen max-w-screen max-h-screen gap-4 p-3 flex flex-col">
        <Header />

        <div class="w-full h-full rounded-lg flex">
            <AnimatePresence>
                <motion.div :initial="{ width: 0 }" :animate="{ width: 208 }" :exit="{ width: 0 }" v-if="showSidebar">
                    <Sidebar />
                </motion.div>
            </AnimatePresence>
            <NuxtPage />
        </div>
    </div>
</template>
