import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Internal component for the Guide tab
const IntegrationGuide = () => (
    <div style={{ color: '#475569' }}>
        <h3 style={{ color: '#0f172a', marginBottom: '16px' }}>🚀 Quick Start Guide</h3>
        <p style={{ fontSize: '14px', marginBottom: '10px' }}>To secure your API, include your generated key in the header of every request:</p>
        <pre style={{ 
            background: '#0f172a', 
            color: '#f8fafc', 
            padding: '20px', 
            borderRadius: '12px', 
            fontSize: '13px',
            fontFamily: 'monospace',
            overflowX: 'auto'
        }}>
{`curl -X GET "https://api.apiguardian.io/v1/data" \\
  -H "X-API-KEY: your_generated_key_here"`}
        </pre>
        <div style={{ marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
            <p>• <strong>Rate Limiting:</strong> Requests exceeding your daily limit will return a 429 status code.</p>
            <p>• <strong>Security:</strong> Never share your keys. If compromised, revoke them immediately.</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [keys, setKeys] = useState([]);
    const [logs, setLogs] = useState([]);
    const [usageStats, setUsageStats] = useState({ current: 0, limit: 100, percent: 0, plan: 'FREE' });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // Decode role from JWT
    let userRole = null;
    try {
        if (token) {
            const decoded = jwtDecode(token);
            userRole = decoded.role;
        }
    } catch (err) {
        console.error("Auth Token Invalid");
    }

    const fetchDashboardData = useCallback(async () => {
        try {
            const results = await Promise.allSettled([
                api.get(`/keys/user/${username}`),
                api.get(`/usage/my-stats`), 
                api.get(`/logs/recent/${username}`)
            ]);
            
            if (results[0].status === 'fulfilled') setKeys(results[0].value.data || []);
            if (results[1].status === 'fulfilled') setUsageStats(results[1].value.data || { current: 0, limit: 100, percent: 0, plan: 'FREE' });
            if (results[2].status === 'fulfilled') setLogs(results[2].value.data || []);
            
            setLoading(false);
        } catch (error) {
            console.error("Critical Dashboard Error:", error);
            if (error.response?.status === 403 || error.response?.status === 401) {
                localStorage.clear();
                navigate('/');
            }
            setLoading(false);
        }
    }, [username, navigate]);

    useEffect(() => {
        if (!username) {
            navigate('/');
            return;
        }
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 10000); 
        return () => clearInterval(interval);
    }, [username, navigate, fetchDashboardData]);

    const handleCopy = (keyValue, id) => {
        navigator.clipboard.writeText(keyValue);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const generateKey = async () => {
        setActionLoading(true);
        try {
            await api.post(`/keys/generate/${username}`);
            await fetchDashboardData();
        } catch (error) { 
            alert("Key Generation Failed: Check your plan limits."); 
        } finally {
            setActionLoading(false);
        }
    };

    const deleteKey = async (id) => {
        if (window.confirm("SYSTEM WARNING: Revoking this key will immediately disconnect any active integrations. Continue?")) {
            try {
                await api.delete(`/keys/delete/${id}`);
                fetchDashboardData();
            } catch (error) { 
                alert("Revocation failed."); 
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) return (
        <div style={styles.loadingContainer}>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            <div style={styles.loader}></div>
            <p style={{fontWeight: '500'}}>Synchronizing Guardian Systems...</p>
        </div>
    );

    return (
        <div style={styles.container}>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            
            <div style={{...styles.blob, ...styles.blob1}}></div>
            <div style={{...styles.blob, ...styles.blob2}}></div>

            <header style={styles.header}>
                <div style={styles.brandGroup}>
                    <div style={styles.logoSquare}>AG</div>
                    <h1 style={styles.headerTitle}>ApiGuardian <span style={styles.headerSubtitle}>Portal</span></h1>
                </div>

                <div style={styles.userActions}>
                    {/* UPGRADE PROMPT: Only visible to Free Plan users */}
                    {usageStats.plan === 'FREE' && (
                        <Link to="/upgrade" style={styles.upgradeLink} title="Upgrade Plan">
                            ✨ Upgrade to Pro
                        </Link>
                    )}

                    {userRole === 'ROLE_ADMIN' && (
                        <button onClick={() => navigate('/admindashboard')} style={styles.adminBtn}>🛡️ ADMIN PANEL</button>
                    )}

                    <div style={styles.userBadge}>
                        <span style={styles.onlineIndicator}></span>
                        {username}
                    </div>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
                </div>
            </header>

            <main style={styles.content}>
                <div style={styles.tabNav}>
                    <button 
                        onClick={() => setActiveTab('overview')} 
                        style={activeTab === 'overview' ? styles.activeTab : styles.tab}
                    >
                        Security Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('guide')} 
                        style={activeTab === 'guide' ? styles.activeTab : styles.tab}
                    >
                        Integration Guide
                    </button>
                </div>

                {activeTab === 'overview' ? (
                    <>
                        <section style={styles.usageSection}>
                            <div style={styles.usageInfo}>
                                <div>
                                    <h2 style={styles.sectionTitle}>API Traffic Monitoring</h2>
                                    <span style={{
                                        ...styles.planBadge,
                                        backgroundColor: usageStats.plan === 'PRO' ? '#8b5cf6' : '#64748b'
                                    }}>
                                        {usageStats.plan} PLAN
                                    </span>
                                </div>
                                <span style={styles.usageCount}>
                                    <strong>{usageStats.current.toLocaleString()}</strong> 
                                    <span style={styles.dimText}> / {usageStats.limit.toLocaleString()} Daily Requests</span>
                                </span>
                            </div>
                            <div style={styles.progressBarBg}>
                                <div style={{
                                    ...styles.progressBarFill,
                                    width: `${Math.min(usageStats.percent, 100)}%`,
                                    backgroundColor: usageStats.percent >= 90 ? '#ef4444' : '#6366f1',
                                }}></div>
                            </div>
                        </section>

                        <div style={styles.grid}>
                            <section style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <h2 style={styles.cardTitle}>Active Security Keys</h2>
                                    <button 
                                        onClick={generateKey} 
                                        disabled={actionLoading}
                                        style={{...styles.primaryBtn, opacity: actionLoading ? 0.7 : 1}}
                                    >
                                        {actionLoading ? 'Generating...' : '+ Create New Key'}
                                    </button>
                                </div>
                                <div style={styles.tableScroll}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>Key Value</th>
                                                <th style={styles.th}>Status</th>
                                                <th style={styles.th}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {keys.length > 0 ? keys.map(key => (
                                                <tr key={key.id} style={styles.tableRow}>
                                                    <td 
                                                        style={{
                                                            ...styles.keyCell, 
                                                            color: copiedId === key.id ? '#10b981' : '#4f46e5' 
                                                        }}
                                                        onClick={() => handleCopy(key.keyValue, key.id)}
                                                    >
                                                        <code>{copiedId === key.id ? '✓ Copied' : `${key.keyValue.substring(0, 12)}...`}</code>
                                                    </td>
                                                    <td>
                                                        <span style={key.active ? styles.statusActive : styles.statusInactive}>
                                                            {key.active ? 'Active' : 'Revoked'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button onClick={() => deleteKey(key.id)} style={styles.revokeBtn}>Revoke</button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="3" style={{textAlign: 'center', padding: '20px', color: '#94a3b8'}}>No active keys.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section style={styles.card}>
                                <h2 style={styles.cardTitle}>Live Incident Logs</h2>
                                <div style={styles.logContainer}>
                                    {logs.length > 0 ? logs.map((log, index) => (
                                        <div key={index} style={styles.logRow}>
                                            <div style={styles.logInfo}>
                                                <span style={{
                                                    ...styles.statusCode,
                                                    color: log.statusCode < 400 ? '#10b981' : '#ef4444'
                                                }}>{log.statusCode}</span>
                                                <span style={styles.logPath}>{log.endpoint}</span>
                                            </div>
                                            <span style={styles.logTime}>
                                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    )) : <div style={styles.dimText}>No recent traffic.</div>}
                                </div>
                            </section>
                        </div>
                    </>
                ) : (
                    <div style={styles.guideWrapper}>
                        <IntegrationGuide />
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    container: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#1e293b', position: 'relative', overflowX: 'hidden' },
    loadingContainer: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6366f1' },
    loader: { border: '4px solid #f3f3f3', borderTop: '4px solid #6366f1', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', marginBottom: '10px' },
    blob: { position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.1, zIndex: 0 },
    blob1: { width: '500px', height: '500px', background: '#818cf8', top: '-10%', right: '-5%' },
    blob2: { width: '400px', height: '400px', background: '#38bdf8', bottom: '-10%', left: '-5%' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #e2e8f0', zIndex: 10, position: 'relative' },
    brandGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
    logoSquare: { backgroundColor: '#6366f1', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' },
    headerTitle: { fontSize: '18px', fontWeight: '700', margin: 0, color: '#0f172a' },
    headerSubtitle: { fontWeight: '400', color: '#64748b' },
    userActions: { display: 'flex', alignItems: 'center', gap: '20px' },
    upgradeLink: { textDecoration: 'none', fontSize: '12px', fontWeight: '700', color: '#6366f1', backgroundColor: '#eef2ff', padding: '8px 16px', borderRadius: '8px', border: '1px solid #c7d2fe', transition: 'all 0.2s ease' },
    adminBtn: { color: '#dc2626', background: '#fee2e2', border: '1px solid #fecaca', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' },
    userBadge: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#334155', backgroundColor: '#f1f5f9', padding: '6px 14px', borderRadius: '100px', border: '1px solid #e2e8f0' },
    onlineIndicator: { width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' },
    logoutBtn: { background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', fontWeight: '500' },
    content: { padding: '40px 60px', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 },
    tabNav: { display: 'flex', gap: '8px', marginBottom: '25px' },
    tab: { background: 'transparent', border: 'none', color: '#64748b', padding: '10px 18px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
    activeTab: { background: '#ffffff', color: '#6366f1', padding: '10px 18px', borderRadius: '8px', cursor: 'default', fontSize: '14px', fontWeight: '600', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    usageSection: { backgroundColor: '#ffffff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    usageInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' },
    sectionTitle: { fontSize: '12px', margin: 0, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' },
    planBadge: { color: 'white', padding: '2px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px' },
    usageCount: { fontSize: '20px', fontWeight: '700', color: '#1e293b' },
    dimText: { color: '#94a3b8', fontSize: '14px', fontWeight: '400' },
    progressBarBg: { height: '8px', backgroundColor: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' },
    progressBarFill: { height: '100%', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' },
    grid: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '25px' },
    card: { backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '25px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    cardTitle: { fontSize: '16px', fontWeight: '700', margin: 0, color: '#1e293b' },
    primaryBtn: { backgroundColor: '#6366f1', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'background 0.2s' },
    tableScroll: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    tableRow: { borderBottom: '1px solid #f8fafc' },
    keyCell: { padding: '15px 12px', fontSize: '13px', fontWeight: '600', fontFamily: 'monospace', cursor: 'pointer' },
    statusActive: { color: '#16a34a', backgroundColor: '#f0fdf4', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' },
    statusInactive: { color: '#dc2626', backgroundColor: '#fef2f2', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' },
    revokeBtn: { color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '12px', padding: '4px 8px' },
    logContainer: { marginTop: '10px' },
    logRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' },
    logInfo: { display: 'flex', gap: '12px', alignItems: 'center' },
    statusCode: { fontWeight: '700', fontSize: '12px', minWidth: '30px' },
    logPath: { fontSize: '13px', color: '#475569', fontFamily: 'monospace' },
    logTime: { fontSize: '12px', color: '#94a3b8' },
    guideWrapper: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '30px', border: '1px solid #e2e8f0' }
};

export default Dashboard;