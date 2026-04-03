import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UsageStats = () => {
    const [stats, setStats] = useState({ current: 0, limit: 100, percent: 0, plan: 'FREE' });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // You'll need to create a simple @GetMapping("/api/usage/my-stats") in a controller
                const res = await api.get('/usage/my-stats');
                setStats(res.data);
            } catch (err) {
                console.error("Stats fetch failed");
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <h3 style={styles.title}>API Usage Tracking</h3>
                <span style={styles.planBadge}>{stats.plan} PLAN</span>
            </div>

            <div style={styles.progressContainer}>
                <div style={{ ...styles.progressBar, width: `${stats.percent}%` }}></div>
            </div>

            <div style={styles.footer}>
                <span>{stats.current} / {stats.limit} requests today</span>
                <span>{Math.round(stats.percent)}% Used</span>
            </div>
            
            {stats.percent >= 90 && (
                <p style={styles.warning}>⚠️ You are almost at your limit. Upgrade to PRO!</p>
            )}
        </div>
    );
};

const styles = {
    card: {
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#fff',
        marginTop: '20px'
    },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
    title: { margin: 0, fontSize: '18px', fontWeight: '500' },
    planBadge: { background: '#6366f1', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' },
    progressContainer: { background: '#334155', height: '12px', borderRadius: '10px', overflow: 'hidden' },
    progressBar: { background: 'linear-gradient(90deg, #6366f1, #a855f7)', height: '100%', transition: 'width 0.5s ease-in-out' },
    footer: { display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: '#94a3b8', fontSize: '14px' },
    warning: { color: '#fbbf24', fontSize: '13px', marginTop: '15px', textAlign: 'center' }
};

export default UsageStats;