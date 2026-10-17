/* ================================================================
   BOLSA & POLÍTICA — News Feed Renderer
   ================================================================ */

class NewsFeed {

    /**
     * @param {HTMLElement} container - Container element for the news list
     */
    constructor(container) {
        this.container = container;
        this.articles = [];
        this.previousArticleKeys = new Set();
    }

    /**
     * Update the feed with new articles
     * @param {Array} articles - Array of article objects
     */
    update(articles) {
        if (!articles || articles.length === 0) {
            this._renderEmpty();
            return;
        }

        this.articles = articles;
        this._render();
    }

    /**
     * Render the news list
     */
    _render() {
        // Build new article keys for change detection
        const newKeys = new Set(this.articles.map(a => this._getArticleKey(a)));

        // Clear container
        this.container.innerHTML = '';

        this.articles.forEach((article, index) => {
            const card = this._createArticleCard(article, index);
            
            // Animate new articles
            const key = this._getArticleKey(article);
            if (!this.previousArticleKeys.has(key)) {
                card.classList.add('fade-in');
                card.style.animationDelay = `${index * 0.06}s`;
            }

            this.container.appendChild(card);
        });

        this.previousArticleKeys = newKeys;
    }

    /**
     * Create a news article card element
     * @param {Object} article
     * @param {number} index
     * @returns {HTMLElement}
     */
    _createArticleCard(article, index) {
        const card = document.createElement('article');
        card.className = 'news-card';
        card.setAttribute('role', 'article');

        const title = article.title || 'Sem título';
        const source = article.source?.name || 'Fonte desconhecida';
        const time = Utils.timeAgo(article.publishedAt);
        const impactLevel = Utils.classifyImpact(title + ' ' + (article.description || ''));
        const impactLabel = Utils.getImpactLabel(impactLevel);

        card.innerHTML = `
            <div class="news-card-meta">
                <span class="news-source">${this._escapeHtml(source)}</span>
                <span class="news-time">${time}</span>
            </div>
            <h4 class="news-title">${this._escapeHtml(title)}</h4>
            <div class="news-impact-badge ${impactLevel}">
                <span class="impact-dot"></span>
                <span>${impactLabel}</span>
            </div>
        `;

        // Click to open article
        if (article.url && article.url !== '#') {
            card.addEventListener('click', () => {
                window.open(article.url, '_blank', 'noopener');
            });
            card.style.cursor = 'pointer';
        }

        return card;
    }

    /**
     * Render empty state
     */
    _renderEmpty() {
        this.container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">${typeof Icons !== 'undefined' ? Icons.get('newspaper', 'icon-svg', 24) : ''}</span>
                <p class="empty-text">Nenhuma notícia política encontrada no momento.</p>
            </div>
        `;
    }

    /**
     * Get unique key for change detection
     */
    _getArticleKey(article) {
        return `${article.title}-${article.publishedAt}`;
    }

    /**
     * Simple HTML escape
     */
    _escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Get count of news by impact level
     * @returns {Object}
     */
    getImpactCounts() {
        const counts = { high: 0, medium: 0, low: 0 };
        this.articles.forEach(article => {
            const level = Utils.classifyImpact(
                (article.title || '') + ' ' + (article.description || '')
            );
            counts[level]++;
        });
        return counts;
    }

    /**
     * Get the news count badge number
     */
    getCount() {
        return this.articles.length;
    }
}
