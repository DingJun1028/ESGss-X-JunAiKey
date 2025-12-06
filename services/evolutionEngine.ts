
import { InteractionEvent, OmniEsgTrait, UniversalKnowledgeNode, UniversalLabel } from '../types';

type Listener = (node: UniversalKnowledgeNode) => void;

/**
 * Universal Intelligence Library (The Brain).
 * Previously 'EvolutionEngine'.
 * 
 * Responsibilities:
 * 1. Store the state of all Universal Agent Components (Nodes).
 * 2. Manage the bidirectional sync between UI (Component) and Logic (Agent).
 * 3. Provide a Pub/Sub mechanism for real-time trait evolution.
 */
class UniversalIntelligenceEngine {
  private static STORAGE_KEY = 'jun_aikey_universal_mind_v1';
  private knowledgeGraph: Map<string, UniversalKnowledgeNode>; 
  private listeners: Set<Listener>;

  constructor() {
    this.knowledgeGraph = new Map();
    this.listeners = new Set();
    this.load();
  }

  private load() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(UniversalIntelligenceEngine.STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Rehydrate map
          Object.values(parsed).forEach((node: any) => {
             this.knowledgeGraph.set(node.id, node);
          });
        }
      } catch (e) {
        console.error("Universal Intelligence: Failed to load memory", e);
      }
    }
  }

  private save() {
    if (typeof window !== 'undefined') {
      const obj = Object.fromEntries(this.knowledgeGraph);
      localStorage.setItem(UniversalIntelligenceEngine.STORAGE_KEY, JSON.stringify(obj));
    }
  }

  /**
   * Registers a Component as an Agent Node in the Intelligence Library.
   * "I think, therefore I am."
   */
  public registerNode(id: string, label: UniversalLabel | string, initialValue: any) {
    if (!this.knowledgeGraph.has(id)) {
      const labelObj: UniversalLabel = typeof label === 'string' 
        ? { id, text: label } 
        : label;

      const newNode: UniversalKnowledgeNode = {
        id,
        type: 'component',
        label: labelObj,
        currentValue: initialValue,
        traits: [],
        confidence: 'high',
        lastInteraction: Date.now(),
        interactionCount: 0,
        memory: {
          history: [],
          aiInsights: []
        }
      };
      this.knowledgeGraph.set(id, newNode);
      this.save();
    }
  }

  /**
   * Subscribe to changes for specific nodes or global updates.
   */
  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(node: UniversalKnowledgeNode) {
    this.listeners.forEach(listener => listener(node));
  }

  /**
   * The Sense Input.
   * Records user interaction, updates "Heatmap", and triggers Evolution.
   */
  public recordInteraction(event: InteractionEvent) {
    const { componentId, eventType, payload } = event;
    const node = this.knowledgeGraph.get(componentId);
    
    if (node) {
      // 1. Update Metrics
      node.interactionCount += 1;
      node.lastInteraction = Date.now();
      
      // 2. Logic: Weighting
      let weight = 1;
      switch (eventType) {
        case 'click': weight = 2; break;
        case 'edit': weight = 5; break;
        case 'ai-trigger': weight = 8; break; // High impact
        case 'hover': weight = 0.1; break;
      }
      
      // 3. Evolve Traits (Self-Adaptation)
      // This is the "Agent" deciding to change its appearance based on experience.
      const traits = new Set(node.traits);
      
      if (node.interactionCount > 5) traits.add('optimization'); // Breathing
      if (node.interactionCount > 20) traits.add('performance'); // Rocket
      if (eventType === 'ai-trigger') traits.add('learning');    // Pulse
      if (node.interactionCount > 50) traits.add('evolution');   // Infinity

      // Logic: If user edits, we remove "gap-filling" (AI estimate) because now it's human verified
      if (eventType === 'edit') {
          traits.delete('gap-filling');
          node.confidence = 'high';
          if (payload) node.currentValue = payload;
      }

      node.traits = Array.from(traits);
      
      this.knowledgeGraph.set(componentId, node);
      this.save();
      this.notify(node);
    }
  }

  /**
   * Direct Agent Action.
   * AI Logic updating the Component State directly.
   */
  public agentUpdate(id: string, updates: Partial<UniversalKnowledgeNode>) {
      const node = this.knowledgeGraph.get(id);
      if (node) {
          Object.assign(node, updates);
          this.knowledgeGraph.set(id, node);
          this.save();
          this.notify(node);
      }
  }

  /**
   * Retrieval: Get the "Soul" of the component.
   */
  public getNode(id: string): UniversalKnowledgeNode | undefined {
    return this.knowledgeGraph.get(id);
  }
}

export const universalIntelligence = new UniversalIntelligenceEngine();
