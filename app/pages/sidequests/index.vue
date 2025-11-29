<template>
    <div class="w-full h-full">
        <Portal 
            :items="['Topographic', 'Mountains', 'Ocean', 'Forest']" 
            :auto-scroll="true"
            :interval="5000"
        >
            <template #default="{ item, index }">
                <div class="w-full h-full relative overflow-hidden">
                    <!-- Backgrounds -->
                    <img 
                        v-if="index === 0"
                        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapers.com%2Fimages%2Fhd%2Fabstract-black-topographic-lines-pbtm4zynr6ggmds3.jpg&f=1&nofb=1&ipt=e20961148f27a9e219e814e7556a9d35165abf1e58c857dd44f5f6ba8d835437" 
                        class="absolute inset-0 w-full h-full object-cover"
                    />
                    <div v-else-if="index === 1" class="absolute inset-0 bg-stone-800 w-full h-full flex items-center justify-center text-white">
                        ⛰️
                    </div>
                    <div v-else-if="index === 2" class="absolute inset-0 bg-blue-900 w-full h-full flex items-center justify-center text-white">
                        🌊
                    </div>
                    <div v-else class="absolute inset-0 bg-green-900 w-full h-full flex items-center justify-center text-white">
                        🌲
                    </div>

                    <!-- Overlay Content -->
                    <div class="absolute inset-0 flex items-center justify-center">
                        <h1 class="text-4xl font-bold text-white drop-shadow-lg tracking-wider uppercase">{{ item }}</h1>
                    </div>
                </div>
            </template>
        </Portal>
    </div>
</template>
