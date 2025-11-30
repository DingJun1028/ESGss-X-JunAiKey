
import React, { useEffect, useMemo, useState } from 'react';
import { evolutionEngine } from '../../services/evolutionEngine';
import { OmniEsgTrait, UniversalLabel } from '../../types';

/**
 * Configuration for the Universal Proxy.
 */
interface ProxyConfig {
  enableTelemetry?: boolean;
  enableCircuitBreaker?: boolean;
  enableEvolution?: boolean;
}

/**
 * Props injected by the Proxy into the wrapped component.
 */
export interface InjectedProxyProps {
  /** Evolutionary traits derived from self-growth engine */
  adaptiveTraits?: OmniEsgTrait[];
  /** Handler to track interactions manually if needed */
  trackInteraction?: (type: 'click' | 'hover' | 'edit' | 'ai-trigger') => void;
  /** Whether the component is in a "Hot" state */
  isHighFrequency?: boolean;
}

/**
 * Universal Proxy HOC (萬能代理).
 * Acts as the middleware layer for all Universal Components.
 * Responsibilities:
 * 1. Telemetry (Self-Growth Data Collection)
 * 2. Resilience (Error Boundary / Circuit Breaker)
 * 3. Adaptation (Injecting computed traits based on history)
 */
export const withUniversalProxy = <P extends object>(
  WrappedComponent: React.ComponentType<P & InjectedProxyProps>,
  config: ProxyConfig = { enableTelemetry: true, enableEvolution: true }
) => {
  const ComponentWithProxy = (props: P & { id?: string; label?: string | UniversalLabel }) => {
    // 1. Identify the Component (Universal ID)
    // Fallback to label text or random ID if strictly necessary (though ID is preferred for persistence)
    const componentId = props.id || (typeof props.label === 'string' ? props.label : props.label?.id) || 'anonymous-component';
    
    const [adaptiveTraits, setAdaptiveTraits] = useState<OmniEsgTrait[]>([]);
    const [hasError, setHasError] = useState(false);

    // 2. Self-Growth: Load adaptive traits on mount AND subscribe to changes
    useEffect(() => {
      if (config.enableEvolution && componentId) {
        // Initial load
        setAdaptiveTraits(evolutionEngine.getEvolutionaryTraits(componentId));

        // Subscribe to real-time evolution
        const unsubscribe = evolutionEngine.subscribe((updatedId, newTraits) => {
          if (updatedId === componentId) {
            setAdaptiveTraits(newTraits);
          }
        });

        return () => unsubscribe();
      }
    }, [componentId]);

    // 3. Telemetry Interceptor
    const trackInteraction = (type: 'click' | 'hover' | 'edit' | 'ai-trigger') => {
      if (config.enableTelemetry && componentId) {
        evolutionEngine.recordInteraction({
          componentId,
          eventType: type,
          timestamp: Date.now()
        });
      }
    };

    // 4. Resilience: Circuit Breaker / Error Boundary simulation
    if (hasError) {
      return (
        <div className="p-2 border border-red-500/20 bg-red-500/10 rounded-lg text-xs text-red-400">
          Component System Failure (Circuit Open)
        </div>
      );
    }

    try {
      // 5. Prop Injection & Event Interception
      const proxiedProps = { ...props } as any;

      // Intercept onClick
      if (proxiedProps.onClick) {
        const originalOnClick = proxiedProps.onClick;
        proxiedProps.onClick = (...args: any[]) => {
          trackInteraction('click');
          return originalOnClick(...args);
        };
      }

      // Intercept onAiAnalyze
      if (proxiedProps.onAiAnalyze) {
        const originalOnAi = proxiedProps.onAiAnalyze;
        proxiedProps.onAiAnalyze = (...args: any[]) => {
          trackInteraction('ai-trigger');
          return originalOnAi(...args);
        };
      }

      const isHighFrequency = adaptiveTraits.includes('optimization');

      return (
        <WrappedComponent
          {...(proxiedProps as P)}
          adaptiveTraits={adaptiveTraits}
          trackInteraction={trackInteraction}
          isHighFrequency={isHighFrequency}
        />
      );
    } catch (e) {
      console.error(`[UniversalProxy] Error in component ${componentId}:`, e);
      setHasError(true);
      return null;
    }
  };

  ComponentWithProxy.displayName = `UniversalProxy(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return React.memo(ComponentWithProxy);
};
