import React, { useState } from 'react';
import {
  Database,
  FileText,
  FileUp,
  Folder,
  Search,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Filter,
  Download,
  BookOpen
} from 'lucide-react';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const KnowledgePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('doc-1');

  const tabs = [
    { id: 'documents', label: 'Documents', count: 2341 },
    { id: 'datasets', label: 'Datasets', count: 56 },
    { id: 'links', label: 'Links', count: 18 },
    { id: 'notes', label: 'Notes', count: 124 }
  ];

  // Documents table data matching View 5 in the design reference
  const documents = [
    {
      id: 'doc-1',
      name: 'Q1_Financial_Report.pdf',
      folder: '/Finance/Reports',
      type: 'PDF',
      size: '2.4 MB',
      uploadedOn: 'May 20, 2024',
      uploadedAt: 'May 20, 2024 10:30 AM',
      uploadedBy: 'Tharun',
      pages: 12,
      status: 'Indexed',
      chunks: 48
    },
    {
      id: 'doc-2',
      name: 'HR_Policies_2024.pdf',
      folder: '/HR/Policies',
      type: 'PDF',
      size: '1.8 MB',
      uploadedOn: 'May 18, 2024',
      uploadedAt: 'May 18, 2024 02:15 PM',
      uploadedBy: 'Sarah Johnson',
      pages: 24,
      status: 'Indexed',
      chunks: 82
    },
    {
      id: 'doc-3',
      name: 'Company_Handbook.pdf',
      folder: '/General',
      type: 'PDF',
      size: '3.2 MB',
      uploadedOn: 'May 15, 2024',
      uploadedAt: 'May 15, 2024 11:00 AM',
      uploadedBy: 'Tharun',
      pages: 45,
      status: 'Indexed',
      chunks: 140
    },
    {
      id: 'doc-4',
      name: 'Market_Analysis_May.pdf',
      folder: '/Market/Reports',
      type: 'PDF',
      size: '2.7 MB',
      uploadedOn: 'May 14, 2024',
      uploadedAt: 'May 14, 2024 04:45 PM',
      uploadedBy: 'Jessica Davis',
      pages: 18,
      status: 'Indexed',
      chunks: 64
    },
    {
      id: 'doc-5',
      name: 'Legal_Contracts.zip',
      folder: '/Legal/Contracts',
      type: 'ZIP',
      size: '6.4 MB',
      uploadedOn: 'May 10, 2024',
      uploadedAt: 'May 10, 2024 09:20 AM',
      uploadedBy: 'Michael Brown',
      pages: 60,
      status: 'Indexed',
      chunks: 210
    }
  ];

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary-400" />
            Knowledge Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise document storage, semantic indexing, chunking strategy, and vector embeddings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" leftIcon={<FileUp className="w-4 h-4" />}>
            Upload Document
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Search & Folder Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-200 border border-card-border rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-200 border border-card-border rounded-xl text-xs text-slate-300 cursor-pointer">
            <Folder className="w-3.5 h-3.5 text-primary-400" />
            <span>All Folders</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Main Grid: Document Table (8 Cols) + Document Details Card (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table View */}
        <div className="lg:col-span-8 glass-card rounded-2xl border border-card-border overflow-hidden shadow-glow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-300 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-card-border">
                <tr>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4">Uploaded On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/60">
                {documents.map((doc) => {
                  const isSelected = selectedDocId === doc.id;
                  return (
                    <tr
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary-950/40 border-l-2 border-primary-500' : 'hover:bg-surface-200/50'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-surface-100 border border-card-border text-primary-400 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100">{doc.name}</div>
                            <div className="text-[10px] text-slate-400">{doc.folder}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="cyan" size="sm">
                          {doc.type}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">{doc.size}</td>
                      <td className="py-3.5 px-4 text-slate-400">{doc.uploadedOn}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Details Card matching View 5 right pane */}
        <div className="lg:col-span-4 glass-card p-5 rounded-2xl border border-card-border flex flex-col justify-between shadow-glow-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-card-border/80">
              <h3 className="text-xs font-semibold text-slate-200">Document Details</h3>
              <Badge variant="emerald" size="sm" dot>
                {selectedDoc.status}
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-200 border border-card-border">
                <div className="font-semibold text-slate-100 break-all">{selectedDoc.name}</div>
                <div className="text-[11px] text-primary-400 mt-0.5">{selectedDoc.folder}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Uploaded By</span>
                  <div className="font-medium text-slate-200 mt-0.5">{selectedDoc.uploadedBy}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Pages</span>
                  <div className="font-medium text-slate-200 mt-0.5">{selectedDoc.pages} Pages</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">File Size</span>
                  <div className="font-medium text-slate-200 mt-0.5">{selectedDoc.size}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Vector Chunks</span>
                  <div className="font-medium text-slate-200 mt-0.5">{selectedDoc.chunks} Chunks</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Uploaded On</span>
                <div className="font-medium text-slate-200 mt-0.5">{selectedDoc.uploadedAt}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-card-border/80">
            <Button
              variant="primary"
              className="w-full"
              size="sm"
              leftIcon={<BookOpen className="w-4 h-4" />}
            >
              Open in Viewer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
