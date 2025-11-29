import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

interface UseCarouselOptions {
    items: any[];
    interval?: number;
    autoScroll?: boolean;
}

export function useCarousel(options: UseCarouselOptions) {
    const currentIndex = ref(0);
    const isPaused = ref(!options.autoScroll);
    const items = ref(options.items);
    const intervalDuration = options.interval || 5000;
    
    let timer: ReturnType<typeof setInterval> | null = null;

    // Navigation
    const next = (wrap = true) => {
        const len = items.value.length;
        if (!len) return;
        if (wrap) {
            currentIndex.value = (currentIndex.value + 1) % len;
        } else {
            if (currentIndex.value < len - 1) currentIndex.value++;
        }
    };

    const prev = (wrap = true) => {
        const len = items.value.length;
        if (!len) return;
        if (wrap) {
            currentIndex.value = (currentIndex.value - 1 + len) % len;
        } else {
            if (currentIndex.value > 0) currentIndex.value--;
        }
    };

    const goTo = (index: number) => {
        if (index >= 0 && index < items.value.length) {
            currentIndex.value = index;
        }
    };

    // Timer Logic
    const startTimer = () => {
        if (!options.autoScroll) return;
        if (timer) clearInterval(timer);
        
        isPaused.value = false;
        timer = setInterval(() => {
            next();
        }, intervalDuration);
    };

    const pauseTimer = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        isPaused.value = true;
    };

    const resetTimer = () => {
        pauseTimer();
        startTimer();
    };

    // Interaction Handling
    // Only reset if autoScroll is enabled
    const registerInteraction = () => {
        if (options.autoScroll) {
            resetTimer();
        }
    };

    // Lifecycle
    onMounted(() => {
        if (options.autoScroll) {
            startTimer();
        }
    });

    onBeforeUnmount(() => {
        pauseTimer();
    });

    // Watch for config changes
    watch(() => options.autoScroll, (newVal) => {
        if (newVal) startTimer();
        else pauseTimer();
    });

    return {
        currentIndex,
        isPaused,
        next,
        prev,
        goTo,
        startTimer,
        pauseTimer,
        resetTimer,
        registerInteraction
    };
}

