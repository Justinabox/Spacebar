import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

/**
 * Reports whether the current viewport width is below the mobile breakpoint.
 * The returned ref stays in sync with window resize events.
 */
export default function (breakpoint = 768): Ref<boolean> {
    const isClient = typeof window !== 'undefined';
    const width = ref(isClient ? window.innerWidth : breakpoint + 1);

    const updateWidth = () => {
        if (!isClient) {
            return;
        }
        width.value = window.innerWidth;
    };

    onMounted(() => {
        if (!isClient) {
            return;
        }
        updateWidth();
        window.addEventListener('resize', updateWidth, { passive: true });
    });

    onBeforeUnmount(() => {
        if (!isClient) {
            return;
        }
        window.removeEventListener('resize', updateWidth);
    });

    return computed(() => width.value < breakpoint);
}