import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [showLogs, setShowLogs] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const currentUsername = localStorage.getItem('username');

    const fetchUsers = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const decoded = jwtDecode(token);
            if (decoded.role !== 'ROLE_ADMIN') {
                navigate('/dashboard');
                return;
            }

            const res = await api.get('/admin/users');
            setUsers(res.data);
            setLoading(false);
            setError(null);
        } catch (err) {
            setError("Security Server Connection Failed.");
            setLoading(false);
            if (err.response?.status === 403) navigate('/dashboard');
        }
    }, [navigate]);

    const fetchLogs = async () => {
        try {
            const res = await api.get('/admin/audit-logs');
            setLogs(res.data.reverse());
            setShowLogs(true);
        } catch (err) {
            alert("Failed to retrieve security audit trail.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const toggleStatus = async (user) => {
        if (user.username === currentUsername) {
            alert("⚠️ SYSTEM PROTECT: You cannot revoke your own administrative access.");
            return;
        }

        const action = user.enabled ? "REVOKE ACCESS" : "RESTORE ACCESS";
        if (window.confirm(`CONFIRM SECURITY OVERRIDE: ${action} for ${user.username}?`)) {
            try {
                await api.put(`/admin/users/${user.id}/status`);
                fetchUsers(); 
            } catch (err) {
                alert("Override Failed: " + (err.response?.data || "Server Error"));
            }
        }
    };

    if (loading) return (
        <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p style={{marginTop: '15px', fontWeight: '500'}}>Initializing Secure Console...</p>
        </div>
    );

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.brandGroup}>
                    <div style={styles.logoSquare}>AG</div>
                    <h1 style={styles.title}>APIGuardian <span style={styles.subtitle}>Admin Console</span></h1>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={fetchLogs} style={styles.logsBtn}>
                        Audit Logs
                    </button>
                    <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
                        Exit Console
                    </button>
                </div>
            </header>

            <main style={styles.content}>
                {error && <div style={styles.errorBanner}>{error}</div>}
                
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <div>
                            <h2 style={styles.cardTitle}>Identity & Access Management</h2>
                            <p style={styles.cardSub}>Manage global user registry and security overrides</p>
                        </div>
                        <div style={styles.badge}>{users.length} Active Identities</div>
                    </div>
                    
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Identity</th>
                                    <th style={styles.th}>Email Address</th>
                                    <th style={styles.th}>Security Role</th>
                                    <th style={styles.th}>System Status</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} style={styles.tr}>
                                        <td style={styles.td}>
                                            <div style={styles.userCell}>
                                                <div style={styles.avatar}>{u.username[0].toUpperCase()}</div>
                                                <div>
                                                    <div style={{fontWeight: '600', color: '#0f172a'}}>{u.username}</div>
                                                    {u.username === currentUsername && <span style={styles.meTag}>Currently Active</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={styles.td}>{u.email || '—'}</td>
                                        <td style={styles.td}>
                                            <span style={u.role === 'ROLE_ADMIN' ? styles.adminLabel : styles.userLabel}>
                                                {u.role.replace('ROLE_', '')}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={u.enabled ? styles.statusActive : styles.statusBanned}>
                                                <span style={styles.dot}></span>
                                                {u.enabled ? "Authorized" : "Revoked"}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <button 
                                                onClick={() => toggleStatus(u)} 
                                                style={u.enabled ? styles.revokeBtn : styles.restoreBtn}
                                            >
                                                {u.enabled ? "Revoke" : "Restore"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {showLogs && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.cardTitle}>🛡️ Security Audit History</h2>
                            <button onClick={() => setShowLogs(false)} style={styles.closeBtn}>&times;</button>
                        </div>
                        <div style={styles.modalBody}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Timestamp</th>
                                        <th style={styles.th}>Actor</th>
                                        <th style={styles.th}>Action</th>
                                        <th style={styles.th}>Target</th>
                                        <th style={styles.th}>IP Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id} style={styles.tr}>
                                            <td style={styles.td}>{new Date(log.timestamp).toLocaleString()}</td>
                                            <td style={styles.td}><code style={styles.code}>{log.actor}</code></td>
                                            <td style={styles.td}>
                                                <span style={log.action.includes('REVOKED') ? styles.statusBanned : styles.statusActive}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td style={styles.td}><strong>{log.target}</strong></td>
                                            <td style={styles.td}><small style={{color: '#94a3b8'}}>{log.ipAddress}</small></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { backgroundColor: '#f8fafc', minHeight: '100vh', color: '#334155', fontFamily: "'Inter', sans-serif" },
    loading: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6366f1' },
    spinner: { width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', borderBottom: '1px solid #e2e8f0', background: '#ffffff', position: 'sticky', top: 0, zIndex: 10 },
    brandGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
    logoSquare: { backgroundColor: '#6366f1', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px' },
    title: { fontSize: '18px', fontWeight: '700', margin: 0, color: '#0f172a' },
    subtitle: { color: '#64748b', fontWeight: '400', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', marginLeft: '8px', borderLeft: '1px solid #e2e8f0', paddingLeft: '8px' },
    backBtn: { background: '#ffffff', border: '1px solid #e2e8f0', color: '#64748b', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
    logsBtn: { background: '#6366f1', border: '1px solid #6366f1', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
    content: { padding: '40px 48px', maxWidth: '1400px', margin: '0 auto' },
    card: { background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
    cardTitle: { fontSize: '20px', margin: 0, fontWeight: '700', color: '#0f172a' },
    cardSub: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
    badge: { background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '12px 16px', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #f1f5f9' },
    tr: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '16px', fontSize: '14px', color: '#475569' },
    userCell: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: { width: '36px', height: '36px', background: '#e0e7ff', color: '#4338ca', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' },
    meTag: { fontSize: '11px', color: '#6366f1', fontWeight: '600' },
    adminLabel: { color: '#b45309', background: '#fffbeb', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', border: '1px solid #fde68a' },
    userLabel: { color: '#475569', background: '#f8fafc', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', border: '1px solid #e2e8f0' },
    statusActive: { color: '#059669', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' },
    statusBanned: { color: '#dc2626', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' },
    dot: { width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' },
    revokeBtn: { background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
    restoreBtn: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
    modalContent: { background: '#ffffff', width: '90%', maxWidth: '1100px', borderRadius: '20px', padding: '32px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    closeBtn: { background: 'none', border: 'none', color: '#94a3b8', fontSize: '28px', cursor: 'pointer' },
    code: { background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', color: '#475569' }
};

export default AdminDashboard;