<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { motion } from 'motion-v';
import { useCarousel } from '~/composables/useCarousel';

const props = defineProps({
    items: {
        type: Array as () => string[],
        required: true,
        default: () => []
    },
    autoScroll: {
        type: Boolean,
        default: false
    },
    interval: {
        type: Number,
        default: 5000
    }
});

// Initialize Shared Logic
const { 
    currentIndex, 
    isPaused, 
    next, 
    prev, 
    goTo,
    pauseTimer,
    resetTimer,
    registerInteraction
} = useCarousel({
    items: props.items,
    interval: props.interval,
    autoScroll: props.autoScroll
});

// Extended items for seamless looping: [Last, ...Items, First]
const extendedItems = computed(() => {
    if (!props.items.length) return [];
    const last = props.items[props.items.length - 1];
    const first = props.items[0];
    return [last, ...props.items, first];
});

// Start at 1 (the first real item)
const visualIndex = ref(1);
const motionX = ref('-100%');
const transition = ref<any>({
    type: 'spring',
    stiffness: 300,
    damping: 30
});

// Update visual position based on visualIndex
const updateMotion = () => {
    motionX.value = `${-visualIndex.value * 100}%`;
};

// Watch currentIndex from composable to drive visualIndex
watch(currentIndex, async (newVal, oldVal) => {
    const len = props.items.length;
    if (len <= 1) {
        visualIndex.value = 1;
        updateMotion();
        return;
    }

    // Fix: Ensure we are in the correct visual position before animating
    let snapped = false;
    if (oldVal === 0 && visualIndex.value === len + 1) {
        // Snap to Real First (1)
        transition.value = { duration: 0 };
        visualIndex.value = 1;
        updateMotion();
        await nextTick();
        snapped = true;
    }
    else if (oldVal === len - 1 && visualIndex.value === 0) {
        // Snap to Real Last (len)
        transition.value = { duration: 0 };
        visualIndex.value = len;
        updateMotion();
        await nextTick();
        snapped = true;
    }

    // Ensure spring is active
    transition.value = { type: 'spring', stiffness: 300, damping: 30 };

    // Detect wrap forward: N-1 -> 0
    if (oldVal === len - 1 && newVal === 0) {
        visualIndex.value = len + 1; // Move to Clone First
    }
    // Detect wrap backward: 0 -> N-1
    else if (oldVal === 0 && newVal === len - 1) {
        visualIndex.value = 0; // Move to Clone Last
    }
    // Normal move
    else {
        visualIndex.value = newVal + 1; // +1 because of left padding
    }
    
    updateMotion();
});

// Handle animation completion to snap if needed
const onMotionComplete = () => {
    const len = props.items.length;
    // If we are at Clone First (N+1), snap to Real First (1)
    if (visualIndex.value === len + 1) {
        snapTo(1);
    }
    // If we are at Clone Last (0), snap to Real Last (N)
    else if (visualIndex.value === 0) {
        snapTo(len);
    }
};

const snapTo = (index: number) => {
    // Disable animation for snap
    const originalTransition = transition.value;
    transition.value = { duration: 0 }; // Instant
    visualIndex.value = index;
    updateMotion();
    
    // Restore animation in next tick/frame
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            transition.value = originalTransition;
        });
    });
};

// Scroll & Touch Handling
let lastScrollTime = 0;
const SCROLL_COOLDOWN = 800; // ms

// Touch state
let touchStartX = 0;
let touchStartY = 0;

const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
};

const handleTouchEnd = (e: TouchEvent) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;
    
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;

    // Ignore if vertical scroll was dominant
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    // Threshold for swipe
    if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            next();
        } else {
            prev();
        }
        // Reset timer on interaction
        registerInteraction();
    }
};

const handleWheel = (e: WheelEvent) => {
    // Prevent browser navigation gestures on trackpad (horizontal swipe)
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
    }

    const now = Date.now();
    if (now - lastScrollTime < SCROLL_COOLDOWN) return;

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 20) return; // Threshold

    lastScrollTime = now;

    if (delta > 0) {
        // Next
        next();
    } else {
        // Prev
        prev();
    }
    
    // Reset timer on manual interaction
    registerInteraction();
};

</script>

<template>
    <div 
        class="w-full h-full rounded-lg relative overflow-hidden group"
        @wheel="handleWheel"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
    >
        <!-- Carousel Track -->
        <motion.div
            class="flex h-full w-full"
            :animate="{ x: motionX }"
            :transition="transition"
            :onAnimationComplete="onMotionComplete"
            @animationcomplete="onMotionComplete"
        >
            <div 
                v-for="(item, index) in extendedItems" 
                :key="`${index}-${item}`"
                class="min-w-full h-full"
            >
                <!-- 
                    We expose the item and its original index.
                    Calculate original index:
                    If index is 0 -> it's item N-1
                    If index is N+1 -> it's item 0
                    Else -> index - 1
                -->
                <slot 
                    :item="item" 
                    :index="index === 0 ? props.items.length - 1 : index === props.items.length + 1 ? 0 : index - 1" 
                />
            </div>
        </motion.div>

        <!-- Navigation -->
        <Spacebar 
            :model-value="currentIndex"
            @update:model-value="goTo"
            :items="props.items"
            :interval="props.interval"
            :is-playing="!isPaused"
            @pause="pauseTimer"
            @resume="resetTimer"
        />
    </div>
</template>

<style scoped>
/* Ensure Motion div behaves as a flex container if needed */
</style>
