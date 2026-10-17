/* ================================================================
   BOLSA & POLÍTICA — Mapa Setorial e Regional da B3
   Impacto econômico, setores predominantes e ações por UF desde 25/09
   100% Focado na Bolsa de Valores e Risco Político/Regulatório
   ================================================================ */

const MAP_DATA = {
    viewBox: "0 0 700 700",

    // Paleta de Setores Econômicos da B3
    sectorColors: {
        finance: "#3b82f6",     // Financeiro & Bancos (Azul)
        oil: "#f59e0b",         // Petróleo & Gás (Âmbar)
        mining: "#8b5cf6",      // Mineração & Siderurgia (Roxo)
        agro: "#10b981",        // Agronegócio & Alimentos (Esmeralda)
        energy: "#06b6d4",      // Energia Elétrica & Utilities (Ciano)
        industry: "#6366f1",    // Indústria & Bens de Capital (Índigo)
        federal: "#ec4899"      // Centro Regulatório / Decisões Fiscais (Rosa)
    },

    states: {
        "RR": {
            name: "Roraima",
            uf: "RR",
            sector: "Segurança Energética & Logística",
            b3Weight: "0,1%",
            changeSinceSept25: "+2,4%",
            color: "#6366f1",
            labelX: 255,
            labelY: 90,
            path: "M 220 25 L 265 40 L 285 85 L 265 125 L 235 120 L 210 90 L 215 50 Z",
            stocks: ["ELET3", "EMBR3"],
            politicalImpact: "Conexão ao Sistema Interligado Nacional (SIN) e logística de fronteira."
        },
        "AP": {
            name: "Amapá",
            uf: "AP",
            sector: "Petróleo Offshore (Margem Equatorial)",
            b3Weight: "0,4%",
            changeSinceSept25: "+4,1%",
            color: "#f59e0b",
            labelX: 395,
            labelY: 105,
            path: "M 370 55 L 405 85 L 400 135 L 365 140 L 355 100 Z",
            stocks: ["PETR4", "PRIO3"],
            politicalImpact: "Licenciamento ambiental do IBAMA na bacia da Foz do Amazonas para a Petrobras."
        },
        "AM": {
            name: "Amazonas",
            uf: "AM",
            sector: "Polo Industrial de Manaus & Consumo",
            b3Weight: "1,2%",
            changeSinceSept25: "+2,8%",
            color: "#6366f1",
            labelX: 195,
            labelY: 185,
            path: "M 115 110 L 215 90 L 265 125 L 265 175 L 280 230 L 225 245 L 175 220 L 115 240 L 80 185 L 90 135 Z",
            stocks: ["MGLU3", "AMER3", "POSI3"],
            politicalImpact: "Manutenção de incentivos fiscais da ZFM na regulamentação da Reforma Tributária."
        },
        "PA": {
            name: "Pará",
            uf: "PA",
            sector: "Mineração de Ferro & Hidrelétricas",
            b3Weight: "4,5%",
            changeSinceSept25: "+5,2%",
            color: "#8b5cf6",
            labelX: 350,
            labelY: 180,
            path: "M 265 125 L 355 100 L 370 140 L 415 155 L 420 220 L 385 245 L 335 255 L 280 230 L 265 175 Z",
            stocks: ["VALE3", "ELET3", "CMIN3"],
            politicalImpact: "Complexo mineral de Carajás da Vale e marco regulatório de ferrovias da B3."
        },
        "MA": {
            name: "Maranhão",
            uf: "MA",
            sector: "Logística Portuária & Exportação Mineral",
            b3Weight: "1,1%",
            changeSinceSept25: "+3,9%",
            color: "#8b5cf6",
            labelX: 435,
            labelY: 200,
            path: "M 415 155 L 465 165 L 475 210 L 440 250 L 415 240 L 420 220 Z",
            stocks: ["VALE3", "RAIL3"],
            politicalImpact: "Porto de Itaqui, escoamento de grãos e minério de ferro de alta pureza."
        },
        "PI": {
            name: "Piauí",
            uf: "PI",
            sector: "Agronegócio MATOPIBA & Energia Solar",
            b3Weight: "0,7%",
            changeSinceSept25: "+4,5%",
            color: "#10b981",
            labelX: 470,
            labelY: 235,
            path: "M 465 165 L 485 180 L 490 240 L 465 270 L 440 250 L 475 210 Z",
            stocks: ["AGRO3", "CPFE3"],
            politicalImpact: "Expansão de parques fotovoltaicos e linhas de transmissão leiloadas pela ANEEL."
        },
        "CE": {
            name: "Ceará",
            uf: "CE",
            sector: "Hidrogênio Verde & Saúde",
            b3Weight: "1,3%",
            changeSinceSept25: "+3,2%",
            color: "#06b6d4",
            labelX: 520,
            labelY: 195,
            path: "M 485 180 L 530 180 L 535 220 L 490 225 L 490 240 Z",
            stocks: ["HAPV3", "ALPA4", "GRND3"],
            politicalImpact: "Marco regulatório do Hidrogênio de Baixo Carbono e Hub do Pecém."
        },
        "RN": {
            name: "Rio Grande do Norte",
            uf: "RN",
            sector: "Energia Eólica & Petróleo Terrestre",
            b3Weight: "0,8%",
            changeSinceSept25: "+4,6%",
            color: "#f59e0b",
            labelX: 585,
            labelY: 190,
            path: "M 530 180 L 565 185 L 560 210 L 535 210 Z",
            stocks: ["PRIO3", "RECV3", "EGIE3"],
            politicalImpact: "Campos maduros desinvestidos pela Petrobras operados por junior oils na B3."
        },
        "PB": {
            name: "Paraíba",
            uf: "PB",
            sector: "Serviços, Varejo & Calçados",
            b3Weight: "0,4%",
            changeSinceSept25: "+2,1%",
            color: "#6366f1",
            labelX: 585,
            labelY: 220,
            path: "M 535 210 L 565 210 L 560 230 L 525 230 Z",
            stocks: ["ALPA4", "VIVA3"],
            politicalImpact: "Incentivos de ICMS para centros de distribuição no Nordeste."
        },
        "PE": {
            name: "Pernambuco",
            uf: "PE",
            sector: "Refino de Petróleo & Polo Automotivo",
            b3Weight: "1,5%",
            changeSinceSept25: "+3,7%",
            color: "#f59e0b",
            labelX: 585,
            labelY: 248,
            path: "M 490 225 L 560 230 L 555 245 L 485 245 Z",
            stocks: ["PETR4", "BRKM5"],
            politicalImpact: "Investimentos do Plano Estratégico da Petrobras na Refinaria Abreu e Lima (Rnest)."
        },
        "AL": {
            name: "Alagoas",
            uf: "AL",
            sector: "Química & Açúcar/Etanol",
            b3Weight: "0,5%",
            changeSinceSept25: "+1,8%",
            color: "#10b981",
            labelX: 585,
            labelY: 275,
            path: "M 525 245 L 555 245 L 545 260 L 520 255 Z",
            stocks: ["BRKM5", "SMTO3"],
            politicalImpact: "Acordos regulatórios sobre subsídios ambientais e precificação de biocombustíveis."
        },
        "SE": {
            name: "Sergipe",
            uf: "SE",
            sector: "Gás Natural em Águas Profundas",
            b3Weight: "0,6%",
            changeSinceSept25: "+4,3%",
            color: "#f59e0b",
            labelX: 585,
            labelY: 302,
            path: "M 520 255 L 545 260 L 535 275 L 515 270 Z",
            stocks: ["PETR4", "ENAT3"],
            politicalImpact: "Projeto Sergipe Águas Profundas (SEAP) com contratação de novas plataformas."
        },
        "BA": {
            name: "Bahia",
            uf: "BA",
            sector: "Petroquímica, Celulose & Eólicas",
            b3Weight: "3,1%",
            changeSinceSept25: "+4,8%",
            color: "#06b6d4",
            labelX: 485,
            labelY: 300,
            path: "M 440 250 L 485 245 L 515 270 L 530 330 L 490 365 L 435 345 L 440 280 Z",
            stocks: ["SUZB3", "BRKM5", "AURE3"],
            politicalImpact: "Polo de Camaçari, transição para energias renováveis e tarifas de transmissão."
        },
        "TO": {
            name: "Tocantins",
            uf: "TO",
            sector: "Logística Ferroviária & Grãos",
            b3Weight: "0,6%",
            changeSinceSept25: "+5,1%",
            color: "#10b981",
            labelX: 395,
            labelY: 280,
            path: "M 385 245 L 415 240 L 440 280 L 415 345 L 375 330 L 375 275 Z",
            stocks: ["RAIL3", "SLCE3"],
            politicalImpact: "Operação da Ferrovia Norte-Sul e escoamento acelerado de soja para a B3."
        },
        "RO": {
            name: "Rondônia",
            uf: "RO",
            sector: "Frigoríficos & Pecuária de Corte",
            b3Weight: "0,7%",
            changeSinceSept25: "+3,6%",
            color: "#10b981",
            labelX: 205,
            labelY: 280,
            path: "M 175 220 L 225 245 L 235 295 L 195 320 L 165 275 Z",
            stocks: ["JBSS3", "BEEF3", "MRFG3"],
            politicalImpact: "Habilitação sanitária de frigoríficos para exportação e crédito do Plano Safra."
        },
        "AC": {
            name: "Acre",
            uf: "AC",
            sector: "Logística Bioceânica & Florestal",
            b3Weight: "0,1%",
            changeSinceSept25: "+1,9%",
            color: "#10b981",
            labelX: 85,
            labelY: 255,
            path: "M 80 185 L 115 240 L 175 220 L 165 275 L 105 280 L 65 225 Z",
            stocks: ["DXCO3"],
            politicalImpact: "Projetos de infraestrutura de conexão ao Pacífico para exportações à Ásia."
        },
        "MT": {
            name: "Mato Grosso",
            uf: "MT",
            sector: "Líder Global em Soja, Milho & Proteína",
            b3Weight: "4,8%",
            changeSinceSept25: "+6,9%",
            color: "#10b981",
            labelX: 295,
            labelY: 300,
            path: "M 225 245 L 280 230 L 335 255 L 375 275 L 365 355 L 295 385 L 235 295 Z",
            stocks: ["AGRO3", "SLCE3", "RAIL3", "JBSS3"],
            politicalImpact: "Preço de paridade de exportação, safra recorde e juros subsidiados do agronegócio."
        },
        "GO": {
            name: "Goiás",
            uf: "GO",
            sector: "Polo Farmoquímico & Agroindústria",
            b3Weight: "2,2%",
            changeSinceSept25: "+5,4%",
            color: "#10b981",
            labelX: 375,
            labelY: 385,
            path: "M 365 355 L 415 345 L 435 390 L 390 435 L 350 415 Z",
            stocks: ["HYPR3", "CMIN3", "JALL3"],
            politicalImpact: "Incentivos industriais ao DAIA e alta produtividade sucroalcooleira."
        },
        "DF": {
            name: "Distrito Federal",
            uf: "DF",
            sector: "Centro das Decisões Fiscais, Regulatórias & STF",
            b3Weight: "2,0%",
            changeSinceSept25: "+3,8%",
            color: "#ec4899",
            labelX: 425,
            labelY: 355,
            path: "M 400 370 L 415 370 L 415 385 L 400 385 Z",
            stocks: ["BBAS3", "ITUB4", "BBDC4"],
            politicalImpact: "Ponto focal de risco político: metas fiscais da Fazenda, Copom e votações no Congresso."
        },
        "MS": {
            name: "Mato Grosso do Sul",
            uf: "MS",
            sector: "Vale da Celulose & Bioenergia",
            b3Weight: "1,9%",
            changeSinceSept25: "+6,1%",
            color: "#10b981",
            labelX: 295,
            labelY: 425,
            path: "M 295 385 L 350 415 L 340 475 L 285 465 L 265 415 Z",
            stocks: ["SUZB3", "KLBN11", "SMTO3"],
            politicalImpact: "Novas megafábricas de celulose e alta da demanda de exportação para a China."
        },
        "MG": {
            name: "Minas Gerais",
            uf: "MG",
            sector: "Mineração de Ferro, Siderurgia & Energia",
            b3Weight: "11,2%",
            changeSinceSept25: "+5,9%",
            color: "#8b5cf6",
            labelX: 460,
            labelY: 410,
            path: "M 435 345 L 490 365 L 505 405 L 470 455 L 410 445 L 435 390 Z",
            stocks: ["VALE3", "USIM5", "CMIG4", "CSMG3"],
            politicalImpact: "Debates sobre federalização e privatização da Cemig/Copasa e acordo do Rio Doce da Vale."
        },
        "ES": {
            name: "Espírito Santo",
            uf: "ES",
            sector: "Pelotização de Minério, Portos & Petróleo",
            b3Weight: "2,1%",
            changeSinceSept25: "+4,9%",
            color: "#8b5cf6",
            labelX: 555,
            labelY: 420,
            path: "M 505 405 L 530 415 L 520 445 L 495 440 Z",
            stocks: ["VALE3", "PRIO3"],
            politicalImpact: "Terminal portuário de Tubarão e exploração do pré-sal na Bacia do Espírito Santo."
        },
        "RJ": {
            name: "Rio de Janeiro",
            uf: "RJ",
            sector: "Petróleo Offshore & Sede das Grandes Estatais",
            b3Weight: "18,4%",
            changeSinceSept25: "+5,6%",
            color: "#f59e0b",
            labelX: 555,
            labelY: 445,
            path: "M 470 455 L 520 445 L 510 470 L 460 470 Z",
            stocks: ["PETR4", "VALE3", "PRIO3", "ELET3"],
            politicalImpact: "Preço de paridade internacional dos combustíveis, royalties e conselho da Petrobras."
        },
        "SP": {
            name: "São Paulo",
            uf: "SP",
            sector: "Coração Financeiro da B3, Bancos & Indústria",
            b3Weight: "54,2%",
            changeSinceSept25: "+5,5%",
            color: "#3b82f6",
            labelX: 405,
            labelY: 470,
            path: "M 340 475 L 390 435 L 410 445 L 460 470 L 435 505 L 360 500 Z",
            stocks: ["B3SA3", "ITUB4", "BBDC4", "ABEV3", "WEGE3"],
            politicalImpact: "Sede da B3 e dos maiores bancos; epicentro do fluxo financeiro institucional e estrangeiro."
        },
        "PR": {
            name: "Paraná",
            uf: "PR",
            sector: "Energia Elétrica, Saneamento & Agro",
            b3Weight: "3,8%",
            changeSinceSept25: "+4,8%",
            color: "#06b6d4",
            labelX: 375,
            labelY: 530,
            path: "M 340 475 L 360 500 L 435 505 L 420 545 L 340 545 Z",
            stocks: ["CPLE6", "SAPR4", "KLBN11"],
            politicalImpact: "Copel operando com modelo de corporation privada na B3 e estabilidade de tarifas."
        },
        "SC": {
            name: "Santa Catarina",
            uf: "SC",
            sector: "Motores Elétricos, Bens de Capital & Portos",
            b3Weight: "4,2%",
            changeSinceSept25: "+6,4%",
            color: "#6366f1",
            labelX: 435,
            labelY: 565,
            path: "M 340 545 L 420 545 L 410 580 L 345 580 Z",
            stocks: ["WEGE3", "TUPY3", "SHUL4"],
            politicalImpact: "Resiliência global da WEG com faturamento internacional em dólares e baixo risco político."
        },
        "RS": {
            name: "Rio Grande do Sul",
            uf: "RS",
            sector: "Siderurgia, Bancos Regionais & Grãos",
            b3Weight: "3,1%",
            changeSinceSept25: "+3,9%",
            color: "#8b5cf6",
            labelX: 350,
            labelY: 615,
            path: "M 345 580 L 410 580 L 395 645 L 325 645 L 310 600 Z",
            stocks: ["GGBR4", "BRSR6", "SLCE3"],
            politicalImpact: "Créditos extraordinários para reconstrução estrutural e safra de trigo/arroz."
        }
    },

    regions: [
        { name: "Sudeste", weight: "74% do IBOVESPA", leader: "Financeiro & Petróleo", pct: "+5,4%", stocks: ["PETR4", "VALE3", "ITUB4", "BBDC4"], color: "#3b82f6" },
        { name: "Sul", weight: "11% do IBOVESPA", leader: "Bens de Capital & Celulose", pct: "+4,8%", stocks: ["WEGE3", "GGBR4", "CPLE6", "KLBN11"], color: "#6366f1" },
        { name: "Centro-Oeste", weight: "8% do IBOVESPA", leader: "Agronegócio & Logística", pct: "+6,8%", stocks: ["SLCE3", "AGRO3", "RAIL3"], color: "#10b981" },
        { name: "Nordeste", weight: "5% do IBOVESPA", leader: "Energia Renovável & Óleo", pct: "+3,5%", stocks: ["AURE3", "PRIO3", "SUZB3"], color: "#06b6d4" },
        { name: "Norte", weight: "2% do IBOVESPA", leader: "Mineração de Ferro Carajás", pct: "+4,2%", stocks: ["VALE3", "ELET3"], color: "#8b5cf6" }
    ]
};
