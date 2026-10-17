/* ================================================================
   BOLSA & POLÍTICA — Utility Functions & Constants
   ================================================================ */

const Utils = {

    /* ====== Number Formatting ====== */

    /**
     * Formata um número como moeda BRL
     * @param {number} value 
     * @returns {string}
     */
    formatCurrency(value) {
        if (value == null || isNaN(value)) return 'R$ —';
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },

    /**
     * Formata variação percentual
     * @param {number} value 
     * @returns {string}
     */
    formatPercent(value) {
        if (value == null || isNaN(value)) return '—%';
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}%`;
    },

    /**
     * Formata número grande de forma abreviada (ex: 1.2M, 3.5B)
     * @param {number} num 
     * @returns {string}
     */
    formatCompact(num) {
        if (num == null || isNaN(num)) return '—';
        if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return num.toFixed(0);
    },

    /**
     * Formata um número com separadores de milhar BR
     * @param {number} num 
     * @returns {string}
     */
    formatNumber(num) {
        if (num == null || isNaN(num)) return '—';
        return num.toLocaleString('pt-BR');
    },

    /* ====== Date & Time ====== */

    /**
     * Retorna a hora atual formatada HH:MM:SS
     * @returns {string}
     */
    getCurrentTime() {
        return new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    },

    /**
     * Retorna a data atual formatada
     * @returns {string}
     */
    getCurrentDate() {
        return new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    },

    /**
     * Converte timestamp para "há X min/h" 
     * @param {string} dateStr - ISO date string
     * @returns {string}
     */
    timeAgo(dateStr) {
        if (!dateStr) return '';
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHr = Math.floor(diffMs / 3600000);
        const diffDay = Math.floor(diffMs / 86400000);

        if (diffMin < 1) return 'agora';
        if (diffMin < 60) return `há ${diffMin} min`;
        if (diffHr < 24) return `há ${diffHr}h`;
        if (diffDay < 7) return `há ${diffDay}d`;
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    },

    /* ====== DOM Helpers ====== */

    /**
     * Shortcut para querySelector
     */
    $(selector, parent = document) {
        return parent.querySelector(selector);
    },

    /**
     * Shortcut para querySelectorAll
     */
    $$(selector, parent = document) {
        return [...parent.querySelectorAll(selector)];
    },

    /**
     * Cria elemento com classes e atributos
     */
    createElement(tag, className = '', innerHTML = '') {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (innerHTML) el.innerHTML = innerHTML;
        return el;
    },

    /* ====== Animation Helpers ====== */

    /**
     * Interpola linealmente entre dois valores
     * @param {number} start 
     * @param {number} end 
     * @param {number} t - Progresso de 0 a 1
     * @returns {number}
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    /**
     * Easing function: ease-out cubic
     * @param {number} t 
     * @returns {number}
     */
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    },

    /**
     * Easing function: ease-in-out cubic
     * @param {number} t 
     * @returns {number}
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    },

    /**
     * Anima um valor numérico com callback
     * @param {number} from 
     * @param {number} to 
     * @param {number} duration - ms
     * @param {function} onUpdate - callback(currentValue)
     * @param {function} onComplete - optional
     */
    animateValue(from, to, duration, onUpdate, onComplete) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeOutCubic(progress);
            const currentValue = this.lerp(from, to, easedProgress);
            onUpdate(currentValue);
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (onComplete) {
                onComplete();
            }
        };
        requestAnimationFrame(animate);
    },

    /* ====== Data Helpers ====== */

    /**
     * Gera dados aleatórios simulados para sparklines
     * @param {number} points - Número de pontos
     * @param {number} base - Valor base
     * @param {number} volatility - Variação máxima %
     * @returns {number[]}
     */
    generateSparklineData(points = 20, base = 100, volatility = 3) {
        const data = [base];
        for (let i = 1; i < points; i++) {
            const change = (Math.random() - 0.5) * 2 * (base * volatility / 100);
            data.push(data[i - 1] + change);
        }
        return data;
    },

    /**
     * Retorna a cor baseada na variação (verde para alta, vermelho para baixa)
     */
    getChangeColor(value) {
        if (value > 0) return 'var(--accent-green)';
        if (value < 0) return 'var(--accent-red)';
        return 'var(--text-secondary)';
    },

    /**
     * Retorna a classe CSS baseada na variação
     */
    getChangeClass(value) {
        if (value > 0) return 'positive';
        if (value < 0) return 'negative';
        return 'neutral';
    },

    /**
     * Retorna o ícone de seta baseado na variação
     */
    getChangeArrow(value) {
        if (value > 0) return '▲';
        if (value < 0) return '▼';
        return '●';
    },

    /* ====== Stock Metadata ====== */
    
    STOCK_META: {
        'PETR4': { name: 'Petrobras PN', sector: 'Energia', color: '#22c55e' },
        'VALE3': { name: 'Vale ON', sector: 'Mineração', color: '#3b82f6' },
        'ITUB4': { name: 'Itaú Unibanco PN', sector: 'Banco', color: '#8b5cf6' },
        'BBDC4': { name: 'Bradesco PN', sector: 'Banco', color: '#f59e0b' },
        'ABEV3': { name: 'Ambev ON', sector: 'Bebidas', color: '#06b6d4' }
    },

    /* ====== Impact Keywords ====== */
    
    HIGH_IMPACT_KEYWORDS: [
        'reforma', 'tributária', 'fiscal', 'juros', 'selic', 'copom',
        'impeachment', 'petrobras', 'privatização', 'câmbio', 'dólar',
        'inflação', 'ipca', 'pib', 'recessão', 'déficit', 'superávit',
        'arcabouço', 'teto de gastos', 'meta fiscal', 'banco central',
        'taxa de juros', 'corte', 'aumento', 'reforma administrativa',
        'concessão', 'leilão', 'estatal', 'dividendo'
    ],

    MEDIUM_IMPACT_KEYWORDS: [
        'congresso', 'senado', 'câmara', 'votação', 'aprovação',
        'projeto de lei', 'medida provisória', 'decreto', 'regulamentação',
        'ministro', 'presidente', 'governo', 'oposição', 'eleição',
        'pesquisa', 'economia', 'mercado', 'investimento', 'comércio',
        'exportação', 'importação', 'balança comercial', 'emprego'
    ],

    /**
     * Classifica o impacto de uma notícia baseado em keywords
     * @param {string} text 
     * @returns {'high'|'medium'|'low'}
     */
    classifyImpact(text) {
        if (!text) return 'low';
        const lowerText = text.toLowerCase();
        
        const highCount = this.HIGH_IMPACT_KEYWORDS.filter(kw => lowerText.includes(kw)).length;
        if (highCount >= 2) return 'high';
        if (highCount >= 1) return 'medium';
        
        const mediumCount = this.MEDIUM_IMPACT_KEYWORDS.filter(kw => lowerText.includes(kw)).length;
        if (mediumCount >= 2) return 'medium';
        
        return 'low';
    },

    /**
     * Retorna label de impacto traduzido
     */
    getImpactLabel(level) {
        const labels = {
            high: 'Alto Impacto',
            medium: 'Impacto Médio',
            low: 'Baixo Impacto'
        };
        return labels[level] || 'Desconhecido';
    },

    /* ====== Debounce ====== */
    
    debounce(fn, delay = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    }
};
