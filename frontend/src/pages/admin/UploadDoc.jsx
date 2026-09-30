import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentService } from '../../services/documentService';
import { Upload, ArrowLeft, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'NETWORK',
  'HARDWARE',
  'SOFTWARE',
  'DATABASE',
  'SECURITY',
  'ACCESS',
  'CLOUD',
  'OTHER',
];

export const UploadDoc = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('SOFTWARE');
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a PDF document to upload.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title || file.name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('file', file);

      await documentService.uploadDocument(formData);
      navigate('/admin/documents');
    } catch (err) {
      console.error('Upload error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to upload and vectorize document.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
          <div className="p-3 bg-brand-500/20 text-brand-400 rounded-xl border border-brand-500/30">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Upload Knowledge Document</h1>
            <p className="text-xs text-slate-400">
              PDF contents are automatically extracted and vectorized into MongoDB Vector Search
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Document Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cisco VPN Setup & Troubleshooting Guide"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of this SOP, policies, or troubleshooting manual..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          {/* PDF File Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              PDF File <span className="text-rose-400">*</span>
            </label>
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-brand-500/50 transition-colors bg-slate-950/50">
              <input
                type="file"
                accept=".pdf"
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <FileText className="w-10 h-10 text-brand-400 mx-auto mb-2" />
                {file ? (
                  <p className="text-sm font-semibold text-slate-200">{file.name}</p>
                ) : (
                  <>
                    <p className="text-xs font-medium text-slate-300">Click to select a PDF manual</p>
                    <p className="text-[11px] text-slate-500 mt-1">PDF up to 10MB</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Extracting & Vectorizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Upload & Vectorize</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDoc;
