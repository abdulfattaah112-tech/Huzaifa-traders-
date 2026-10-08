import React, { useState, useMemo, useEffect } from 'react';
import { Download, FileText, Printer, Trash2, Search, Calendar, ChevronLeft, ChevronRight, AlertTriangle, Database, DollarSign, TrendingUp, ShoppingBag, Package, PackageX, Inbox } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format, isWithinInterval, subDays, startOfWeek, startOfMonth, parseISO } from 'date-fns';

const AnimatedCounter = ({ value, prefix = "", suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    if (start === end || isNaN(end)) {
      setCount(end || 0);
      return;
    }
    
    const duration = 1000;
    const incrementTime = 30;
    const steps = duration / incrementTime;
    const increment = end / steps;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{count.toFixed(decimals)}{suffix}</span>;
};

export default function HistoryDashboard({ history, fetchHistory, supabase, t, products = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 10;

  const stats = useMemo(() => {
    const historyStats = history.reduce((acc, curr) => ({
      records: acc.records + 1,
      sales: acc.sales + Number(curr.salesAmount || 0),
      earnings: acc.earnings + Number(curr.earnings || 0),
      itemsSold: acc.itemsSold + Number(curr.totalItemsSold || 0),
    }), { records: 0, sales: 0, earnings: 0, itemsSold: 0 });

    return {
      ...historyStats,
      stock: products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0),
      outOfStock: products.filter(p => (Number(p.stock) || 0) === 0).length
    };
  }, [history, products]);

  const filteredHistory = useMemo(() => {
    let filtered = history;
    const today = new Date();
    if (dateFilter === 'today') {
      filtered = filtered.filter(h => h.date === format(today, 'yyyy-MM-dd'));
    } else if (dateFilter === 'week') {
      filtered = filtered.filter(h => isWithinInterval(parseISO(h.date), { start: startOfWeek(today), end: today }));
    } else if (dateFilter === 'month') {
      filtered = filtered.filter(h => isWithinInterval(parseISO(h.date), { start: startOfMonth(today), end: today }));
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(h => 
        h.date.includes(lowerSearch) || 
        (h.soldItems && h.soldItems.some(item => item.name.toLowerCase().includes(lowerSearch)))
      );
    }
    return filtered;
  }, [history, searchTerm, dateFilter]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
  const paginatedHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this history record?")) {
      await supabase.from('history').delete().eq('id', id);
      fetchHistory();
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete ALL history? This action cannot be undone.")) {
      await supabase.from('history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      fetchHistory();
    }
  };

  const exportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      const doc = new jsPDF();
      doc.text("History Report", 14, 15);
      const tableColumn = ["Date", "Day", "Stock", "Sold", "Sales", "Earnings", "Out of Stock"];
      const tableRows = filteredHistory.map(h => [
        h.date, h.day, h.totalStock, h.totalItemsSold, h.salesAmount, h.earnings, h.outOfStockItems
      ]);
      doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
      doc.save("history_report.pdf");
      setIsExporting(false);
    }, 500);
  };

  const exportExcel = () => {
    setIsExporting(true);
    setTimeout(() => {
      const worksheet = XLSX.utils.json_to_sheet(filteredHistory);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "History");
      XLSX.writeFile(workbook, "history_report.xlsx");
      setIsExporting(false);
    }, 500);
  };

  const printReport = () => {
    window.print();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="history-dashboard-modern animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '100%', overflowX: 'hidden', margin: '0 auto', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' }}>
      
      <style>{`
        .history-dashboard-modern {
          --radius-main: 18px;
          --shadow-soft: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
          --shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .action-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .btn-modern {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-main);
          font-weight: 600;
          font-size: 0.9rem;
          transition: var(--transition);
          cursor: pointer;
          border: none;
        }

        .btn-modern:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
        
        .btn-white {
          background: white;
          color: #374151;
          border: 1px solid #E5E7EB;
        }
        .btn-white:hover {
          border-color: #D1D5DB;
          background: #F9FAFB;
        }

        .btn-danger {
          background: linear-gradient(135deg, #EF4444, #DC2626);
          color: white;
        }
        .btn-danger:hover {
          background: linear-gradient(135deg, #DC2626, #B91C1C);
        }

        .stats-grid-modern {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card-modern {
          padding: 1.5rem;
          border-radius: var(--radius-main);
          box-shadow: var(--shadow-soft);
          transition: var(--transition);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          background-color: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: var(--text-main);
        }

        .stat-card-modern:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-hover);
        }
        
        .stat-icon {
          position: absolute;
          inset-inline-end: -10px;
          bottom: -10px;
          opacity: 0.1;
        }
        
        .stat-icon-top {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .filter-section {
          background: white;
          padding: 1.25rem;
          border-radius: var(--radius-main);
          box-shadow: var(--shadow-soft);
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: center;
          box-sizing: border-box;
        }

        .input-group {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        .input-modern {
          width: 100%;
          padding: 0.875rem 1rem;
          padding-inline-start: 2.75rem;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: var(--transition);
          background: #F9FAFB;
          outline: none;
          box-sizing: border-box;
        }
        
        .input-modern:focus {
          background: white;
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .select-modern {
          width: 100%;
          padding: 0.875rem 1rem;
          padding-inline-start: 2.5rem;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          background: #F9FAFB;
          font-size: 0.95rem;
          outline: none;
          cursor: pointer;
          transition: var(--transition);
          appearance: none;
          box-sizing: border-box;
        }
        
        .select-modern:focus {
          border-color: #3B82F6;
        }

        .table-modern-wrapper {
          background: white;
          border-radius: var(--radius-main);
          box-shadow: var(--shadow-soft);
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }
        
        .table-modern {
          width: 100%;
          border-collapse: collapse;
          text-align: start;
        }
        
        .table-modern th {
          background: #F9FAFB;
          padding: 1.25rem 1rem;
          font-weight: 600;
          color: #4B5563;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #E5E7EB;
        }

        .table-modern td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid #F3F4F6;
          color: #1F2937;
          font-size: 0.9rem;
          transition: var(--transition);
        }
        
        .table-modern tbody tr:hover td {
          background: #F9FAFB;
        }

        .empty-state-modern {
          padding: 5rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: white;
          border-radius: var(--radius-main);
          box-shadow: var(--shadow-soft);
        }

        .empty-icon-wrapper {
          width: 80px;
          height: 80px;
          background: #EEF2FF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: #4F46E5;
        }

        @media (max-width: 768px) {
          .action-btns {
            width: 100%;
            justify-content: space-between;
          }
          .btn-modern {
            flex: 1 1 45%;
            font-size: 0.85rem;
            padding: 0.75rem 0.5rem;
          }
          .header-section {
            flex-direction: column;
            align-items: flex-start;
          }
          .input-group, .select-wrapper {
            width: 100%;
            min-width: 100% !important;
          }
        }
        
        @media print {
          body * {
            visibility: hidden;
          }
          .history-dashboard-modern, .history-dashboard-modern * {
            visibility: visible;
          }
          .history-dashboard-modern {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .table-modern-wrapper, .table-modern-wrapper > div {
            overflow: visible !important;
            overflow-x: visible !important;
            box-shadow: none !important;
          }
          .header-section, .filter-section, .stats-grid-modern, .pagination-modern, .action-btns {
            display: none !important;
          }
          .table-modern th:nth-child(1),
          .table-modern td:nth-child(1) {
            display: none !important;
          }
          .table-modern {
            width: 100% !important;
            font-size: 11px !important;
          }
          .table-modern tr {
            page-break-inside: avoid;
          }
          @page {
            size: landscape;
            margin: 1cm;
          }
        }
      `}</style>

      {/* Header & Actions */}
      <div className="header-section">
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>History Dashboard</h2>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Overview and management of your store's performance.</p>
        </div>
        
        <div className="action-btns">
          <button className="btn-modern btn-white" onClick={exportPDF} disabled={isExporting}>
            {isExporting ? <AlertTriangle size={18} className="animate-spin" /> : <FileText size={18} color="#4B5563" />}
            {isExporting ? 'Exporting...' : 'PDF'}
          </button>
          <button className="btn-modern btn-white" onClick={exportExcel} disabled={isExporting}>
            {isExporting ? <AlertTriangle size={18} className="animate-spin" /> : <Download size={18} color="#4B5563" />}
            {isExporting ? 'Exporting...' : 'Excel'}
          </button>
          <button className="btn-modern btn-white" onClick={printReport}>
            <Printer size={18} color="#4B5563" /> Print
          </button>
          <button className="btn-modern btn-danger" onClick={handleDeleteAll}>
            <Trash2 size={18} /> Delete All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid-modern">
        
        {/* Total Records */}
        <div className="stat-card-modern" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white' }}>
          <Database size={100} className="stat-icon" />
          <div className="stat-icon-top" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <Database size={20} />
          </div>
          <h3 style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 500 }}>Total Records</h3>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: 'auto' }}>
            <AnimatedCounter value={stats.records} />
          </p>
        </div>

        {/* Total Sales */}
        <div className="stat-card-modern" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white' }}>
          <DollarSign size={100} className="stat-icon" />
          <div className="stat-icon-top" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <DollarSign size={20} />
          </div>
          <h3 style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 500 }}>Total Sales</h3>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: 'auto' }}>
            {t ? t("rs") : "Rs"} <AnimatedCounter value={stats.sales} decimals={2} />
          </p>
        </div>

        {/* Total Earnings */}
        <div className="stat-card-modern" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white' }}>
          <TrendingUp size={100} className="stat-icon" />
          <div className="stat-icon-top" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <TrendingUp size={20} />
          </div>
          <h3 style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 500 }}>Total Earnings</h3>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: 'auto' }}>
            {t ? t("rs") : "Rs"} <AnimatedCounter value={stats.earnings} decimals={2} />
          </p>
        </div>

        {/* Items Sold */}
        <div className="stat-card-modern">
          <ShoppingBag size={100} className="stat-icon" style={{ opacity: 0.05, color: 'var(--text-main)' }} />
          <div className="stat-icon-top" style={{ background: 'var(--bg-color)', color: 'var(--text-muted)' }}>
            <ShoppingBag size={20} />
          </div>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Items Sold</h3>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 'auto' }}>
            <AnimatedCounter value={stats.itemsSold} />
          </p>
        </div>

        {/* Current Stock */}
        <div className="stat-card-modern">
          <Package size={100} className="stat-icon" style={{ opacity: 0.05, color: 'var(--text-main)' }} />
          <div className="stat-icon-top" style={{ background: 'var(--bg-color)', color: 'var(--text-muted)' }}>
            <Package size={20} />
          </div>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Current Stock</h3>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 'auto' }}>
            <AnimatedCounter value={stats.stock} />
          </p>
        </div>

        {/* Out of Stock */}
        <div className="stat-card-modern">
          <PackageX size={100} className="stat-icon" style={{ opacity: 0.05, color: '#DC2626' }} />
          <div className="stat-icon-top" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626' }}>
            <PackageX size={20} />
          </div>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Out of Stock</h3>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, color: '#DC2626', marginTop: 'auto' }}>
            <AnimatedCounter value={stats.outOfStock} />
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <div className="input-group">
          <Search size={18} color="#9CA3AF" style={{ position: 'absolute', insetInlineStart: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
          <input 
            type="text" 
            className="input-modern"
            placeholder="Search by date or item name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="select-wrapper" style={{ position: 'relative', display: 'flex', flex: 1, minWidth: '160px' }}>
          <Calendar size={18} color="#9CA3AF" style={{ position: 'absolute', insetInlineStart: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
          <select 
            className="select-modern" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {(searchTerm || dateFilter !== 'all') && (
          <button onClick={clearFilters} style={{ padding: '0.875rem 1.5rem', background: '#F3F4F6', color: '#4B5563', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.background='#E5E7EB'} onMouseOut={e=>e.currentTarget.style.background='#F3F4F6'}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {paginatedHistory.length > 0 ? (
        <div className="table-modern-wrapper">
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="table-modern">
              <thead>
                <tr>
                  <th style={{ width: '60px', textAlign: 'center' }}>Action</th>
                  <th style={{ textAlign: 'start' }}>Date</th>
                  <th style={{ textAlign: 'start' }}>Day</th>
                  <th style={{ textAlign: 'center' }}>Total Stock</th>
                  <th style={{ textAlign: 'center' }}>Items Sold</th>
                  <th style={{ textAlign: 'start' }}>Sold Items</th>
                  <th style={{ textAlign: 'end' }}>Sales Amount</th>
                  <th style={{ textAlign: 'end' }}>Earnings</th>
                  <th style={{ textAlign: 'center' }}>Out of Stock</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.map((h) => (
                  <tr key={h.id}>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => handleDelete(h.id)} 
                        title="Delete Record" 
                        style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '0.6rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'inline-flex', transition: 'all 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = '#FCA5A5'}
                        onMouseOut={e => e.currentTarget.style.background = '#FEE2E2'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                    <td style={{ fontWeight: 600, textAlign: 'start' }}>{h.date}</td>
                    <td style={{ color: '#6B7280', textAlign: 'start' }}>{h.day}</td>
                    <td style={{ textAlign: 'center', fontWeight: 500 }}>{h.totalStock}</td>
                    <td style={{ textAlign: 'center', fontWeight: 500 }}>{h.totalItemsSold}</td>
                    <td style={{ textAlign: 'start' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {h.soldItems && h.soldItems.map((item, idx) => (
                          <span key={idx} style={{ background: '#F3F4F6', color: '#374151', fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontWeight: 500 }}>
                            {item.name} <strong style={{color: 'var(--primary)'}}>x{item.quantity}</strong>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ textAlign: 'end', fontWeight: 700, color: '#1F2937' }}>
                      {t ? t("rs") : "Rs"} {Number(h.salesAmount).toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'end', fontWeight: 700, color: '#10B981' }}>
                      {t ? t("rs") : "Rs"} {Number(h.earnings).toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ 
                        background: h.outOfStockItems > 0 ? '#FEE2E2' : '#D1FAE5',
                        color: h.outOfStockItems > 0 ? '#DC2626' : '#059669',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}>
                        {h.outOfStockItems}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderTop: '1px solid #E5E7EB', background: 'white', flexWrap: 'wrap', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredHistory.length)}</strong> of <strong>{filteredHistory.length}</strong> results
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => p - 1)}
                  style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', background: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center' }}
                >
                  <ChevronLeft size={20} color="#4B5563" />
                </button>
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(p => p + 1)}
                  style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', background: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, display: 'flex', alignItems: 'center' }}
                >
                  <ChevronRight size={20} color="#4B5563" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="empty-state-modern animate-slide-down">
          <div className="empty-icon-wrapper">
            <Inbox size={40} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F2937', marginBottom: '0.5rem' }}>No Sales History Yet</h3>
          <p style={{ color: '#6B7280', fontSize: '1rem', maxWidth: '400px', lineHeight: '1.6' }}>
            Your sales history will appear here after your first completed order. Try adjusting the filters if you're looking for something specific.
          </p>
        </div>
      )}
    </div>
  );
}
