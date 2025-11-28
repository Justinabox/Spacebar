<script setup lang="ts">
import { inject, render, type AppContext, getCurrentInstance } from 'vue';
import { motion } from "motion-v"

const instance = getCurrentInstance()
const contextManager = inject('panelContextManager') as PanelContextManager;
const content = ref<HTMLDivElement | null>(null);
const rightSidebar = ref<HTMLDivElement | null>(null);

// watch content scroll position change
const mobileViewport = isMobileViewport()
const scrollTop = ref(0);

const displayLeftSidebar = ref(false);
const displayRightSidebar = ref(false);

function handleScroll() {
  if (content.value) {
    scrollTop.value = content.value.scrollTop;
    const inViewContexts = contextManager.updateInViewContext(content.value.clientHeight, scrollTop.value);

    let leftSideFlag = false;
    let rightSideFlag = false;
    
    // if (inViewContexts.length > 0) {
    //     console.log("slotContent:", inViewContexts);
    // }
    for (const inViewContext of inViewContexts) {
        // Ensure fields are populated
        if (inViewContext.side === 'left') {
            leftSideFlag = true;
            displayLeftSidebar.value = true;
        } else if (inViewContext.side === 'right') {
            rightSideFlag = true;
            displayRightSidebar.value = true;
        }

        if (!inViewContext.context.startNode.value || !inViewContext.context.endNode.value || inViewContext.context.contentNode.value || !inViewContext.context.content) {
            continue;
        }
        
        // Append the content node to the content div, and get reference to the node
        const vnodes = inViewContext.context.content ?? [];
        const newDiv = document.createElement('div')
        newDiv.style.position = 'absolute';
        newDiv.style.top = `${inViewContext.offset}px`;
        rightSidebar.value!.appendChild(newDiv);
        for (const vnode of vnodes) {
            vnode.appContext = instance?.appContext as unknown as AppContext;
            render(vnode, newDiv);
        }
        contextManager.updateContentNodeContext(inViewContext.id, ref(newDiv));
    }
    displayLeftSidebar.value = leftSideFlag;
    displayRightSidebar.value = rightSideFlag;
  }
}

onMounted(() => {
  if (content.value) {
    content.value.addEventListener('scroll', handleScroll);
  }
});

onBeforeUnmount(() => {
  if (content.value) {
    content.value.removeEventListener('scroll', handleScroll);
  }
});
</script>

<template>
    <div class="w-full h-full flex justify-center overflow-y-scroll max-h-full" ref="content">
        <div v-if="!mobileViewport && displayLeftSidebar" class="max-w-[600px] min-w-1/4 max-w-1/2 h-full sticky top-0 grow-1 p-2" ref="leftSidebar">
        </div>

        <!-- Content -->
        <div class="max-w-[800px] min-w-1/2">
            <slot />
        </div>

        <div v-if="!mobileViewport" class="max-w-[600px] min-w-1/4 max-w-1/2 h-full sticky top-0 grow-1 p-2" ref="rightSidebar">
        </div>

    </div>
</template>