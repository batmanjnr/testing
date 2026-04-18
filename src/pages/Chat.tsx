import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';

const Chat = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Messages</h1>
      <div className="bg-white rounded-3xl p-12 border border-slate-100 flex flex-col items-center text-center shadow-xl shadow-slate-100">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6"><MessageSquare className="w-8 h-8 text-slate-300" /></div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No messages yet</h3>
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed">Your conversations with agents and tenants will appear here.</p>
      </div>
    </motion.div>
  );
};
export default Chat;
