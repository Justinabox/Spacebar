type PanelContext = {
    startNode: Ref<HTMLDivElement | null>;
    endNode: Ref<HTMLDivElement | null>;
    contentNode: Ref<HTMLDivElement | null>;
    content: VNode[] | null;
    side: 'left' | 'right' | null;
}

type PanelContextInView = {
    context: PanelContext;
    id: string;
    offset: number;
    side: 'left' | 'right';
}

export class PanelContextManager {
    private context: Map<string, PanelContext> = new Map();

    public checkContext(id: string): boolean {
        const context = this.context.get(id);
        if (context) {
            return true;
        }
        return false;
    }

    public createContext(id: string) {
        // Create an empty context, hydrated later based on the dynamically added nodes
        this.context.set(id, {
            startNode: ref<HTMLDivElement | null>(null),
            endNode: ref<HTMLDivElement | null>(null),
            contentNode: ref<HTMLDivElement | null>(null),
            content: null,
            side: null
        });
    }

    public updateStartNodeContext(id: string, startNode: Ref<HTMLDivElement | null>, content: VNode[], side: 'left' | 'right') {
        if (!this.checkContext(id)) {
            this.createContext(id);
        }
        this.context.set(id, {
            startNode,
            endNode: this.context.get(id)?.endNode ?? ref<HTMLDivElement | null>(null),
            contentNode: this.context.get(id)?.contentNode ?? ref<HTMLDivElement | null>(null),
            content: content,
            side: side 
        });
    }

    public updateEndNodeContext(id: string, endNode: Ref<HTMLDivElement | null>) {
        if (!this.checkContext(id)) {
            this.createContext(id);
        }
        this.context.set(id, {
            startNode: this.context.get(id)?.startNode ?? ref<HTMLDivElement | null>(null),
            endNode,
            contentNode: this.context.get(id)?.contentNode ?? ref<HTMLDivElement | null>(null),
            content: this.context.get(id)?.content ?? null,
            side: this.context.get(id)?.side ?? null
        });
    }

    public updateContentNodeContext(id: string, contentNode: Ref<HTMLDivElement | null>) {
        if (!this.checkContext(id)) {
            return;
        }
        this.context.set(id, {
            startNode: this.context.get(id)?.startNode ?? ref<HTMLDivElement | null>(null),
            endNode: this.context.get(id)?.endNode ?? ref<HTMLDivElement | null>(null),
            contentNode: contentNode,
            content: this.context.get(id)?.content ?? null,
            side: this.context.get(id)?.side ?? null
        });
    }

    updateRefContentNode(id: string, offset: number): boolean {
        if (!this.checkContext(id)) {
            return false;
        }
        try {
            this.context.get(id)!.contentNode.value!.style.top = `${offset}px`;
        } catch (error) {
            return false;
        }
        return true;
    }
    

    public updateInViewContext(viewportHeight: number, scrollTop: number) {
        // console.log("calculating in view context", viewportHeight, scrollTop);
        const inViewContexts: PanelContextInView[] = [];
        for (const [id, context] of this.context.entries()) {
            // console.log("top node:", context.startNode.value?.offsetTop);
            if (context.side && context.startNode.value && context.endNode.value && context.content) {
                if (scrollTop + viewportHeight > context.startNode.value.offsetTop && scrollTop < context.startNode.value.offsetTop) {
                    // Scroll after the start node, offset matches the start node position
                    this.updateRefContentNode(id, context.startNode.value.offsetTop - scrollTop)
                    // inViewContexts.push({ context: context, id: id, offset: context.startNode.value.offsetTop - scrollTop, side: context.side });
                } else if (scrollTop > context.startNode.value.offsetTop && scrollTop < context.endNode.value.offsetTop) {
                    // Between start and end node, offset is 0
                    this.updateRefContentNode(id, 0)
                    inViewContexts.push({ context: context, id: id, offset: 0, side: context.side });
                } else {
                    // Scroll past the end node, offset matches the end node position
                    this.updateRefContentNode(id, context.endNode.value.offsetTop - scrollTop)
                    // inViewContexts.push({ context: context, id: id, offset: context.endNode.value.offsetTop - scrollTop, side: context.side });
                }
            }
        }
        return inViewContexts;
    }

    public getContext(id: string) {
        return this.context.get(id);
    }

    public removeContext(id: string) {
        this.context.delete(id);
    }
}