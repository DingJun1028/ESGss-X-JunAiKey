
import React, { useEffect, useState } from 'react';
import { universalIntelligence } from '../../services/evolutionEngine';
import { OmniEsgTrait, UniversalLabel } from '../../types';

interface ProxyConfig {
  enableTelemetry?: boolean;
  enableEvolution?: boolean;
}

export interface InjectedProxyProps {
  adaptiveTraits?: OmniEsgTrait[];
  trackInteraction?: (type: 'click' | 'hover' | 'edit' | 'ai-trigger', payload?: any) => void;
  isHighFrequency?: boolean;
  isAgentActive?: boolean; // New prop indicating active agent connection
}

/**
 * Universal Proxy HOC (萬能代理).
 * Transforms a passive UI Component into an Active Agent Node.
 */
export const withUniversalProxy = <P extends object>(
  WrappedComponent: React.ComponentType<P & InjectedProxyProps>,
  config: ProxyConfig = { enableTelemetry: true, enableEvolution: true }
) => {
  const ComponentWithProxy = (props: P & { id?: string; label?: string | UniversalLabel; value?: any }) => {
    // 1. Identity Resolution
    const componentId = props.id || (typeof props.label === 'string' ? props.label : props.label?.id) || `anon-${Math.random().toString(36).substr(2,9)}`;
    
    const [adaptiveTraits, setAdaptiveTraits] = useState<OmniEsgTrait[]>([]);
    const [isAgentActive, setIsAgentActive] = useState(false);

    // 2. Registration & Neural Link (Mount)
    useEffect(() => {
      if (config.enableEvolution) {
        // Register "I am here" to the Intelligence Library
        universalIntelligence.registerNode(componentId, props.label || 'Unknown', props.value);

        // Load initial state from the "Mind"
        const node = universalIntelligence.getNode(componentId);
        if (node) {
            setAdaptiveTraits(node.traits);
            setIsAgentActive(node.traits.includes('learning'));
        }

        // Subscribe to Brain waves (Updates)
        const unsubscribe = universalIntelligence.subscribe((updatedNode) => {
          if (updatedNode.id === componentId) {
            setAdaptiveTraits(updatedNode.traits);
            setIsAgentActive(updatedNode.traits.includes('learning'));
          }
        });

        return () => unsubscribe();
      }
    }, [componentId]);

    // 3. Sense Input (Telemetry)
    const trackInteraction = (type: 'click' | 'hover' | 'edit' | 'ai-trigger', payload?: any) => {
      if (config.enableTelemetry) {
        universalIntelligence.recordInteraction({
          componentId,
          eventType: type,
          timestamp: Date.now(),
          payload
        });
      }
    };

    // 4. Logic Injection
    const isHighFrequency = adaptiveTraits.includes('optimization');

    // 5. Render
    try {
      const proxiedProps = { ...props } as any;

      // Intercept Events to feed the Intelligence
      if (proxiedProps.onClick) {
        const originalOnClick = proxiedProps.onClick;
        proxiedProps.onClick = (...args: any[]) => {
          trackInteraction('click');
          return originalOnClick(...args);
        };
      }

      if (proxiedProps.onAiAnalyze) {
        const originalOnAi = proxiedProps.onAiAnalyze;
        proxiedProps.onAiAnalyze = (...args: any[]) => {
          trackInteraction('ai-trigger');
          return originalOnAi(...args);
        };
      }

      return (
        <WrappedComponent
          {...(proxiedProps as P)}
          adaptiveTraits={adaptiveTraits}
          trackInteraction={trackInteraction}
          isHighFrequency={isHighFrequency}
          isAgentActive={isAgentActive}
        />
      );
    } catch (e) {
      console.error(`[UniversalProxy] Error in agent node ${componentId}:`, e);
      return <div className="text-red-500 text-xs">Agent Error</div>;
    }
  };

  ComponentWithProxy.displayName = `UniversalProxy(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return React.memo(ComponentWithProxy);
};
