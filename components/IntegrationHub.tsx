
import React from 'react';
import { Language } from '../types';
import { Network, Database, Server, Wifi, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { OmniEsgCell } from './OmniEsgCell';

interface IntegrationHubProps {
  language: Language;
}

export const IntegrationHub: React.FC<IntegrationHubProps> = ({ language }) => {
  const isZh = language === 'zh-TW';

  const pipelines = [
    { id: 1, name: 'SAP ERP Connector', status: 'active', latency: '45ms', throughput: '1.2 GB/h', type: 'Database' },
    { id: 2, name: 'Siemens IoT Gateway', status: 'active', latency: '12ms', throughput: '500 MB/h', type: 'Wifi' },
    { id: 3, name: 'Salesforce CRM', status: 'warning', latency: '250ms', throughput: '150 MB/h', type: 'Server' },
    { id: 4, name: 'Scope 3 API (Ext)', status: 'active', latency: '80ms', throughput: '50 MB/h', type: 'Network' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
             {isZh ? '集成中樞' : 'Integration Hub'}
             <Network className="w-6 h-6 text-celestial-blue" />
          </h2>
          <p className="text-gray-400">{isZh ? '數據管線與 ETL 監控' : 'Data Pipeline & ETL Monitoring'}</p>
        </div>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 flex items-center gap-2 transition-all">
            <RefreshCw className="w-4 h-4" />
            {isZh ? '刷新狀態' : 'Refresh Status'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visual Topology */}
          <div className="glass-panel p-8 rounded-2xl flex items-center justify-center relative min-h-[400px] overflow-hidden bg-slate-900/50">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-celestial-blue/10 via-slate-900/0 to-slate-900/0" />
              
              {/* Central Hub */}
              <div className="relative z-10 w-24 h-24 rounded-full bg-celestial-blue/20 border-2 border-celestial-blue flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse">
                  <Database className="w-10 h-10 text-celestial-blue" />
                  <div className="absolute -bottom-8 text-xs font-bold text-celestial-blue">Data Lake</div>
              </div>

              {/* Satellites */}
              {[0, 1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className="absolute w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md"
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) rotate(${i * 90}deg) translate(140px) rotate(-${i * 90}deg)`
                    }}
                  >
                      {i === 0 && <Server className="w-6 h-6 text-emerald-400" />}
                      {i === 1 && <Wifi className="w-6 h-6 text-purple-400" />}
                      {i === 2 && <Database className="w-6 h-6 text-amber-400" />}
                      {i === 3 && <Network className="w-6 h-6 text-blue-400" />}
                      
                      {/* Connection Line */}
                      <div 
                        className="absolute h-[1px] w-[100px] bg-gradient-to-r from-transparent via-white/20 to-transparent top-1/2 left-1/2 origin-left -z-10"
                        style={{
                            transform: `rotate(${i * 90 + 180}deg) translate(30px)`,
                            width: '110px'
                        }}
                      />
                      {/* Moving Packet */}
                      <div 
                        className="absolute w-2 h-2 rounded-full bg-white top-1/2 left-1/2 -z-10 animate-ping"
                        style={{
                            animationDuration: '2s',
                            animationDelay: `${i * 0.5}s`
                        }}
                      />
                  </div>
              ))}
          </div>

          {/* Pipeline List */}
          <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">{isZh ? '管線狀態' : 'Pipeline Status'}</h3>
              {pipelines.map((pipe) => (
                  <OmniEsgCell 
                    key={pipe.id}
                    mode="list"
                    label={pipe.name}
                    value={pipe.status === 'active' ? 'Running' : 'Warning'}
                    subValue={`Latency: ${pipe.latency} • ${pipe.throughput}`}
                    color={pipe.status === 'active' ? 'emerald' : 'gold'}
                    icon={pipe.type === 'Wifi' ? Wifi : pipe.type === 'Database' ? Database : Server}
                    confidence={pipe.status === 'active' ? 'high' : 'medium'}
                    verified={true}
                    traits={pipe.status === 'active' ? ['seamless', 'bridging'] : ['gap-filling']}
                  />
              ))}
              
              <div className="p-4 rounded-xl bg-celestial-purple/10 border border-celestial-purple/20 mt-6">
                  <div className="flex items-start gap-3">
                      <div className="p-2 bg-celestial-purple/20 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-celestial-purple" />
                      </div>
                      <div>
                          <h4 className="text-sm font-bold text-white mb-1">{isZh ? 'ETL 排程報告' : 'ETL Schedule Report'}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                              {isZh ? '所有主要資料流在 03:00 UTC 同步完成。檢測到 0 個異常。' : 'All master data streams synchronized at 03:00 UTC. 0 Anomalies detected.'}
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
