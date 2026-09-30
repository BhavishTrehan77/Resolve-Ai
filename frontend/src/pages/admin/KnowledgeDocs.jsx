import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentService } from '../../services/documentService';
import CategoryBadge from '../../components/CategoryBadge';
import { FolderOpen, Upload, Trash2, FileText, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';

export const KnowledgeDocs = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDocs = async () => {
    try {
      setLoading(true);
      const data = await documentService.getAllDocuments();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleDelete = async (docId) => {
    if (!window.confirm('Delete this knowledge document?')) return;
    try {
      await documentService.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d._id !== docId));
    } catch (err) {
      alert('Failed to delete document.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-blue-400" />
            Knowledge Base & RAG Documents
          </h1>
          <p className="text-xs text-slate-400">
            PDF technical manuals vectorized into MongoDB for AI Retrieval & Diagnosis
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/documents/upload')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          Upload New Document
        </button>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Loading knowledge documents...</div>
        ) : documents.length === 0 ? (
          <div className="py-16 text-center">
            <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No Documents Uploaded</p>
            <p className="text-xs text-slate-500 mt-1">Upload technical guides to power the AI retrieval agent.</p>
            <button
              onClick={() => navigate('/admin/documents/upload')}
              className="mt-4 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg"
            >
              Upload PDF
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Title / File</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4">Uploaded By</th>
                  <th className="py-3 px-4">Uploaded Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-brand-400 shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-200 block truncate">
                            {doc.title || doc.fileName}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate font-mono">
                            {doc.fileName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4"><CategoryBadge category={doc.category} /></td>
                    <td className="py-3.5 px-4">
                      {doc.status === 'PROCESSED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          PROCESSED
                        </span>
                      ) : doc.status === 'PROCESSING' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          PROCESSING
                        </span>
                      ) : doc.status === 'FAILED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          <AlertCircle className="w-3 h-3" />
                          FAILED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          <Clock className="w-3 h-3" />
                          {doc.status || 'UPLOADED'}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {doc.uploadedBy?.name || 'Admin'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

export default KnowledgeDocs;
