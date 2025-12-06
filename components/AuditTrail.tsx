
import React, { useState } from 'react';
import { Language, AuditLogEntry } from '../types';
import { ShieldCheck, Clock, Hash, Link as LinkIcon, AlertCircle, X, FileCheck, Calendar, User, Code } from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';

interface AuditTrailProps {
  language: Language;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { auditLogs } = useCompany();
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  // If logs are empty, show a placeholder
  const hasLogs = auditLogs.length > 0;

  return (
    <div className="space-y-8 animate-fade-in relative">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-celestial-emerald/10 rounded-xl border border-celestial-emerald/20">
                 <ShieldCheck className="w-8 h-8 text-celestial-emerald" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-white">{isZh ? '稽核軌跡' : 'Audit Trail'}</h2>
                <p className="text-gray-400">{isZh ? '區塊鏈驗證之不可篡改紀錄 (Linked to System Actions)' : 'Blockchain Verified Immutable Logs (Linked to System Actions)'}</p>
            </div>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 min-h-[400px]">
            {!hasLogs ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                    <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                    <p>{isZh ? '尚無稽核紀錄。請執行系統操作（如修改設定、生成報告）以產生紀錄。' : 'No audit logs found. Perform system actions (e.g., change settings, generate reports) to create logs.'}</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                                <th className="p-4 pl-6 font-medium whitespace-nowrap">{isZh ? '時間戳記' : 'Timestamp'}</th>
                                <th className="p-4 font-medium whitespace-nowrap">{isZh ? '動作' : 'Action'}</th>
                                <th className="p-4 font-medium whitespace-nowrap">{isZh ? '使用者' : 'User'}</th>
                                <th className="p-4 font-medium w-1/3">{isZh ? '詳情' : 'Details'}</th>
                                <th className="p-4 font-medium whitespace-nowrap">{isZh ? '雜湊值 (Hash)' : 'Hash'}</th>
                                <th className="p-4 font-medium text-right pr-6 whitespace-nowrap">{isZh ? '驗證' : 'Verification'}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-white/5">
                            {auditLogs.map((log) => (
                                <tr 
                                    key={log.id} 
                                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                                    onClick={() => setSelectedLog(log)}
                                >
                                    <td className="p-4 pl-6 text-gray-300 flex items-center gap-2 whitespace-nowrap">
                                        <Clock className="w-3 h-3 text-gray-500" />
                                        {new Date(log.timestamp).toLocaleTimeString()} <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</span>
                                    </td>
                                    <td className="p-4 font-medium text-white whitespace-nowrap">{log.action}</td>
                                    <td className="p-4 text-celestial-purple whitespace-nowrap">{log.user}</td>
                                    <td className="p-4 text-gray-300 break-words max-w-xs">{log.details}</td>
                                    <td className="p-4 font-mono text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap">
                                        <Hash className="w-3 h-3" />
                                        {log.hash.substring(0, 8)}...{log.hash.substring(log.hash.length-4)}
                                    </td>
                                    <td className="p-4 text-right pr-6 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                                            <LinkIcon className="w-3 h-3" /> Verified
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* Certificate Modal */}
        {selectedLog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedLog(null)}>
                <div 
                    className="w-full max-w-lg bg-white text-black rounded-2xl overflow-hidden shadow-2xl relative"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header Design */}
                    <div className="h-2 bg-gradient-to-r from-emerald-500 to-blue-500" />
                    <button onClick={() => setSelectedLog(null)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-100">
                            <FileCheck className="w-8 h-8 text-emerald-600" />
                        </div>
                        
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1">Digital Certificate of Authenticity</h3>
                        <p className="text-gray-500 text-sm uppercase tracking-widest mb-8">Secured by JunAiKey Chain</p>

                        <div className="space-y-4 text-left border-t border-b border-gray-100 py-6">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-xs font-bold uppercase flex items-center gap-2"><Calendar className="w-3 h-3"/> Timestamp</span>
                                <span className="font-mono text-sm">{new Date(selectedLog.timestamp).toISOString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-xs font-bold uppercase flex items-center gap-2"><User className="w-3 h-3"/> Signer</span>
                                <span className="font-mono text-sm">{selectedLog.user}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-xs font-bold uppercase flex items-center gap-2"><ShieldCheck className="w-3 h-3"/> Action Type</span>
                                <span className="font-bold text-sm bg-gray-100 px-2 py-1 rounded">{selectedLog.action}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 text-xs font-bold uppercase flex items-center gap-2 mb-1"><Code className="w-3 h-3"/> Transaction Hash</span>
                                <div className="font-mono text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 break-all">
                                    {selectedLog.hash}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            {/* Simulated QR Code */}
                            <div className="w-16 h-16 bg-gray-900 text-white flex items-center justify-center text-[8px] font-mono leading-none break-all p-1">
                                {selectedLog.hash.substring(0,64)}
                            </div>
                            <div className="text-right">
                                <div className="text-emerald-600 font-bold font-serif text-lg">Verified</div>
                                <div className="text-xs text-gray-400">Block Height: #{Math.floor(selectedLog.timestamp / 10000)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
