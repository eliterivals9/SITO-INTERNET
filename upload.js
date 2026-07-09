/* admin/admin.css */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
    --font-sans: 'Space Grotesk', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
}

body {
    font-family: var(--font-sans);
    background-color: #0b0f19;
    color: #f8fafc;
}

code, pre {
    font-family: var(--font-mono);
}

/* Custom scrollbars for a premium dark look */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-track {
    background: #0f172a;
}
::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: #334155;
}

/* CSS Animations for smooth transitions */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
    animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Match main store's product card visuals in preview */
.card-maglia {
    background-color: #1e293b;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    border: 1px solid #334155;
    transition: all 0.25s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.contenitore-foto {
    background: #0f172a;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 240px;
}

.foto-maglia {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
}

.info-maglia {
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    background-color: #1e293b;
}

.info-maglia h3 {
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 4px;
}

.info-maglia .stagione {
    font-size: 13px;
    color: #94a3b8;
    margin-bottom: 12px;
}

.dettagli-prezzo-bottone {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.prezzo {
    font-size: 18px;
    font-weight: 700;
    color: #10b981;
}

.prezzo-barrato {
    font-size: 13px;
    text-decoration: line-through;
    color: #ef4444;
    margin-right: 6px;
}

.btn-configura {
    background-color: #4f46e5;
    color: #ffffff;
    font-weight: 600;
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 8px;
    transition: background-color 0.2s;
    border: none;
}

.badge-card {
    position: absolute;
    top: 12px;
    left: 12px;
    background-color: #ef4444;
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 6px;
    z-index: 10;
}

.badge-card-tipo {
    position: absolute;
    top: 12px;
    right: 12px;
    background-color: #3b82f6;
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 6px;
    z-index: 10;
}
