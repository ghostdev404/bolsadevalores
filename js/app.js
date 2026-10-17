/* ================================================================
   BOLSA & POLÍTICA — Master Application Orchestrator
   100% Focado na Bolsa de Valores (B3) e Impacto Político desde 25/09
   Zero foco em candidatos, sem fotos/avatares políticos, zero emojis
   ================================================================ */

const App = {

    // Estado da Aplicação
    activeAsset: "IBOV",
    selectedPinIndex: 5,
    isPlayingTimeline: false,
    timelineTimer: null,
    zoomLevel: 1.0,

    /* ====== Inicialização ====== */
    async init() {
        console.log('[App] Inicializando Bolsa de Valores & Política desde 25/09...');

        this._injectIcons();
        this._renderStockList();
        this._renderSectorsList();
        this._renderLiveFeed();
        this._initMainMarketChart();
        this._initEvolutionChart();
        this._initTimelinePlayer();
        this._initViewTabs();
        this._initSpotlightSearch();
        this._initBrazilMap();
        this._initZoomControls();
        this._initFullscreenButton();
        this._initLiveMarketData();
        this._initB3TickerTape();

        console.log('[App] Painel carregado com sucesso.');
    },

    /* ====== 1. Injeção de Ícones Vetoriais SVG (Zero Emojis) ====== */
    _injectIcons() {
        const setIcon = (id, iconName, size = 16) => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = Icons.get(iconName, "icon-svg", size);
        };

        setIcon("icon-x", "x-twitter", 15);
        setIcon("icon-instagram", "instagram", 15);
        setIcon("icon-search-btn", "search", 14);
        setIcon("icon-maximize-btn", "maximize", 15);
        setIcon("icon-player-pause", "play", 14);
        setIcon("icon-zoom-plus", "plus", 14);
        setIcon("icon-zoom-minus", "minus", 14);
        setIcon("icon-ticker-shield", "shield", 14);
        setIcon("icon-spotlight-search", "search", 18);

        // Ícones dos Emblemas de Forças do Mercado
        setIcon("icon-duel-landmark", "landmark", 26);
        setIcon("icon-duel-trending", "trending", 26);
    },

    /* ====== 2. Cotações em Tempo Real e Atualização dos Chips ====== */
    async _initLiveMarketData() {
        const updateHeader = (indices) => {
            if (!indices) return;

            const ibovVal = document.getElementById("header-ibov-val");
            const ibovChange = document.getElementById("header-ibov-change");
            const usdVal = document.getElementById("header-usd-val");
            const usdChange = document.getElementById("header-usd-change");

            if (indices.ibov && ibovVal && ibovChange) {
                const pts = Math.round(indices.ibov.points).toLocaleString("pt-BR");
                const varPct = indices.ibov.variation || 0;
                const isPos = varPct >= 0;

                ibovVal.textContent = pts;
                ibovChange.textContent = `${isPos ? '+' : ''}${varPct.toFixed(2).replace('.', ',')}%`;
                ibovChange.className = `chip-change ${isPos ? 'pos' : 'neg'}`;

                const badge = document.getElementById("active-asset-badge");
                if (this.activeAsset === "IBOV" && badge) {
                    badge.textContent = `IBOVESPA: ${pts} pts (${isPos ? '+' : ''}${varPct.toFixed(2).replace('.', ',')}%)`;
                }
            }

            if (indices.usd && usdVal && usdChange) {
                const buy = indices.usd.buy || 5.06;
                const varPct = indices.usd.variation || 0;
                const isPos = varPct >= 0;

                usdVal.textContent = `R$ ${buy.toFixed(2).replace('.', ',')}`;
                usdChange.textContent = `${isPos ? '+' : ''}${varPct.toFixed(2).replace('.', ', dryer')}%`;
                usdChange.className = `chip-change ${isPos ? 'pos' : 'neg'}`;
            }
        };

        try {
            const initialIndices = await API.fetchMarketIndices();
            updateHeader(initialIndices);

            // Polling periódico para manter os dados vivos
            setInterval(async () => {
                const updated = await API.fetchMarketIndices();
                updateHeader(updated);
            }, API.POLL_INTERVAL);
        } catch (err) {
            console.warn('[App] Erro na sincronização de cotações ao vivo:', err);
        }
    },

    /* ====== 3. Ações B3 em Foco (Coluna Esquerda) ====== */
    _renderStockList() {
        const container = document.getElementById("stock-list-container");
        if (!container) return;

        container.innerHTML = MARKET_POLITICS_DATA.stocks.map(stock => {
            const isActive = stock.symbol === this.activeAsset;
            const isPos = stock.changeSinceSept25 >= 0;
            return `
                <div class="stock-list-item" style="cursor: pointer; padding: 0.5rem 0.65rem; border-radius: 8px; transition: all 0.15s; background: ${isActive ? 'rgba(59, 130, 246, 0.14)' : 'rgba(255, 255, 255, 0.02)'}; border: 1px solid ${isActive ? 'rgba(59, 130, 246, 0.35)' : 'rgba(255, 255, 255, 0.04)'}; display: flex; align-items: center; justify-content: space-between;" data-stock-sym="${stock.symbol}">
                    <div style="display: flex; align-items: center; gap: 0.65rem;">
                        <div style="width: 32px; height: 32px; border-radius: 6px; background: #1a1f2c; border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 0.68rem; font-weight: 800; color: #60a5fa;">
                            ${stock.symbol.slice(0, 4)}
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <span style="font-weight: 700; color: #ffffff; font-size: 0.85rem;">${stock.symbol}</span>
                            <span style="font-size: 0.72rem; color: #94a3b8;">${stock.name}</span>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <span style="color: ${isPos ? '#22c55e' : '#fb7185'}; font-weight: 700; font-family: var(--font-mono); font-size: 0.82rem;">${isPos ? '+' : ''}${stock.changeSinceSept25.toFixed(2).replace('.', ',')}%</span>
                        <span style="display: block; font-family: var(--font-mono); font-size: 0.7rem; color: #64748b;">R$ ${stock.currentPrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
            `;
        }).join("");

        container.querySelectorAll("[data-stock-sym]").forEach(item => {
            item.addEventListener("click", () => {
                const sym = item.getAttribute("data-stock-sym");
                this._selectActiveAsset(sym);
            });
        });
    },

    _selectActiveAsset(symbol) {
        this.activeAsset = symbol;

        // Atualiza botões superiores da barra de navegação
        document.querySelectorAll("[data-chart-asset]").forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-chart-asset") === symbol);
        });

        // Atualiza seleção na lista
        document.querySelectorAll("[data-stock-sym]").forEach(item => {
            const isMatch = item.getAttribute("data-stock-sym") === symbol;
            item.style.background = isMatch ? 'rgba(59, 130, 246, 0.14)' : 'rgba(255, 255, 255, 0.02)';
            item.style.borderColor = isMatch ? 'rgba(59, 130, 246, 0.35)' : 'rgba(255, 255, 255, 0.04)';
        });

        const badge = document.getElementById("active-asset-badge");
        if (symbol === "IBOV") {
            const ibovEl = document.getElementById("header-ibov-val");
            const ibovPts = ibovEl ? ibovEl.textContent : "129.650";
            if (badge) badge.textContent = `IBOVESPA: ${ibovPts} pts (+3,45% desde 25/09)`;
        } else {
            const s = MARKET_POLITICS_DATA.stocks.find(st => st.symbol === symbol);
            if (s && badge) {
                badge.textContent = `${s.symbol}: R$ ${s.currentPrice.toFixed(2).replace('.', ',')} (+${s.changeSinceSept25.toFixed(2).replace('.', ',')}%)`;
            }
        }

        this._renderMainChart();
    },

    /* ====== 4. Gráfico Principal B3 com Pinos de Fatos Políticos ====== */
    _initMainMarketChart() {
        window.addEventListener("resize", () => this._renderMainChart());
        setTimeout(() => this._renderMainChart(), 60);
    },

    _renderMainChart() {
        const container = document.getElementById("view-chart-container");
        const canvas = document.getElementById("market-main-canvas");
        const pinsLayer = document.getElementById("chart-pins-layer");
        if (!container || !canvas || !pinsLayer) return;

        const dpr = window.devicePixelRatio || 1;
        const w = container.clientWidth || 740;
        const h = container.clientHeight || 420;

        canvas.width = w * dpr;
        canvas.height = h * dpr;

        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, w, h);

        const padLeft = 55;
        const padRight = 35;
        const padTop = 40;
        const padBottom = 45;

        const chartW = w - padLeft - padRight;
        const chartH = h - padTop - padBottom;

        // 6 Fatos Políticos de 25 de Setembro a Hoje (17 de Outubro)
        let values = [];
        if (this.activeAsset === "IBOV") {
            values = [126900, 128400, 129300, 129850, 129100, 129650];
        } else {
            const s = MARKET_POLITICS_DATA.stocks.find(st => st.symbol === this.activeAsset);
            values = s ? s.history : [36.90, 37.35, 38.10, 38.60, 38.25, 38.95];
        }

        const minVal = Math.min(...values) * 0.985;
        const maxVal = Math.max(...values) * 1.015;

        const getY = (val) => padTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
        const getX = (idx) => padLeft + (idx / (values.length - 1)) * chartW;

        // Grade Horizontal
        ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
        ctx.lineWidth = 1;
        ctx.fillStyle = "#64748b";
        ctx.font = "10px var(--font-mono, monospace)";

        for (let i = 0; i <= 4; i++) {
            const val = minVal + (i / 4) * (maxVal - minVal);
            const y = getY(val);

            ctx.beginPath();
            ctx.moveTo(padLeft, y);
            ctx.lineTo(w - padRight, y);
            ctx.stroke();

            const lbl = this.activeAsset === "IBOV" 
                ? Math.round(val).toLocaleString('pt-BR') 
                : `R$ ${val.toFixed(2)}`;
            ctx.fillText(lbl, 4, y + 3);
        }

        // Rótulos de Datas no Eixo X (Exatamente as 6 datas dos fatos políticos)
        const dateLabels = ["25 Set", "29 Set", "03 Out", "08 Out", "12 Out", "Hoje (17/10)"];
        dateLabels.forEach((label, i) => {
            const x = getX(i);
            ctx.fillStyle = i === 0 ? "#60a5fa" : i === dateLabels.length - 1 ? "#22c55e" : "#64748b";
            ctx.fillText(label, x - 18, h - 14);
        });

        // Área Sombreada Gradiente
        const grad = ctx.createLinearGradient(0, padTop, 0, h - padBottom);
        grad.addColorStop(0, "rgba(59, 130, 246, 0.28)");
        grad.addColorStop(1, "rgba(59, 130, 246, 0.00)");

        ctx.beginPath();
        values.forEach((v, i) => {
            const x = getX(i);
            const y = getY(v);
            if (i === 0) ctx.moveTo(x, y);
            else {
                const prevX = getX(i - 1);
                const prevY = getY(values[i - 1]);
                ctx.bezierCurveTo(prevX + (x - prevX)/2, prevY, prevX + (x - prevX)/2, y, x, y);
            }
        });
        ctx.lineTo(getX(values.length - 1), h - padBottom);
        ctx.lineTo(getX(0), h - padBottom);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Linha Principal
        ctx.beginPath();
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 3;
        ctx.shadowColor = "rgba(59, 130, 246, 0.5)";
        ctx.shadowBlur = 12;

        values.forEach((v, i) => {
            const x = getX(i);
            const y = getY(v);
            if (i === 0) ctx.moveTo(x, y);
            else {
                const prevX = getX(i - 1);
                const prevY = getY(values[i - 1]);
                ctx.bezierCurveTo(prevX + (x - prevX)/2, prevY, prevX + (x - prevX)/2, y, x, y);
            }
        });
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Pinos de Fatos Políticos
        pinsLayer.innerHTML = "";
        MARKET_POLITICS_DATA.timelineEvents.forEach((ev, i) => {
            const pinX = getX(i);
            const targetVal = values[i];
            const pinY = getY(targetVal);

            const pinEl = document.createElement("div");
            pinEl.className = `chart-event-pin ${i === this.selectedPinIndex ? 'active' : ''}`;
            pinEl.style.left = `${pinX}px`;
            pinEl.style.top = `${pinY}px`;
            pinEl.style.pointerEvents = "auto";

            const typeClass = ev.impactType === "positive" ? "pos" : ev.impactType === "negative" ? "neg" : "neu";

            pinEl.innerHTML = `
                <div class="pin-head ${typeClass}">
                    <span>${i + 1}</span>
                </div>
                <div class="pin-stem"></div>
            `;

            pinEl.addEventListener("mouseenter", (e) => this._showEventTooltip(e, ev, pinX, pinY));
            pinEl.addEventListener("mouseleave", () => this._hideEventTooltip());
            pinEl.addEventListener("click", () => {
                this.selectedPinIndex = i;
                document.querySelectorAll(".chart-event-pin").forEach((p, idx) => {
                    p.classList.toggle("active", idx === i);
                });
                this._showEventTooltip(null, ev, pinX, pinY);
            });

            pinsLayer.appendChild(pinEl);
        });
    },

    _showEventTooltip(e, ev, fixedX, fixedY) {
        const tooltip = document.getElementById("state-detail-tooltip");
        const stage = document.getElementById("main-visual-stage");
        if (!tooltip || !stage || !ev) return;

        const dateEl = document.getElementById("tooltip-event-date");
        const titleEl = document.getElementById("tooltip-event-title");
        const descEl = document.getElementById("tooltip-event-desc");
        const reactionEl = document.getElementById("tooltip-event-reaction");

        if (dateEl) dateEl.textContent = `${ev.date} · ${ev.time}`;
        if (titleEl) titleEl.textContent = ev.title;
        if (descEl) descEl.textContent = ev.description;
        if (reactionEl) {
            reactionEl.textContent = ev.b3Reaction;
            reactionEl.style.color = ev.impactType === "negative" ? "#fb7185" : "#22c55e";
        }

        const stageRect = stage.getBoundingClientRect();
        let posX = fixedX ? fixedX + 15 : e ? e.clientX - stageRect.left + 15 : 220;
        let posY = fixedY ? fixedY - 60 : e ? e.clientY - stageRect.top - 60 : 150;

        if (posX + 320 > stageRect.width) posX = posX - 330;
        if (posY < 20) posY = 30;

        tooltip.style.left = `${posX}px`;
        tooltip.style.top = `${posY}px`;
        tooltip.classList.add("visible");
    },

    _hideEventTooltip() {
        const tooltip = document.getElementById("state-detail-tooltip");
        if (tooltip) tooltip.classList.remove("visible");
    },

    /* ====== 5. Setores da B3 (Coluna Direita) ====== */
    _renderSectorsList() {
        const container = document.getElementById("sectors-container");
        if (!container) return;

        const sectors = [
            { name: "Energia & Elétricas", change: "+6,4%", pct: 78 },
            { name: "Privadas & Exportadoras", change: "+6,1%", pct: 75 },
            { name: "Óleo & Gás", change: "+5,8%", pct: 70 },
            { name: "Bancos & Financeiro", change: "+5,2%", pct: 64 },
            { name: "Agronegócio", change: "+4,1%", pct: 52 },
            { name: "Varejo & Consumo", change: "+1,9%", pct: 32 }
        ];

        container.innerHTML = sectors.map(sec => `
            <div class="region-item">
                <div class="region-top-line">
                    <span class="region-name">${sec.name}</span>
                    <span class="region-pct-val" style="color: #22c55e;">${sec.change}</span>
                </div>
                <div class="region-progress-bar">
                    <div class="region-fill" style="width: ${sec.pct}%;"></div>
                </div>
            </div>
        `).join("");
    },

    /* ====== 6. Feed de Fatos Políticos & B3 (Coluna Direita) ====== */
    _renderLiveFeed() {
        const container = document.getElementById("live-feed-container");
        if (!container) return;

        container.innerHTML = MARKET_POLITICS_DATA.timelineEvents.map(ev => {
            const isNeg = ev.impactType === "negative";
            const iconName = isNeg ? "chart-down" : "chart-up";
            const iconClass = isNeg ? "feed-icon-wrap" : "feed-icon-wrap chart-icon";

            return `
                <div class="feed-item">
                    <span class="feed-timestamp">${ev.date.split(' ')[0]}</span>
                    <div class="${iconClass}">
                        ${Icons.get(iconName, "svg-icon", 14)}
                    </div>
                    <div class="feed-content">
                        <span class="feed-text"><strong>${ev.title}</strong></span>
                        <span class="feed-highlight-b3">${ev.b3Reaction}</span>
                    </div>
                </div>
            `;
        }).join("");
    },

    /* ====== 7. Gráfico IBOVESPA vs Dólar (Coluna Esquerda) ====== */
    _initEvolutionChart() {
        const canvas = document.getElementById("evolution-canvas");
        if (!canvas) return;

        const renderEvolution = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            const ctx = canvas.getContext("2d");
            ctx.scale(dpr, dpr);

            const w = rect.width;
            const h = rect.height;

            ctx.clearRect(0, 0, w, h);

            const pLeft = 32;
            const pRight = 12;
            const pTop = 15;
            const pBottom = 22;

            const chartW = w - pLeft - pRight;
            const chartH = h - pTop - pBottom;

            // IBOVESPA subiu +3,45% | Dólar caiu -1,82% desde 25/09
            const ibovLine = [0, 0.45, 1.2, 2.1, 2.8, 3.45];
            const dollarLine = [0, -0.6, -1.1, -1.4, -1.5, -1.82];

            const min = -2.5;
            const max = 4.0;
            const getY = (v) => pTop + chartH - ((v - min) / (max - min)) * chartH;
            const getX = (idx) => pLeft + (idx / (ibovLine.length - 1)) * chartW;

            ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
            ctx.beginPath();
            ctx.moveTo(pLeft, getY(0));
            ctx.lineTo(w - pRight, getY(0));
            ctx.stroke();

            ctx.fillStyle = "#64748b";
            ctx.font = "9px var(--font-mono, monospace)";
            ctx.fillText("0%", 6, getY(0) + 3);
            ctx.fillText("+3%", 6, getY(3) + 3);

            const drawCurve = (line, color) => {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 2.2;
                line.forEach((v, i) => {
                    const x = getX(i);
                    const y = getY(v);
                    if (i === 0) ctx.moveTo(x, y);
                    else {
                        const prevX = getX(i - 1);
                        const prevY = getY(line[i - 1]);
                        ctx.bezierCurveTo(prevX + (x - prevX)/2, prevY, prevX + (x - prevX)/2, y, x, y);
                    }
                });
                ctx.stroke();
            };

            drawCurve(ibovLine, "#2563eb");
            drawCurve(dollarLine, "#e11d48");

            ctx.fillStyle = "#64748b";
            ctx.fillText("25 Set", pLeft, h - 5);
            ctx.fillText("Hoje", w - pRight - 24, h - 5);
        };

        window.addEventListener("resize", renderEvolution);
        setTimeout(renderEvolution, 80);
    },

    /* ====== 8. Timeline Scrubber (25/09 até Hoje) ====== */
    _initTimelinePlayer() {
        const toggleBtn = document.getElementById("btn-player-toggle");
        const scrubberTrack = document.getElementById("timeline-track");
        const scrubberFill = document.getElementById("timeline-fill");
        const scrubberThumb = document.getElementById("timeline-thumb");
        const timeDisplay = document.getElementById("timeline-time-display");

        if (toggleBtn) {
            toggleBtn.addEventListener("click", () => {
                this.isPlayingTimeline = !this.isPlayingTimeline;
                toggleBtn.innerHTML = this.isPlayingTimeline 
                    ? Icons.get("pause", "icon-svg", 14) 
                    : Icons.get("play", "icon-svg", 14);

                if (this.isPlayingTimeline) {
                    this._startTimelineLoop();
                } else {
                    clearInterval(this.timelineTimer);
                }
            });
        }

        if (scrubberTrack) {
            scrubberTrack.addEventListener("click", (e) => {
                const rect = scrubberTrack.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = Math.max(0, Math.min(1, clickX / rect.width));
                const targetIdx = Math.floor(pct * (MARKET_POLITICS_DATA.timelineEvents.length - 1));

                scrubberFill.style.width = `${pct * 100}%`;
                scrubberThumb.style.left = `${pct * 100}%`;

                const ev = MARKET_POLITICS_DATA.timelineEvents[targetIdx];
                if (ev && timeDisplay) timeDisplay.textContent = ev.date;

                this.selectedPinIndex = targetIdx;
                this._renderMainChart();
            });
        }
    },

    _startTimelineLoop() {
        clearInterval(this.timelineTimer);
        this.timelineTimer = setInterval(() => {
            if (!this.isPlayingTimeline) return;

            this.selectedPinIndex = (this.selectedPinIndex + 1) % MARKET_POLITICS_DATA.timelineEvents.length;
            const ev = MARKET_POLITICS_DATA.timelineEvents[this.selectedPinIndex];

            const timeDisplay = document.getElementById("timeline-time-display");
            const fill = document.getElementById("timeline-fill");
            const thumb = document.getElementById("timeline-thumb");
            const pct = (this.selectedPinIndex / (MARKET_POLITICS_DATA.timelineEvents.length - 1)) * 100;

            if (timeDisplay && ev) timeDisplay.textContent = ev.date;
            if (fill) fill.style.width = `${pct}%`;
            if (thumb) thumb.style.left = `${pct}%`;

            this._renderMainChart();
        }, 3200);
    },

    /* ====== 9. Alternador de Visualizações (Gráfico vs Mapa) ====== */
    _initViewTabs() {
        const btnChart = document.getElementById("btn-tab-chart");
        const btnMap = document.getElementById("btn-tab-map");
        const chartView = document.getElementById("view-chart-container");
        const mapView = document.getElementById("view-map-container");

        if (btnChart && btnMap && chartView && mapView) {
            btnChart.addEventListener("click", () => {
                btnChart.classList.add("active");
                btnMap.classList.remove("active");
                chartView.style.display = "block";
                mapView.style.display = "none";
                this._renderMainChart();
            });

            btnMap.addEventListener("click", () => {
                btnMap.classList.add("active");
                btnChart.classList.remove("active");
                chartView.style.display = "none";
                mapView.style.display = "flex";
            });
        }

        // Seletor de ativos nos botões do header
        document.querySelectorAll("[data-chart-asset]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const asset = e.currentTarget.getAttribute("data-chart-asset");
                this._selectActiveAsset(asset);
                if (btnChart) btnChart.click();
            });
        });
    },

    /* ====== 10. Mapa Regional Interativo B3 (100% Setores e Ações) ====== */
    _initBrazilMap() {
        const statesLayer = document.getElementById("states-layer");
        const labelsLayer = document.getElementById("labels-layer");
        if (!statesLayer || !labelsLayer || typeof MAP_DATA === "undefined") return;

        statesLayer.innerHTML = Object.keys(MAP_DATA.states).map(uf => {
            const s = MAP_DATA.states[uf];
            return `<path class="state-path" d="${s.path}" fill="${s.color}" data-uf="${uf}" style="cursor: pointer; transition: all 0.2s; stroke: rgba(255,255,255,0.18); stroke-width: 1;"></path>`;
        }).join("");

        labelsLayer.innerHTML = Object.keys(MAP_DATA.states).map(uf => {
            const s = MAP_DATA.states[uf];
            if (!s.labelX || !s.labelY) return '';
            return `
                <g class="state-label-group" data-uf="${uf}" style="cursor: pointer;">
                    <rect class="state-badge-rect" x="${s.labelX - 22}" y="${s.labelY - 9}" width="44" height="18" fill="${s.color}" rx="3" style="box-shadow: 0 2px 6px rgba(0,0,0,0.5);"></rect>
                    <text class="state-callout-pin" x="${s.labelX}" y="${s.labelY + 4}" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 8px; font-weight: 700; fill: #ffffff;">${uf} ${s.b3Weight}</text>
                </g>
            `;
        }).join("");

        // Interatividade: Hover e Clique nos Estados
        const handleStateEnter = (e, uf) => {
            const s = MAP_DATA.states[uf];
            if (!s) return;

            const path = statesLayer.querySelector(`path[data-uf="${uf}"]`);
            if (path) {
                path.style.fill = "#ffffff";
                path.style.stroke = s.color;
                path.style.strokeWidth = "2.5";
            }

            const tooltip = document.getElementById("state-detail-tooltip");
            const stage = document.getElementById("main-visual-stage");
            if (!tooltip || !stage) return;

            const dateEl = document.getElementById("tooltip-event-date");
            const badgeEl = document.getElementById("tooltip-event-badge");
            const titleEl = document.getElementById("tooltip-event-title");
            const descEl = document.getElementById("tooltip-event-desc");
            const reactionEl = document.getElementById("tooltip-event-reaction");

            if (dateEl) dateEl.textContent = `${s.name} (${s.uf})`;
            if (badgeEl) badgeEl.textContent = `Peso B3: ${s.b3Weight}`;
            if (titleEl) titleEl.textContent = s.sector;
            if (descEl) descEl.textContent = `${s.politicalImpact} Principais ativos: ${s.stocks.join(", ")}.`;
            if (reactionEl) {
                reactionEl.textContent = `Desempenho regional desde 25/09: ${s.changeSinceSept25}`;
                reactionEl.style.color = "#22c55e";
            }

            const stageRect = stage.getBoundingClientRect();
            let posX = e.clientX - stageRect.left + 15;
            let posY = e.clientY - stageRect.top - 60;

            if (posX + 320 > stageRect.width) posX = posX - 330;
            if (posY < 20) posY = 30;

            tooltip.style.left = `${posX}px`;
            tooltip.style.top = `${posY}px`;
            tooltip.classList.add("visible");
        };

        const handleStateLeave = (uf) => {
            const s = MAP_DATA.states[uf];
            if (!s) return;

            const path = statesLayer.querySelector(`path[data-uf="${uf}"]`);
            if (path) {
                path.style.fill = s.color;
                path.style.stroke = "rgba(255,255,255,0.18)";
                path.style.strokeWidth = "1";
            }

            this._hideEventTooltip();
        };

        statesLayer.querySelectorAll(".state-path").forEach(el => {
            const uf = el.getAttribute("data-uf");
            el.addEventListener("mouseenter", (e) => handleStateEnter(e, uf));
            el.addEventListener("mousemove", (e) => handleStateEnter(e, uf));
            el.addEventListener("mouseleave", () => handleStateLeave(uf));
            el.addEventListener("click", () => {
                const s = MAP_DATA.states[uf];
                if (s && s.stocks.length > 0) {
                    const firstStock = s.stocks[0];
                    if (MARKET_POLITICS_DATA.stocks.some(st => st.symbol === firstStock)) {
                        this._selectActiveAsset(firstStock);
                        document.getElementById("btn-tab-chart").click();
                    }
                }
            });
        });

        labelsLayer.querySelectorAll(".state-label-group").forEach(el => {
            const uf = el.getAttribute("data-uf");
            el.addEventListener("mouseenter", (e) => handleStateEnter(e, uf));
            el.addEventListener("mouseleave", () => handleStateLeave(uf));
        });
    },

    /* ====== 11. Controles de Zoom e Tela Cheia ====== */
    _initZoomControls() {
        const btnZoomIn = document.getElementById("btn-zoom-in");
        const btnZoomOut = document.getElementById("btn-zoom-out");
        const svgMap = document.getElementById("brazil-svg");

        if (btnZoomIn) {
            btnZoomIn.addEventListener("click", () => {
                this.zoomLevel = Math.min(2.0, this.zoomLevel + 0.2);
                if (svgMap) svgMap.style.transform = `scale(${this.zoomLevel})`;
            });
        }

        if (btnZoomOut) {
            btnZoomOut.addEventListener("click", () => {
                this.zoomLevel = Math.max(0.8, this.zoomLevel - 0.2);
                if (svgMap) svgMap.style.transform = `scale(${this.zoomLevel})`;
            });
        }
    },

    _initFullscreenButton() {
        const fsBtn = document.getElementById("btn-fullscreen-trigger");
        if (!fsBtn) return;

        fsBtn.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().then(() => {
                    fsBtn.innerHTML = Icons.get("minimize", "icon-svg", 15);
                }).catch(() => {});
            } else {
                document.exitFullscreen().then(() => {
                    fsBtn.innerHTML = Icons.get("maximize", "icon-svg", 15);
                }).catch(() => {});
            }
        });
    },

    /* ====== 12. Spotlight Search (Ctrl + K) & Acesso Rápido ====== */
    _initSpotlightSearch() {
        const modal = document.getElementById("spotlight-modal");
        const input = document.getElementById("spotlight-input");
        const results = document.getElementById("spotlight-results");
        const trigger = document.getElementById("btn-search-trigger");
        const linkAllStocks = document.getElementById("link-all-stocks");

        if (!modal || !input) return;

        const openSearch = (e) => {
            if (e) e.preventDefault();
            modal.classList.add("open");
            input.value = "";
            input.focus();
            this._renderSearchResults("");
        };

        const closeSearch = () => modal.classList.remove("open");

        if (trigger) trigger.addEventListener("click", openSearch);
        if (linkAllStocks) linkAllStocks.addEventListener("click", openSearch);

        window.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                modal.classList.contains("open") ? closeSearch() : openSearch();
            }
            if (e.key === "Escape" && modal.classList.contains("open")) {
                closeSearch();
            }
        });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeSearch();
        });

        input.addEventListener("input", (e) => {
            this._renderSearchResults(e.target.value.trim().toLowerCase());
        });
    },

    _renderSearchResults(query) {
        const resultsEl = document.getElementById("spotlight-results");
        if (!resultsEl) return;

        const pool = [
            { title: "PETR4 — Petrobras PN", type: "Ação B3", sym: "PETR4", detail: "+5,55% desde 25/09 · Sensibilidade Alta" },
            { title: "VALE3 — Vale ON", type: "Ação B3", sym: "VALE3", detail: "+3,84% desde 25/09 · Mineração e Exportação" },
            { title: "BBAS3 — Banco do Brasil", type: "Ação B3", sym: "BBAS3", detail: "+6,71% desde 25/09 · Crédito e Agronegócio" },
            { title: "ITUB4 — Itaú Unibanco", type: "Ação B3", sym: "ITUB4", detail: "+4,57% desde 25/09 · Bancos Privados" },
            { title: "ELET3 — Eletrobras", type: "Ação B3", sym: "ELET3", detail: "+7,03% desde 25/09 · Energia Elétrica" },
            { title: "IBOVESPA", type: "Índice", sym: "IBOV", detail: "129.650 pts (+3,45% desde 25/09)" },
            { title: "25 de Setembro: Ajustes Fiscais", type: "Fato Político", sym: "IBOV", detail: "Início do rali recente após envio das metas" },
            { title: "03 de Outubro: Plano Petrobras", type: "Fato Político", sym: "PETR4", detail: "Confirmação de política de dividendos e governança" }
        ];

        const filtered = query ? pool.filter(i => i.title.toLowerCase().includes(query) || i.detail.toLowerCase().includes(query)) : pool;

        resultsEl.innerHTML = filtered.map(item => `
            <div class="spotlight-result-item" data-sym="${item.sym}">
                <div class="result-item-left">
                    <span class="result-title">${item.title}</span>
                    <span style="font-size:0.75rem; color:#94a3b8;">${item.detail}</span>
                </div>
                <span class="result-badge">${item.type}</span>
            </div>
        `).join("");

        resultsEl.querySelectorAll(".spotlight-result-item").forEach(el => {
            el.addEventListener("click", () => {
                const s = el.getAttribute("data-sym");
                if (s) this._selectActiveAsset(s);
                document.getElementById("spotlight-modal").classList.remove("open");
            });
        });
    },

    /* ====== 13. B3 Live Ticker Tape Inferior ====== */
    async _initB3TickerTape() {
        const track = document.getElementById("ticker-track-inner");
        if (!track) return;

        const renderTicker = (quotes) => {
            if (!quotes || quotes.length === 0) return;

            const indices = API._cache.indices;
            let items = [...quotes];

            if (indices) {
                if (indices.ibov) {
                    items.unshift({
                        symbol: "IBOVESPA",
                        regularMarketPrice: indices.ibov.points,
                        regularMarketChangePercent: indices.ibov.variation
                    });
                }
                if (indices.usd) {
                    items.unshift({
                        symbol: "USD/BRL",
                        regularMarketPrice: indices.usd.buy,
                        regularMarketChangePercent: indices.usd.variation
                    });
                }
            }

            const html = items.map(q => {
                const isPos = (q.regularMarketChangePercent || 0) >= 0;
                const changeClass = isPos ? "pos" : "neg";
                const arrowIcon = isPos ? Icons.get("chart-up", "arrow-svg", 12) : Icons.get("chart-down", "arrow-svg", 12);
                const priceFormatted = q.symbol === "IBOVESPA"
                    ? Math.round(q.regularMarketPrice).toLocaleString("pt-BR")
                    : `R$ ${q.regularMarketPrice?.toFixed(2).replace('.', ',')}`;

                return `
                    <div class="ticker-item-chip">
                        <span class="ticker-symbol">${q.symbol}</span>
                        <span class="ticker-price">${priceFormatted}</span>
                        <span class="ticker-change ${changeClass}">
                            ${arrowIcon}
                            ${isPos ? '+' : ''}${q.regularMarketChangePercent?.toFixed(2).replace('.', ',')}%
                        </span>
                    </div>
                `;
            }).join("");

            track.innerHTML = html + html;
        };

        try {
            const initialQuotes = await API.fetchQuotes();
            renderTicker(initialQuotes);

            API.startPolling((quotes) => {
                renderTicker(quotes);
            }, () => {});
        } catch (e) {
            console.warn('[Ticker] Erro ao carregar cotações:', e);
        }
    }
};

/* ====== Boot ====== */
document.addEventListener("DOMContentLoaded", () => {
    App.init();
});
