<script lang="ts" setup>
const route = useRoute()
const sidequest = route.params.sidequest
</script>

<template>
    <div class="w-full h-full rounded-lg bg-stone-100">
        <h1>{{ sidequest }}</h1>
    </div>
</template>