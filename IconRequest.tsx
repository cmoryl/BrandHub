
import React, { useState } from 'react';
import { Send, CheckCircle2, PenTool, Loader2 } from 'lucide-react';
import { Brand } from '../types';

interface IconRequestProps {
  brand: Brand;
}

const IconRequest: React.FC<IconRequestProps> = ({ brand }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    style: 'Outlined'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Request Sent</h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
          The design team will review your request for the <strong>{formData.name}</strong> icon.
        </p>
        <button 
          onClick={() => { setIsSuccess(false); setFormData({ name: '', description: '', style: 'Outlined' }); }}
          className="text-emerald-700 dark:text-emerald-400 font-medium hover:underline text-xs"
        >
          Request another icon
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
          <PenTool className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white">Request New Icon</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Icon Name
            </label>
            <input
                required
                type="text"
                placeholder="e.g. Shopping Cart"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
            />
        </div>

        <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Visual Description
            </label>
            <textarea
                required
                rows={2}
                placeholder="Describe the shape and metaphor..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 resize-none"
            />
        </div>

        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isSubmitting ? 'Sending...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default IconRequest;
