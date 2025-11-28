<template>
    <div class="max-w-52 overflow-hidden h-full pl-4 py-2 flex flex-col justify-between">

        <!-- Sidebar content -->
        <div class="w-full flex flex-col gap-2">
            <div>
                <a class="text-xl">Technology</a>
                <div class="flex flex-col pl-3 text-stone-400">
                    <a class="text-lg">Guardian</a>
                    <a class="text-lg">Something</a>
                    <a class="text-lg">Something</a>
                </div>
            </div>


            <div>
                <a class="text-xl">Artworks</a>
                <div class="flex flex-col pl-3 text-stone-400">
                    <a class="text-lg">Contour</a>
                </div>
            </div>

            <div>
                <a class="text-xl">Business</a>
                <div class="flex flex-col pl-3 text-stone-400">
                    <a class="text-lg">Funny</a>
                </div>
            </div>

            <div>
                <NuxtLink to="/projects/experiment" class="text-xl">Experiment</NuxtLink>
            </div>
        </div>

        <!-- Foot notes -->
        <div class="flex flex-col">
            <a>Justin Zhu</a>
        </div>
    </div>
</template>