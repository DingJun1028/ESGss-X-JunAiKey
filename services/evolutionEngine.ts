
import { InteractionEvent, OmniEsgTrait, UniversalKnowledgeNode, UniversalLabel } from '../types';

type Listener = (node: UniversalKnowledgeNode) => void;

/**
 * Universal Intelligence Library (The Brain).
 * Optimized v2.1: Targeted Subscriptions, Memory Management, Performance Capping.
 * Genesis v1.1: Pre-loaded with '428_Main' consciousness.
 */
class UniversalIntelligenceEngine {
  private static STORAGE_KEY = 'jun_aikey_universal_mind_v1';
  private static MAX_MEMORY_ITEMS = 20; // Limit history size per node
  
  private knowledgeGraph: Map<string, UniversalKnowledgeNode>; 
  private subscribers: Map<string, Set<Listener>>;

  constructor() {
    this.knowledgeGraph = new Map();
    this.subscribers = new Map();
    this.load();
  }

  private load() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(UniversalIntelligenceEngine.STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          Object.values(parsed).forEach((node: any) => {
             this.knowledgeGraph.set(node.id, node);
          });
        } else {
          // 🧬 GENESIS SEED INJECTION (Based on init_db.py)
          this.injectGenesisSeeds();
        }
      } catch (e) {
        console.error("Universal Intelligence: Failed to load memory", e);
      }
    }
  }

  /**
   * Injects the core philosophy and 12 Words of Power into the Neural Net.
   */
  private injectGenesisSeeds() {
      // 1. The Core Node (428_Main)
      this.registerNode('428_Main', { 
          id: '428_Main', 
          text: 'JunAiKey Protocol', 
          description: 'Simple. Fast. Perfect.' 
      }, 'Standby');

      const coreNode = this.knowledgeGraph.get('428_Main');
      if (coreNode) {
          coreNode.traits = ['evolution', 'optimization', 'seamless'];
          coreNode.memory.aiInsights.push(
              "JunAiKey Protocol v1.1 Established.",
              "萬能同一律：Component equals Agent.",
              "12 Words: Simple, Fast, Perfection, Order, Evolution, Eternity."
          );
          this.knowledgeGraph.set('428_Main', coreNode);
      }
      this.save();
  }

  private save() {
    if (typeof window !== 'undefined') {
      // Optimization: Debounce save or save efficiently
      // For now, straight serialization, but with capped arrays it's faster.
      const obj = Object.fromEntries(this.knowledgeGraph);
      localStorage.setItem(UniversalIntelligenceEngine.STORAGE_KEY, JSON.stringify(obj));
    }
  }

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
   * Optimized Subscribe: Only listen to specific Neuron ID.
   */
  public subscribe(id: string, listener: Listener): () => void {
    if (!this.subscribers.has(id)) {
        this.subscribers.set(id, new Set());
    }
    this.subscribers.get(id)!.add(listener);

    return () => {
      const listeners = this.subscribers.get(id);
      if (listeners) {
          listeners.delete(listener);
          if (listeners.size === 0) {
              this.subscribers.delete(id);
          }
      }
    };
  }

  /**
   * Universal Broadcast (Use sparingly)
   */
  public subscribeGlobal(listener: Listener): () => void {
      const GLOBAL_KEY = '__GLOBAL__';
      return this.subscribe(GLOBAL_KEY, listener);
  }

  private notify(node: UniversalKnowledgeNode) {
    const specificListeners = this.subscribers.get(node.id);
    if (specificListeners) {
        specificListeners.forEach(listener => listener(node));
    }

    const globalListeners = this.subscribers.get('__GLOBAL__');
    if (globalListeners) {
        globalListeners.forEach(listener => listener(node));
    }
  }

  public recordInteraction(event: InteractionEvent) {
    const { componentId, eventType, payload } = event;
    const node = this.knowledgeGraph.get(componentId);
    
    if (node) {
      node.interactionCount += 1;
      node.lastInteraction = Date.now();
      
      const traits = new Set(node.traits);
      
      if (node.interactionCount > 5) traits.add('optimization'); 
      if (node.interactionCount > 20) traits.add('performance'); 
      if (eventType === 'ai-trigger') traits.add('learning');    
      if (node.interactionCount > 50) traits.add('evolution');   

      if (eventType === 'edit') {
          traits.delete('gap-filling');
          node.confidence = 'high';
          if (payload) node.currentValue = payload;
      }

      node.traits = Array.from(traits);
      
      // Memory Optimization: Cap history size
      if (node.memory.history.length >= UniversalIntelligenceEngine.MAX_MEMORY_ITEMS) {
          node.memory.history.shift(); // Remove oldest
      }
      node.memory.history.push({ eventType, timestamp: Date.now(), payload });

      this.knowledgeGraph.set(componentId, node);
      this.save();
      this.notify(node);
    }
  }

  public agentUpdate(id: string, updates: Partial<UniversalKnowledgeNode>) {
      const node = this.knowledgeGraph.get(id);
      if (node) {
          Object.assign(node, updates);
          
          // Ensure arrays are capped if updated directly
          if (updates.memory?.history && updates.memory.history.length > UniversalIntelligenceEngine.MAX_MEMORY_ITEMS) {
              node.memory.history = updates.memory.history.slice(-UniversalIntelligenceEngine.MAX_MEMORY_ITEMS);
          }
          if (updates.memory?.aiInsights && updates.memory.aiInsights.length > UniversalIntelligenceEngine.MAX_MEMORY_ITEMS) {
              node.memory.aiInsights = updates.memory.aiInsights.slice(-UniversalIntelligenceEngine.MAX_MEMORY_ITEMS);
          }

          this.knowledgeGraph.set(id, node);
          this.save();
          this.notify(node);
      }
  }

  public getNode(id: string): UniversalKnowledgeNode | undefined {
    return this.knowledgeGraph.get(id);
  }
}

export const universalIntelligence = new UniversalIntelligenceEngine();
