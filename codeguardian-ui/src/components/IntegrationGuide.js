import React, { useState } from 'react';

const IntegrationGuide = () => {
    const [activeLang, setActiveLang] = useState('python');

    const snippets = {
        python: `import requests

url = "http://localhost:8080/api/secure-data"
headers = {
    "X-API-KEY": "your_generated_api_key_here",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
print(response.json())`,
        
        java: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class APIGuardianClient {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:8080/api/secure-data"))
            .header("X-API-KEY", "your_generated_api_key_here")
            .GET()
            .build();

        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
            
        System.out.println(response.body());
    }
}`
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Developer Integration Guide</h2>
            <p style={styles.subtitle}>
                Connect your applications to APIGuardian using the <code style={styles.inlineCode}>X-API-KEY</code> header.
            </p>

            <div style={styles.tabContainer}>
                <button 
                    onClick={() => setActiveLang('python')} 
                    style={activeLang === 'python' ? styles.activeTab : styles.tab}
                >
                    Python (Requests)
                </button>
                <button 
                    onClick={() => setActiveLang('java')} 
                    style={activeLang === 'java' ? styles.activeTab : styles.tab}
                >
                    Java (HttpClient)
                </button>
            </div>

            <div style={styles.codeWindow}>
                <div style={styles.codeHeader}>
                    <div style={styles.dots}>
                        <span style={{...styles.dot, backgroundColor: '#ff5f56'}}></span>
                        <span style={{...styles.dot, backgroundColor: '#ffbd2e'}}></span>
                        <span style={{...styles.dot, backgroundColor: '#27c93f'}}></span>
                    </div>
                    <span style={styles.fileName}>
                        {activeLang === 'python' ? 'client.py' : 'APIGuardianClient.java'}
                    </span>
                </div>
                <pre style={styles.pre}>
                    <code style={styles.code}>{snippets[activeLang]}</code>
                </pre>
            </div>

            <div style={styles.infoBox}>
                <h4 style={styles.infoTitle}>💡 Integration Tip</h4>
                <p style={styles.infoText}>
                    Always store your API keys in environment variables. Never hardcode them directly into your version control system.
                </p>
            </div>
        </div>
    );
};

const styles = {
    card: {
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        padding: '40px',
        marginTop: '20px',
        color: '#1e293b',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    title: { fontSize: '20px', fontWeight: '700', marginBottom: '10px', color: '#0f172a' },
    subtitle: { color: '#64748b', fontSize: '15px', marginBottom: '30px' },
    inlineCode: { background: '#f1f5f9', color: '#6366f1', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: '600' },
    tabContainer: { display: 'flex', gap: '8px', marginBottom: '20px' },
    tab: { 
        background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', 
        padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', transition: '0.3s', fontSize: '13px', fontWeight: '500'
    },
    activeTab: { 
        background: '#6366f1', border: '1px solid #6366f1', color: '#fff', 
        padding: '8px 20px', borderRadius: '10px', cursor: 'default', fontSize: '13px', fontWeight: '600'
    },
    codeWindow: { 
        background: '#0f172a', borderRadius: '14px', border: '1px solid #1e293b', 
        overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' 
    },
    codeHeader: { 
        background: '#1e293b', padding: '12px 20px', borderBottom: '1px solid #334155', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
    },
    dots: { display: 'flex', gap: '8px' },
    dot: { width: '10px', height: '10px', borderRadius: '50%' },
    fileName: { color: '#94a3b8', fontSize: '12px', fontFamily: 'monospace', opacity: 0.8 },
    pre: { margin: 0, padding: '24px', overflowX: 'auto' },
    code: { 
        fontFamily: "'Fira Code', 'Courier New', monospace", color: '#e2e8f0', fontSize: '14px', 
        lineHeight: '1.7', whiteSpace: 'pre-wrap' 
    },
    infoBox: { 
        marginTop: '30px', padding: '20px', background: '#f5f7ff', 
        borderRadius: '12px', borderLeft: '4px solid #6366f1' 
    },
    infoTitle: { margin: '0 0 6px 0', color: '#4338ca', fontSize: '14px', fontWeight: '700' },
    infoText: { margin: 0, color: '#64748b', fontSize: '13px', lineHeight: '1.5' }
};

export default IntegrationGuide;