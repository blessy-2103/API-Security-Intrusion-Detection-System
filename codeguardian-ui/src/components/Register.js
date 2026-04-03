import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
    const navigate = useNavigate();

    // 1. Setup Motion Values for Mouse (Same as Login)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // 2. Smooth spring physics
    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 30 });
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 30 });

    // 3. Parallax Transforms
    const moveX = useTransform(smoothX, [0, window.innerWidth], [-100, 100]);
    const moveY = useTransform(smoothY, [0, window.innerHeight], [-100, 100]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            alert("Registration Successful! Please Login.");
            navigate('/'); 
        } catch (error) {
            console.error("Registration error:", error);
            alert("Registration Failed. Username might already exist.");
        }
    };

    return (
        <div style={styles.container}>
            {/* --- INTERACTIVE BACKGROUND BLOBS --- */}
            <motion.div 
                style={{
                    ...styles.blob, 
                    ...styles.blob1,
                    x: moveX, 
                    y: moveY 
                }}
            />
            <motion.div 
                style={{
                    ...styles.blob, 
                    ...styles.blob2,
                    x: useTransform(smoothX, [0, window.innerWidth], [100, -100]), 
                    y: useTransform(smoothY, [0, window.innerHeight], [100, -100])
                }}
            />

            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={styles.glassCard}
            >
                <div style={styles.headerArea}>
                    {/* --- PREMIUM ANIMATED SHIELD --- */}
                    <div style={styles.shieldWrapper}>
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                            style={styles.shieldRingOuter}
                        />
                        <div style={styles.shieldCore}>
                            <svg width="34" height="40" viewBox="0 0 24 24" fill="none">
                                <path 
                                    d="M12 2L3 7V12C3 17.41 6.84 22.38 12 24C17.16 22.38 21 17.41 21 12V7L12 2Z" 
                                    fill="url(#regGradient)" 
                                />
                                <defs>
                                    <linearGradient id="regGradient" x1="12" y1="2" x2="12" y2="24">
                                        <stop stopColor="#10b981" />
                                        <stop offset="1" stopColor="#059669" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <motion.div 
                                animate={{ top: ['-20%', '120%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                style={styles.scanBar}
                            />
                        </div>
                    </div>

                    <h2 style={styles.title}>Api<span style={{color: '#10b981'}}>Guardian</span></h2>
                    <p style={styles.subtitle}>Initialize New Operative</p>
                </div>
                
                <form onSubmit={handleRegister} style={styles.form}>
                    <motion.input 
                        whileFocus={{ scale: 1.01, borderColor: '#10b981' }}
                        type="text" 
                        placeholder="Username" 
                        style={styles.input}
                        onChange={(e) => setFormData({...formData, username: e.target.value})} 
                        required 
                    />
                    <motion.input 
                        whileFocus={{ scale: 1.01, borderColor: '#10b981' }}
                        type="email" 
                        placeholder="Email Address" 
                        style={styles.input}
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                    <motion.input 
                        whileFocus={{ scale: 1.01, borderColor: '#10b981' }}
                        type="password" 
                        placeholder="Create Password" 
                        style={styles.input}
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        required 
                    />
                    <motion.button 
                        whileHover={{ scale: 1.02, backgroundColor: '#059669', translateY: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        style={styles.button}
                    >
                        Create Security Profile
                    </motion.button>
                </form>
                
                <p style={styles.footerText}>
                    Already have access? <Link to="/" style={styles.link}>System Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

const styles = {
    container: { 
        height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#f8fafc', overflow: 'hidden', position: 'relative', 
        fontFamily: "'Inter', sans-serif"
    },
    blob: { position: 'absolute', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.12, zIndex: 1 },
    blob1: { width: '600px', height: '600px', background: 'rgba(16, 185, 129, 0.3)', top: '-10%', right: '-5%' },
    blob2: { width: '500px', height: '500px', background: 'rgba(99, 102, 241, 0.2)', bottom: '5%', left: '-5%' },
    
    glassCard: { 
        width: '100%', maxWidth: '420px', padding: '50px 45px', 
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(30px)', borderRadius: '40px', 
        border: '1px solid #ffffff',
        boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.08)', 
        textAlign: 'center', zIndex: 10
    },

    // SHIELD STYLES
    shieldWrapper: { 
        position: 'relative', width: '100px', height: '100px', 
        margin: '0 auto 25px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
    },
    shieldRingOuter: {
        position: 'absolute', width: '100%', height: '100%',
        borderRadius: '50%', border: '1px dashed #cbd5e1',
        borderTopColor: '#10b981'
    },
    shieldCore: {
        position: 'relative', width: '64px', height: '64px', background: '#fff',
        borderRadius: '20px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', boxShadow: '0 12px 24px rgba(16, 185, 129, 0.12)',
        border: '1px solid #f8fafc', overflow: 'hidden'
    },
    scanBar: {
        position: 'absolute', left: 0, width: '100%', height: '3px',
        background: 'rgba(16, 185, 129, 0.4)', filter: 'blur(1px)',
        zIndex: 1
    },

    title: { color: '#0f172a', fontSize: '32px', margin: '0 0 8px 0', fontWeight: '800', letterSpacing: '-1.5px' },
    subtitle: { color: '#94a3b8', fontSize: '14px', marginBottom: '35px', fontWeight: '500' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    input: { 
        width: '100%', boxSizing: 'border-box', padding: '18px 20px', borderRadius: '18px', border: '1.5px solid #f1f5f9',
        background: '#fff', color: '#1e293b', fontSize: '16px', outline: 'none',
        transition: 'all 0.3s ease'
    },
    button: { 
        padding: '18px', borderRadius: '18px', border: 'none', color: 'white', 
        backgroundColor: '#10b981', fontSize: '16px', fontWeight: '700', 
        cursor: 'pointer', marginTop: '10px',
        boxShadow: '0 15px 30px -5px rgba(16, 185, 129, 0.4)',
        transition: 'all 0.3s ease'
    },
    footerText: { marginTop: '30px', color: '#94a3b8', fontSize: '14px' },
    link: { color: '#10b981', textDecoration: 'none', fontWeight: '700' }
};

export default Register;