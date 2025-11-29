<template>
    <!-- Header section -->
    <div class="w-full h-12 min-w-full flex justify-between relative items-center px-3">
        <img src="~/assets/img/avatar.jpg" alt="logo" class="w-12 h-12 object-cover object-center rounded-full" />

        <div class="absolute left-1/2 transform -translate-x-1/2 flex gap-8 text-lg rounded-full px-8 py-1 border-solid border-gray-300 border-1">
            <NuxtLink to="/">Home</NuxtLink>
            <NuxtLink to="/projects">Projects</NuxtLink>
            <NuxtLink to="/sidequests">Sidequests</NuxtLink>
        </div>

        <div class="flex gap-2 text-lg">
            <NuxtLink to="/resume">Resume</NuxtLink>
        </div>
    </div>
</template>
