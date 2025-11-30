
import { InteractionEvent, OmniEsgTrait } from '../types';

type Listener = (componentId: string, traits: OmniEsgTrait[]) => void;

/**
 * Evolution Engine (Client-side Heuristic Model).
 * Implements "Self-Growth" by tracking component interactions and dynamically 
 * assigning traits or weights based on usage frequency (Heatmap Analysis).
 * 
 * UPGRADE v2: Added Observer Pattern for real-time reactivity.
 */
class EvolutionEngine {
  private static STORAGE_KEY = 'esgss_evolution_matrix_v1';
  private interactionMap: Map<string, number>; // ComponentID -> Score
  private listeners: Set<Listener>;

  constructor() {
    this.interactionMap = new Map();
    this.listeners = new Set();
    this.load();
  }

  private load() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(EvolutionEngine.STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          this.interactionMap = new Map(Object.entries(parsed));
        }
      } catch (e) {
        console.error("Evolution Engine: Failed to load matrix", e);
      }
    }
  }

  private save() {
    if (typeof window !== 'undefined') {
      const obj = Object.fromEntries(this.interactionMap);
      localStorage.setItem(EvolutionEngine.STORAGE_KEY, JSON.stringify(obj));
    }
  }

  /**
   * Subscribe to evolution changes.
   * Returns an unsubscribe function.
   */
  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners about a change in a specific component.
   */
  private notify(componentId: string) {
    const traits = this.getEvolutionaryTraits(componentId);
    this.listeners.forEach(listener => listener(componentId, traits));
  }

  /**
   * Records a user interaction with a component.
   * Applies Time-Decay logic implicitly by purely additive score 
   * (reset logic would be needed for true time-decay, simplified here as accumulative growth).
   */
  public recordInteraction(event: InteractionEvent) {
    const { componentId, eventType } = event;
    const currentScore = this.interactionMap.get(componentId) || 0;
    
    let weight = 1;
    switch (eventType) {
      case 'click': weight = 5; break;
      case 'edit': weight = 10; break;
      case 'ai-trigger': weight = 8; break;
      case 'hover': weight = 0.5; break;
    }

    this.interactionMap.set(componentId, currentScore + weight);
    this.save();
    
    // Trigger Reactivity
    this.notify(componentId);
  }

  /**
   * Predicts optimal traits for a component based on its interaction history.
   * This implements the "Self-Adaptation" mechanism.
   */
  public getEvolutionaryTraits(componentId: string): OmniEsgTrait[] {
    const score = this.interactionMap.get(componentId) || 0;
    const adaptiveTraits: OmniEsgTrait[] = [];

    // Level 1: Active Usage -> Optimization Glow
    if (score > 10) {
      adaptiveTraits.push('optimization');
    }

    // Level 2: Heavy Usage -> Performance Rocket
    if (score > 30) {
      adaptiveTraits.push('performance');
    }

    // Level 3: Deep Engagement -> Evolution Infinity
    if (score > 60) {
      adaptiveTraits.push('evolution');
    }

    return adaptiveTraits;
  }

  /**
   * Returns the heat score for debugging or advanced layout logic.
   */
  public getScore(componentId: string): number {
    return this.interactionMap.get(componentId) || 0;
  }
}

export const evolutionEngine = new EvolutionEngine();
