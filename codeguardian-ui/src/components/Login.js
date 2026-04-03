import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Mouse Parallax Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 30 });
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 30 });

    // Transform mouse position to background movement
    const moveX = useTransform(smoothX, [0, window.innerWidth], [-100, 100]);
    const moveY = useTransform(smoothY, [0, window.innerHeight], [-100, 100]);
    const moveXInverted = useTransform(smoothX, [0, window.innerWidth], [100, -100]);
    const moveYInverted = useTransform(smoothY, [0, window.innerHeight], [100, -100]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await api.post('/auth/login', { 
                username: username, 
                password: password 
            });
            
            const { token, role } = response.data;
            const receivedUsername = response.data.username;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('username', receivedUsername || username);
                localStorage.setItem('role', role); 

                // Standardized Lowercase Navigation
                if (role === 'ROLE_ADMIN') {
                    navigate('/dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                alert("Authentication succeeded, but no token was generated.");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Invalid credentials. Please try again.";
            alert(`Access Denied: ${errorMsg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* INTERACTIVE BACKGROUND BLOBS */}
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
                    x: moveXInverted, 
                    y: moveYInverted 
                }}
            />

            {/* LOGIN CARD */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={styles.glassCard}
            >
                <div style={styles.headerArea}>
                    <div style={styles.shieldWrapper}>
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            style={styles.shieldRingOuter}
                        />
                        <div style={styles.shieldCore}>
                            {/* SVG Brand Icon */}
                            <svg width="34" height="40" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L3 7V12C3 17.41 6.84 22.38 12 24C17.16 22.38 21 17.41 21 12V7L12 2Z" fill="#4f46e5" />
                            </svg>
                            <motion.div 
                                animate={{ top: ['-20%', '120%'] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                style={styles.scanBar}
                            />
                        </div>
                    </div>

                    <h2 style={styles.title}>Api<span style={{color: '#4f46e5'}}>Guardian</span></h2>
                    <p style={styles.subtitle}>Secure Access Terminal</p>
                </div>
                
                <form onSubmit={handleLogin} style={styles.form}>
                    <motion.input 
                        whileFocus={{ scale: 1.01, borderColor: '#4f46e5' }}
                        type="text" 
                        placeholder="Username" 
                        style={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                    <motion.input 
                        whileFocus={{ scale: 1.01, borderColor: '#4f46e5' }}
                        type="password" 
                        placeholder="Password" 
                        style={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <motion.button 
                        whileHover={{ scale: isLoading ? 1 : 1.02, backgroundColor: '#4338ca' }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        disabled={isLoading}
                        type="submit" 
                        style={{
                            ...styles.button,
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isLoading ? 'Verifying...' : 'Authenticate'}
                    </motion.button>
                </form>
                
                <p style={styles.footerText}>
                    New operative? <Link to="/register" style={styles.link}>Request Access</Link>
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
    blob: { position: 'absolute', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15, zIndex: 0 },
    blob1: { width: '500px', height: '500px', background: '#6366f1', top: '-10%', left: '-5%' },
    blob2: { width: '400px', height: '400px', background: '#0ea5e9', bottom: '5%', right: '5%' },
    glassCard: { 
        width: '90%', maxWidth: '400px', padding: '50px 40px', 
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)', borderRadius: '32px', 
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', 
        textAlign: 'center', zIndex: 10, position: 'relative'
    },
    shieldWrapper: { position: 'relative', width: '90px', height: '90px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    shieldRingOuter: { position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '1px dashed #4f46e5', opacity: 0.3 },
    shieldCore: { position: 'relative', width: '60px', height: '60px', background: '#fff', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', overflow: 'hidden' },
    scanBar: { position: 'absolute', left: 0, width: '100%', height: '2px', background: '#4f46e5', opacity: 0.3 },
    title: { color: '#1e293b', fontSize: '30px', margin: '0 0 5px 0', fontWeight: '800', letterSpacing: '-0.5px' },
    subtitle: { color: '#64748b', fontSize: '14px', marginBottom: '35px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '16px', borderRadius: '14px', border: '1.5px solid #e2e8f0', outline: 'none', transition: '0.3s', fontSize: '14px', backgroundColor: 'rgba(255, 255, 255, 0.9)' },
    button: { padding: '16px', borderRadius: '14px', border: 'none', color: 'white', backgroundColor: '#4f46e5', fontWeight: '700', marginTop: '10px', fontSize: '16px' },
    footerText: { marginTop: '25px', color: '#94a3b8', fontSize: '14px' },
    link: { color: '#4f46e5', textDecoration: 'none', fontWeight: '700' }
};

export default Login;