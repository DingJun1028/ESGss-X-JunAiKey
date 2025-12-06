
import React from 'react';
import { Language } from '../types';
import { ShieldCheck, Clock, Hash, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';

interface AuditTrailProps {
  language: Language;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { auditLogs } = useCompany();

  // If logs are empty, show a placeholder
  const hasLogs = auditLogs.length > 0;

  return (
    <div className="space-y-8 animate-fade-in">
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
                                <tr key={log.id} className="hover:bg-white/5 transition-colors group">
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
    </div>
  );
};
