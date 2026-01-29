import React, { useState } from 'react';
import { useReports } from '../hooks/useReports';
import {
    FileText,
    Search,
    Download,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Clock,
    Cpu,
    User,
    Loader2,
    Calendar,
    ArrowRight,
    Mail,
    Phone,
    MapPin,
    Truck
} from 'lucide-react';
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    }).format(date);
};

const formatFullDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date);
};

const GovernmentReports = () => {
    const { data: reports, isLoading, isError, error } = useReports();
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedItem, setExpandedItem] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    console.log('[Reports] Data:', reports);
    if (isError) console.error('[Reports] Error:', error);

    const filteredReports = reports?.filter(report =>
        report.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.device_uid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = async () => {
        if (!filteredReports || filteredReports.length === 0) {
            return;
        }

        setIsExporting(true);
        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const headers = [
                'Audit ID',
                'Device UID',
                'Brand',
                'Model',
                'Serial Number',
                'Category',
                'Owner Name',
                'Owner Contact',
                'Recycled Date',
                'Collector',
                'Audit Trail'
            ];

            const csvRows = [headers.join(',')];

            filteredReports.forEach(r => {
                // Get recycled date from last workflow item
                const lastStep = r.workflow?.length > 0 ? r.workflow[r.workflow.length - 1] : null;
                const recycledDate = lastStep ? new Date(lastStep.timestamp).toLocaleDateString() : 'N/A';

                // Build Audit Trail String
                const auditTrail = r.workflow?.map(w => w.to_state).join(' -> ') || 'N/A';

                const row = [
                    r.id,
                    `"${r.device_uid || ''}"`,
                    `"${r.brand || ''}"`,
                    `"${r.model || ''}"`,
                    `"${r.serial_number || ''}"`,
                    `"${r.device_type || ''}"`,
                    `"${r.owner_name || ''}"`,
                    `"${r.owner_email || ''}"`,
                    `"${recycledDate}"`,
                    `"${r.collector_name || 'System Auto-Recycled'}"`,
                    `"${auditTrail}"`
                ];
                csvRows.push(row.join(','));
            });

            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `recycle_bharat_audit_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setIsExporting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">Generating comprehensive e-waste reports...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-center max-w-md">
                    <p className="font-bold">Error Loading Reports</p>
                    <p className="text-sm opacity-80">{error?.response?.data?.message || error?.message || 'Check backend connection'}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <FileText className="text-purple-400 w-8 h-8" />
                        E-Waste Audit Report
                    </h1>
                    <p className="text-muted-foreground mt-1">Detailed lifecycle tracking of successfully recycled electronic assets.</p>
                </div>

                <button
                    onClick={handleExport}
                    disabled={isExporting || !filteredReports?.length}
                    className="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    {isExporting ? 'Exporting Audit...' : 'Export Detailed Audit'}
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card/50 border border-border p-6 rounded-2xl backdrop-blur-sm">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Recycled Items</p>
                    <h3 className="text-3xl font-black text-white">{reports?.length || 0}</h3>
                </div>
                <div className="bg-card/50 border border-border p-6 rounded-2xl backdrop-blur-sm">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Audit Compliance Rate</p>
                    <h3 className="text-3xl font-black text-emerald-400">100.0%</h3>
                </div>
                <div className="bg-card/50 border border-border p-6 rounded-2xl backdrop-blur-sm">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Average Recovery Time</p>
                    <h3 className="text-3xl font-black text-purple-400">4.2 Days</h3>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-400 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Search by Brand, Model, UID or Citizen Name..."
                    className="w-full bg-card/30 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                {filteredReports?.length === 0 ? (
                    <div className="bg-card/30 border border-dashed border-border p-12 rounded-3xl text-center">
                        <Cpu className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground font-medium">No matching recycled items found in the audit trail.</p>
                    </div>
                ) : (
                    filteredReports?.map((report) => (
                        <div
                            key={report.id}
                            className={`bg-card/40 border border-border rounded-2xl overflow-hidden transition-all duration-300 ${expandedItem === report.id ? 'ring-2 ring-purple-500/30 border-purple-500/30' : 'hover:border-white/20'}`}
                        >
                            <div
                                className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                                onClick={() => setExpandedItem(expandedItem === report.id ? null : report.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <Cpu className="text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{report.brand} {report.model}</h4>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                            <span className="text-xs font-mono text-purple-400/80">UID: {report.device_uid}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <User size={12} /> {report.owner_name}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden md:block">
                                        <p className="text-xs font-bold text-muted-foreground uppercase">Recycled On</p>
                                        <p className="text-sm text-white font-medium">
                                            {report.workflow && report.workflow.length > 0
                                                ? formatDate(report.workflow[report.workflow.length - 1].timestamp)
                                                : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-white/5 text-muted-foreground">
                                        {expandedItem === report.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Information Section */}
                            {expandedItem === report.id && (
                                <div className="px-6 py-6 border-t border-border bg-white/5">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {/* Column 1: Owner Info */}
                                        <div className="space-y-4">
                                            <h5 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                                                <User size={12} /> Owner Information
                                            </h5>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Full Name</p>
                                                    <p className="text-sm text-white font-semibold">{report.owner_name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Contact Details</p>
                                                    <div className="flex flex-col gap-1 mt-1">
                                                        <span className="text-xs text-white/80 flex items-center gap-2"><Mail size={12} className="text-purple-400" /> {report.owner_email}</span>
                                                        <span className="text-xs text-white/80 flex items-center gap-2"><Phone size={12} className="text-purple-400" /> {report.owner_phone || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Column 2: Item Info */}
                                        <div className="space-y-4">
                                            <h5 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                                                <Cpu size={12} /> Asset Details
                                            </h5>
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Item Name</p>
                                                        <p className="text-sm text-white font-semibold">{report.device_type}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Brand / Model</p>
                                                        <p className="text-sm text-white font-semibold">{report.brand} {report.model}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Serial Number / UID</p>
                                                    <p className="text-xs text-purple-200 font-mono mt-1">{report.serial_number || 'N/A'}</p>
                                                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{report.device_uid}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Column 3: Logistics */}
                                        <div className="space-y-4">
                                            <h5 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                                                <Truck size={12} /> Logistics Audit
                                            </h5>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight flex items-center gap-1"><MapPin size={10} /> Pickup Address</p>
                                                    <p className="text-xs text-white/90 leading-relaxed mt-1">{report.pickup_address || 'Address record not found'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Assigned Collector</p>
                                                    <p className="text-sm text-white font-semibold flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                        {report.collector_name || 'System Auto-Recycled'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Workflow Timeline */}
                            {expandedItem === report.id && (
                                <div className="p-6 border-t border-border bg-black/20 animate-in slide-in-from-top-2 duration-300">
                                    <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">Workflow Audit Trail</h5>

                                    <div className="relative space-y-8">
                                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border -z-10" />

                                        {report.workflow.map((step, idx) => (
                                            <div key={idx} className="flex gap-6 items-start group">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-background z-10 transition-colors ${step.to_state === 'RECYCLED' ? 'bg-emerald-500' : 'bg-purple-900 group-hover:bg-purple-700'}`}>
                                                    {step.to_state === 'RECYCLED' ? <CheckCircle2 size={18} className="text-white" /> : <Clock size={18} className="text-purple-300" />}
                                                </div>

                                                <div className="flex-1 pt-1">
                                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                                                        <div>
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight bg-white/5 text-purple-400 border border-purple-500/20 mb-1 inline-block">
                                                                {step.event_type.replace(/_/g, ' ')}
                                                            </span>
                                                            <h6 className="font-bold text-white flex items-center gap-2">
                                                                {step.from_state || 'START'} <ArrowRight size={14} className="text-muted-foreground" /> {step.to_state}
                                                            </h6>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-white font-medium">{formatFullDate(step.timestamp)}</p>
                                                            <p className="text-[10px] text-muted-foreground font-bold flex items-center justify-end gap-1">
                                                                <User size={10} /> {step.triggered_by || 'System'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {step.metadata && Object.keys(step.metadata).length > 0 && (
                                                        <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                                                            {Object.entries(step.metadata).map(([key, value]) => (
                                                                <div key={key} className="flex justify-between text-[11px]">
                                                                    <span className="text-muted-foreground capitalize font-medium">{key.replace(/_/g, ' ')}:</span>
                                                                    <span className="text-purple-300 font-bold">{String(value)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GovernmentReports;
