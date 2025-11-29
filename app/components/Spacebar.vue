<script setup lang="ts">
import { ref, watch } from 'vue';
import { motion } from 'motion-v';
import isMobileViewport from '~/utils/isMobileViewport';

const props = defineProps({
    items: {
        type: Array as () => string[],
        required: true
    },
    modelValue: {
        type: Number,
        default: 0
    },
    interval: {
        type: Number,
        default: 5000
    },
    // New prop to control animation state from parent
    isPlaying: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'pause', 'resume']);

const isMobile = isMobileViewport();
const timerKey = ref(0);

const goTo = (index: number) => {
    emit('update:modelValue', index);
};

const onPause = () => {
    emit('pause');
};

const onResume = () => {
    emit('resume');
};

// Reset animation when index changes or play state changes to true
watch(() => props.modelValue, () => {
    timerKey.value++;
});

watch(() => props.isPlaying, (newVal) => {
    if (newVal) {
        timerKey.value++;
    }
});
</script>

<template>
    <!-- Desktop View -->
    <div v-if="!isMobile" 
         class="absolute left-1/2 transform -translate-x-1/2 flex bg-[rgba(255,255,255,0.95)] flex items-center bottom-4 rounded-full overflow-hidden shadow-sm"
         @mouseenter="onPause"
         @mouseleave="onResume">
        <div v-for="(item, index) in items" 
             :key="index"
             class="flex p-2 px-4 cursor-pointer hover:bg-gray-50 transition-colors relative select-none"
             :class="{ 'pl-8': index === 0, 'pr-8': index === items.length - 1 }"
             @click="goTo(index)">
            <a class="whitespace-nowrap" :class="{ 'font-medium': modelValue === index, 'text-gray-500': modelValue !== index }">
                {{ item }}
            </a>
            <motion.div 
                 v-if="index <= modelValue" 
                 class="absolute left-0 bottom-0 h-0.5 bg-gray-500"
                 :initial="{ width: index < modelValue ? '100%' : '0%' }"
                 :animate="{ width: '100%' }"
                 :transition="index === modelValue && isPlaying 
                    ? { duration: interval / 1000, ease: 'linear' } 
                    : { type: 'spring', stiffness: 300, damping: 30 }"
                 :key="`${index}-${timerKey}`"
            />
        </div>
    </div>

    <!-- Mobile View (Dots) -->
    <div v-else 
         class="absolute left-1/2 transform -translate-x-1/2 flex gap-2 bottom-4 pointer-events-auto"
         @mouseenter="onPause"
         @mouseleave="onResume">
        <div v-for="(_, index) in items" 
             :key="index"
             class="w-2 h-2 rounded-full transition-colors duration-300 cursor-pointer"
             :class="modelValue === index ? 'bg-gray-500' : 'bg-stone-300'"
             @click="goTo(index)">
        </div>
    </div>
</template>

