import { reactive, readonly, type Ref } from 'vue';

export type PanelSide = 'left' | 'right';

export interface PanelState {
    id: string;
    side: PanelSide;
    isVisible: boolean;
    offset: number;
    // We keep refs to the DOM elements to calculate positions
    startNode: HTMLElement | null;
    endNode: HTMLElement | null;
}

// Define a zone for sidebar visibility
export interface PanelZone {
    id: string;
    side: PanelSide | PanelSide[];
    startNode: HTMLElement | null;
    endNode: HTMLElement | null;
}

// Global state for panels (singleton pattern usage via composable)
const panels = reactive<Map<string, PanelState>>(new Map());
const zones = reactive<Map<string, PanelZone>>(new Map());

const sidebarActive = reactive({
    left: false,
    right: false
});

export function usePanelController() {
    
    const registerPanel = (id: string, side: PanelSide) => {
        if (!panels.has(id)) {
            panels.set(id, {
                id,
                side,
                isVisible: false,
                offset: 0,
                startNode: null,
                endNode: null
            });
        } else {
            const panel = panels.get(id)!;
            panel.side = side;
        }
    };

    const unregisterPanel = (id: string) => {
        panels.delete(id);
    };

    const updateStartNode = (id: string, node: HTMLElement | null) => {
        if (panels.has(id)) {
            panels.get(id)!.startNode = node;
        }
    };

    const updateEndNode = (id: string, node: HTMLElement | null) => {
        if (panels.has(id)) {
            panels.get(id)!.endNode = node;
        }
    };

    // --- Zone Logic ---
    
    const registerZone = (id: string, side: PanelSide | PanelSide[]) => {
        if (!zones.has(id)) {
            zones.set(id, {
                id,
                side,
                startNode: null,
                endNode: null
            });
        }
    };
    
    const unregisterZone = (id: string) => {
        zones.delete(id);
    };
    
    const updateZoneStart = (id: string, node: HTMLElement | null) => {
        if (zones.has(id)) {
            zones.get(id)!.startNode = node;
        }
    };
    
    const updateZoneEnd = (id: string, node: HTMLElement | null) => {
        // Note: The ID logic for zones needs to handle matching In/Out. 
        // Simple approach: unique IDs for In/Out pairs or assume linear order?
        // For simplicity, let's assume "PanelIn" creates a zone ID, and "PanelOut" might close "the last open zone" 
        // or we explicitly name them. 
        // Given markdown limitation `::panelIn`, we might not have IDs. 
        // Let's assume `PanelOut` closes the matching side's most recent zone or a specific ID if provided.
        // BUT, for now, let's stick to explicit IDs if possible, or we manage them.
        // If PanelIn is `::panelIn` (no props), we might need to generate ID.
        
        if (zones.has(id)) {
            zones.get(id)!.endNode = node;
        }
    };


    const updateScroll = (scrollTop: number, viewportHeight: number) => {
        const viewBottom = scrollTop + viewportHeight;
        
        // 1. Calculate Zone Visibility (Sidebar Active)
        let leftActive = false;
        let rightActive = false;
        
        for (const zone of zones.values()) {
             if (!zone.startNode) continue;
             
             const zoneStart = zone.startNode.offsetTop;
             // If no end node, assume active until infinity (or end of doc)
             const zoneEnd = zone.endNode ? zone.endNode.offsetTop : Infinity;
             
             // Rule: Active if Viewport Bottom is within the Zone
             // viewBottom > zoneStart && viewBottom < zoneEnd
             // This matches "Expand when enters from bottom" and "Slide away when leaves from bottom"
             if (viewBottom > zoneStart && viewBottom < zoneEnd) {
                 const sides = Array.isArray(zone.side) ? zone.side : [zone.side];
                 sides.forEach(s => {
                    if (s === 'left') leftActive = true;
                    if (s === 'right') rightActive = true;
                 });
             }
        }
        
        sidebarActive.left = leftActive;
        sidebarActive.right = rightActive;

        // 2. Calculate Panel Item Positions
        for (const panel of panels.values()) {
            if (!panel.startNode || !panel.endNode) {
                panel.isVisible = false;
                continue;
            }

            const startTop = panel.startNode.offsetTop;
            const endTop = panel.endNode.offsetTop;

            if (scrollTop < startTop) {
                 panel.offset = startTop - scrollTop;
            } else if (scrollTop >= startTop && scrollTop < endTop) {
                panel.offset = 0;
            } else {
                panel.offset = endTop - scrollTop;
            }
            panel.isVisible = true;
        }
    };

    const getPanelState = (id: string) => {
        return panels.get(id);
    };

    return {
        panels: readonly(panels),
        sidebarActive: readonly(sidebarActive),
        registerPanel,
        unregisterPanel,
        updateStartNode,
        updateEndNode,
        registerZone,
        unregisterZone,
        updateZoneStart,
        updateZoneEnd,
        updateScroll,
        getPanelState
    };
}
