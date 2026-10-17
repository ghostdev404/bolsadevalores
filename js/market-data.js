/* ================================================================
   BOLSA & POLÍTICA — Dados Históricos de Impacto B3 desde 25/09
   Cronologia de eventos políticos e movimentação das ações da B3
   ================================================================ */

const MARKET_POLITICS_DATA = {

    startDate: "25 de Setembro de 2026",
    currentDate: "17 de Outubro de 2026 (Tempo Real)",

    // Comparativo Superior: Estatais (sensíveis ao governo) vs Privadas/Exportadoras
    summaryImpact: {
        estatais: {
            label: "Índice de Estatais B3",
            subtitle: "PETR4, BBAS3, ELET3",
            variationSinceSept25: "+4,85%",
            currentAvgPrice: "R$ 38,95",
            volatility: "Alta (Sensibilidade Política: 89%)",
            color: "#e11d48"
        },
        privadas: {
            label: "Privadas & Exportadoras",
            subtitle: "VALE3, ITUB4, WEGE3",
            variationSinceSept25: "+6,12%",
            currentAvgPrice: "R$ 48,20",
            volatility: "Moderada (Sensibilidade: 42%)",
            color: "#2563eb"
        },
        marketStatus: "Mercado precifica governabilidade e responsabilidade fiscal desde 25/09",
        ibovSinceSept25: "+3,45%",
        dollarSinceSept25: "-1,82%"
    },

    // Ações monitoradas com Sensibilidade Política e dados desde 25/09
    stocks: [
        {
            symbol: "PETR4",
            name: "Petrobras PN",
            sector: "Óleo & Gás (Estatal)",
            priceSept25: 36.90,
            currentPrice: 38.95,
            changeSinceSept25: 5.55,
            dailyChange: 0.39,
            politicalSensitivity: 92, // Alta
            politicalDriver: "Dividendos extraordinários, paridade internacional e governança do conselho.",
            history: [36.90, 37.35, 38.10, 38.60, 38.25, 38.95]
        },
        {
            symbol: "VALE3",
            name: "Vale ON",
            sector: "Mineração (Privada)",
            priceSept25: 59.80,
            currentPrice: 62.10,
            changeSinceSept25: 3.84,
            dailyChange: 0.75,
            politicalSensitivity: 38, // Baixa
            politicalDriver: "Concessões ferroviárias, tributação de minérios e demanda da China.",
            history: [59.80, 60.40, 60.90, 61.50, 61.10, 62.10]
        },
        {
            symbol: "BBAS3",
            name: "Banco do Brasil",
            sector: "Financeiro (Estatal)",
            priceSept25: 26.80,
            currentPrice: 28.60,
            changeSinceSept25: 6.71,
            dailyChange: 0.42,
            politicalSensitivity: 86, // Alta
            politicalDriver: "Plano Safra, subsídios de crédito e dividendos para o Tesouro Nacional.",
            history: [26.80, 27.20, 27.65, 28.15, 27.80, 28.60]
        },
        {
            symbol: "ITUB4",
            name: "Itaú Unibanco",
            sector: "Bancos (Privado)",
            priceSept25: 33.90,
            currentPrice: 35.45,
            changeSinceSept25: 4.57,
            dailyChange: 0.52,
            politicalSensitivity: 55, // Média
            politicalDriver: "Taxa Selic, spread bancário e alíquotas do IVA na Reforma Tributária.",
            history: [33.90, 34.30, 34.75, 35.10, 34.85, 35.45]
        },
        {
            symbol: "BBDC4",
            name: "Bradesco PN",
            sector: "Bancos (Privado)",
            priceSept25: 15.10,
            currentPrice: 15.68,
            changeSinceSept25: 3.84,
            dailyChange: -0.20,
            politicalSensitivity: 52,
            politicalDriver: "Inadimplência de famílias, juros futuros e crédito consignado.",
            history: [15.10, 15.30, 15.45, 15.60, 15.40, 15.68]
        },
        {
            symbol: "ELET3",
            name: "Eletrobras ON",
            sector: "Energia (Privatizada)",
            priceSept25: 39.80,
            currentPrice: 42.60,
            changeSinceSept25: 7.03,
            dailyChange: 1.15,
            politicalSensitivity: 95, // Altíssima
            politicalDriver: "Ações no STF sobre poder de voto da União e risco de reestatização.",
            history: [39.80, 40.50, 41.20, 42.10, 41.70, 42.60]
        }
    ],

    // Cronologia Oficial de Eventos Políticos e Reação da Bolsa (Desde 25 de Setembro)
    timelineEvents: [
        {
            date: "25 de Setembro",
            time: "10:30",
            title: "Governo envia ajustes fiscais e trava meta de superávit",
            description: "Ministério da Fazenda apresenta parâmetros para 2027. Investidores cobram controle mais rígido de despesas.",
            b3Reaction: "IBOVESPA recua -1,45% e Dólar vai a R$ 5,14.",
            ibov: 126900,
            dollar: 5.14,
            impactType: "negative",
            keyAssets: "Dólar (+1,1%) · IBOVESPA (-1,45%)"
        },
        {
            date: "29 de Setembro",
            time: "14:15",
            title: "Pesquisas apontam equilíbrio e Congresso de perfil reformista",
            description: "Sondagens eleitorais mostram formação de maioria conservadora/liberal na Câmara e Senado, afastando temores de rupturas econômicas.",
            b3Reaction: "Bolsa dispara +1,85% com forte compra de estatais e bancos.",
            ibov: 128400,
            dollar: 5.09,
            impactType: "positive",
            keyAssets: "PETR4 (+2,4%) · ELET3 (+3,4%) · BBAS3 (+2,8%)"
        },
        {
            date: "03 de Outubro",
            time: "11:00",
            title: "Petrobras confirma plano estratégico sem intervenção em preços",
            description: "Diretoria e conselho da estatal reiteram compromisso com rentabilidade e distribuição de dividendos ordinários.",
            b3Reaction: "Confiança internacional atrai R$ 850 mi de investidores estrangeiros.",
            ibov: 129300,
            dollar: 5.08,
            impactType: "positive",
            keyAssets: "PETR4 (+1,6%) · PRIO3 (+2,1%)"
        },
        {
            date: "08 de Outubro",
            time: "16:40",
            title: "Senado vota regulamentação de alíquotas da Reforma Tributária",
            description: "Aprovação de travas para alíquotas máximas de serviços e incentivos para bens de capital traz alívio ao setor produtivo.",
            b3Reaction: "Setor de varejo e indústria ganham tração na B3.",
            ibov: 129850,
            dollar: 5.07,
            impactType: "positive",
            keyAssets: "WEGE3 (+2,2%) · ITUB4 (+1,5%)"
        },
        {
            date: "12 de Outubro",
            time: "15:20",
            title: "Debates e disputa em SP e MG aumentam volatilidade na renda fixa",
            description: "Declarações sobre privatizações estaduais (Sabesp, Cemig, Copasa) geram movimentos especulativos no pregão.",
            b3Reaction: "Ações de saneamento e elétricas estaduais em alta forte.",
            ibov: 129100,
            dollar: 5.08,
            impactType: "neutral",
            keyAssets: "CMIG4 (+3,1%) · CSMG3 (+2,9%)"
        },
        {
            date: "17 de Outubro (Hoje)",
            time: "Tempo Real",
            title: "Pregão Ao Vivo: Definição do cenário político impulsiona a B3",
            description: "Consolidação de governadores pró-mercado e alívio de risco institucional sustentam o IBOVESPA em patamar elevado.",
            b3Reaction: "Mercado opera em alta com volume financeiro acima da média.",
            ibov: 129650,
            dollar: 5.06,
            impactType: "positive",
            keyAssets: "IBOVESPA (+0,54%) · Dólar (-0,69%)"
        }
    ],

    // Mapa de Impacto Regional da Política na B3
    regionsMarketImpact: [
        {
            region: "Sudeste (SP / RJ / MG / ES)",
            weightInIbov: "74% do IBOVESPA",
            mainSectors: "Bancos, Óleo & Gás, Siderurgia",
            stocks: ["PETR4", "VALE3", "ITUB4", "BBDC4"],
            politicalTheme: "Privatizações (Cemig, Sabesp), royalties e sede da B3.",
            sentiment: "Otimista (+5,4% desde 25/09)"
        },
        {
            region: "Sul (PR / SC / RS)",
            weightInIbov: "11% do IBOVESPA",
            mainSectors: "Bens de Capital, Papel & Celulose, Metalmecânica",
            stocks: ["WEGE3", "GGBR4", "CPLE6", "KLBN11"],
            politicalTheme: "Reconstrução do RS, marco regulatório industrial e crédito.",
            sentiment: "Favorável (+4,2% desde 25/09)"
        },
        {
            region: "Centro-Oeste (MT / GO / MS / DF)",
            weightInIbov: "8% do IBOVESPA",
            mainSectors: "Agronegócio, Fertilizantes e Logística",
            stocks: ["SLCE3", "AGRO3", "RAIL3"],
            politicalTheme: "Bancada ruralista, Plano Safra e ferrovias de escoamento.",
            sentiment: "Muito Favorável (+6,8% desde 25/09)"
        },
        {
            region: "Nordeste & Norte",
            weightInIbov: "7% do IBOVESPA",
            mainSectors: "Energia Renovável, Mineração e Varejo de Consumo",
            stocks: ["VALE3", "AURE3", "MGLU3"],
            politicalTheme: "Margem Equatorial da Petrobras, programas sociais e hidrogênio verde.",
            sentiment: "Sensível a Programas Sociais (+3,1%)"
        }
    ]
};
