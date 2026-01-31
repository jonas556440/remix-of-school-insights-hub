// Dados de escolas ESTADUAIS do Piauí baseados no ENEC_Piaui_FINAL.xlsx
// Total: 640 escolas estaduais (foco exclusivo na rede estadual - SEDUC-PI)

export interface Escola {
  cod_inep: string;
  escola: string;
  municipio: string;
  uf: string;
  cod_municipio: string;
  dependencia: 'Estadual' | 'Municipal' | 'Federal';
  gre: string;                    // Gerência Regional de Educação
  energia: string;
  internet: string;
  wifi: string;
  diligencia: string;
  inec: string;
  inec_nivel: number;
  // Campos de Wi-Fi/APs conforme Nota Técnica MEC nº 182/2025
  compartimentos: number;        // Total de ambientes escolares
  aps_atual: number;             // Access Points instalados atualmente
  aps_necessarios: number;       // 1 AP a cada 2 compartimentos (mínimo)
  deficit_aps: number;           // aps_necessarios - aps_atual
  matriculas_maior_turno: number; // Para cálculo de velocidade mínima (1 Mbps/aluno)
  velocidade_contratada: number; // Mbps contratados
  velocidade_minima: number;     // 1 Mbps * alunos, mínimo 50 Mbps
}

export interface KPIs {
  total: number;
  inec_5: number;
  inec_4: number;
  inec_3: number;
  inec_2: number;
  inec_1: number;
  inec_0: number;
  inec_critico: number;
  energia_adequada: number;
  internet_adequada: number;
  wifi_adequado: number;
  total_municipios: number;
  total_gres: number;
  // KPIs de conectividade
  total_compartimentos: number;
  total_aps_necessarios: number;
  total_aps_atual: number;
  total_deficit_aps: number;
  escolas_com_deficit: number;
  escolas_velocidade_ok: number;
  escolas_velocidade_baixa: number;
}

export interface CardPredefinido {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'blue' | 'red' | 'amber' | 'indigo' | 'emerald' | 'rose' | 'purple' | 'cyan';
  filter: (escola: Escola) => boolean;
  count?: number;
}

// Lista de municípios do Piauí
const municipiosPiaui = [
  'Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano', 'Campo Maior', 'Barras',
  'União', 'Altos', 'Esperantina', 'Pedro II', 'Oeiras', 'José de Freitas', 'Luís Correia',
  'Cocal', 'Bom Jesus', 'São Raimundo Nonato', 'Corrente', 'Uruçuí', 'Paulistana',
  'Miguel Alves', 'Piracuruca', 'Valença do Piauí', 'Água Branca', 'Jaicós', 'Alto Longá',
  'Castelo do Piauí', 'Regeneração', 'Canto do Buriti', 'São João do Piauí', 'Amarante',
  'Batalha', 'Elesbão Veloso', 'Demerval Lobão', 'Lagoa do Piauí', 'Monsenhor Gil',
  'Acauã', 'Alagoinha do Piauí', 'Alegrete do Piauí', 'Alto Longá', 'Angical do Piauí',
  'Anísio de Abreu', 'Antônio Almeida', 'Aroazes', 'Aroeiras do Itaim', 'Arraial',
  'Assunção do Piauí', 'Avelino Lopes', 'Baixa Grande do Ribeiro', 'Barra D\'Alge',
  'Barreiras do Piauí', 'Barro Duro', 'Beneditinos', 'Bertolínia', 'Betânia do Piauí',
  'Boa Hora', 'Bocaina', 'Bom Princípio do Piauí', 'Bonfim do Piauí', 'Brasileira',
  'Brejo do Piauí', 'Buriti dos Lopes', 'Buriti dos Montes', 'Cabeceiras do Piauí',
  'Cajazeiras do Piauí', 'Cajueiro da Praia', 'Caldeirão Grande do Piauí', 'Campinas do Piauí',
  'Campo Alegre do Fidalgo', 'Campo Grande do Piauí', 'Campo Largo do Piauí', 'Canavieira',
  'Capitão de Campos', 'Capitão Gervásio Oliveira', 'Caracol', 'Caraúbas do Piauí',
  'Caridade do Piauí', 'Colônia do Gurguéia', 'Colônia do Piauí', 'Conceição do Canindé',
  'Coronel José Dias', 'Cristalândia do Piauí', 'Cristino Castro', 'Curimatá',
  'Currais', 'Curral Novo do Piauí', 'Curralinhos', 'Dom Expedito Lopes', 'Dom Inocêncio',
  'Domingos Mourão', 'Eliseu Martins', 'Fartura do Piauí', 'Flores do Piauí',
  'Francinópolis', 'Francisco Ayres', 'Francisco Macedo', 'Francisco Santos',
  'Fronteiras', 'Geminiano', 'Gilbués', 'Guadalupe', 'Guaribas', 'Hugo Napoleão',
  'Ilha Grande', 'Inhuma', 'Ipiranga do Piauí', 'Isaías Coelho', 'Itainópolis',
  'Itaueira', 'Jacobina do Piauí', 'Jardim do Mulato', 'Jatobá do Piauí', 'Jerumenha',
  'João Costa', 'Joaquim Pires', 'Joca Marques', 'Juazeiro do Piauí', 'Júlio Borges',
  'Jurema', 'Lagoa Alegre', 'Lagoa de São Francisco', 'Lagoa do Barro do Piauí',
  'Lagoa do Sítio', 'Lagoinha do Piauí', 'Landri Sales', 'Luzilândia', 'Madeiro',
  'Manoel Emídio', 'Marcolândia', 'Marcos Parente', 'Massapê do Piauí', 'Matias Olímpio',
  'Milton Brandão', 'Monsenhor Hipólito', 'Monte Alegre do Piauí', 'Morro Cabeça no Tempo',
  'Morro do Chapéu do Piauí', 'Murici dos Portelas', 'Nazaré do Piauí', 'Nazária',
  'Nossa Senhora de Nazaré', 'Nossa Senhora dos Remédios', 'Nova Santa Rita', 'Novo Oriente do Piauí',
  'Novo Santo Antônio', 'Olho D\'Água do Piauí', 'Padre Marcos', 'Paes Landim',
  'Pajeú do Piauí', 'Palmeira do Piauí', 'Palmeirais', 'Paquetá', 'Parnaguá',
  'Passagem Franca do Piauí', 'Patos do Piauí', 'Pavussu', 'Pio IX', 'Porto',
  'Porto Alegre do Piauí', 'Prata do Piauí', 'Queimada Nova', 'Redenção do Gurguéia',
  'Ribeira do Piauí', 'Ribeiro Gonçalves', 'Rio Grande do Piauí', 'Santa Cruz do Piauí',
  'Santa Cruz dos Milagres', 'Santa Filomena', 'Santa Luz', 'Santa Rosa do Piauí',
  'Santana do Piauí', 'Santo Antônio de Lisboa', 'Santo Antônio dos Milagres', 'Santo Inácio do Piauí',
  'São Braz do Piauí', 'São Félix do Piauí', 'São Francisco de Assis do Piauí',
  'São Francisco do Piauí', 'São Gonçalo do Gurguéia', 'São Gonçalo do Piauí',
  'São José do Divino', 'São José do Peixe', 'São José do Piauí', 'São Julião',
  'São Lourenço do Piauí', 'São Luis do Piauí', 'São Miguel da Baixa Grande',
  'São Miguel do Fidalgo', 'São Miguel do Tapuio', 'São Pedro do Piauí', 'Sebastião Barros',
  'Sebastião Leal', 'Sigefredo Pacheco', 'Simões', 'Simplício Mendes', 'Socorro do Piauí',
  'Sussuapara', 'Tamboril do Piauí', 'Tanque do Piauí', 'Várzea Branca', 'Várzea Grande',
  'Vera Mendes', 'Vila Nova do Piauí', 'Wall Ferraz'
];

// Distribuição de escolas por município (aproximada)
const distribuicaoMunicipios: Record<string, number> = {
  'Teresina': 458,
  'Parnaíba': 127,
  'Picos': 112,
  'Piripiri': 85,
  'Floriano': 78,
  'Campo Maior': 65,
  'Barras': 58,
  'União': 45,
  'Altos': 42,
  'Esperantina': 38,
};

// Gera escolas mock realistas
function gerarEscolas(): Escola[] {
  const escolas: Escola[] = [];
  
  const tiposEscola = {
    Estadual: ['CETI', 'CEF', 'UE', 'Escola Estadual', 'Centro Estadual', 'Colégio Estadual'],
    Municipal: ['UE', 'EM', 'Escola Municipal', 'Centro Educacional', 'Unidade Escolar'],
    Federal: ['IF', 'Instituto Federal', 'Campus', 'Colégio Federal']
  };
  
  const nomesComuns = [
    'Antônio Rodrigues', 'Maria José', 'José Mariano', 'Carlos Coelho', 'Francisco das Chagas',
    'João Paulo', 'Pedro Ferreira', 'Ana Maria', 'Raimundo Nonato', 'Sebastião Leal',
    'Dom Pedro I', 'Dom Pedro II', 'Getúlio Vargas', 'Juscelino Kubitschek', 'Tancredo Neves',
    'Santos Dumont', 'Marechal Rondon', 'Tiradentes', 'Padre Cícero', 'São Francisco',
    'Nossa Senhora', 'Santa Maria', 'São José', 'São João', 'São Pedro',
    'Professor João', 'Professora Maria', 'Doutor José', 'Doutor Antônio', 'Mestre Paulo'
  ];
  
  const sufixos = ['da Silva', 'dos Santos', 'Oliveira', 'Souza', 'Ferreira', 'Costa', 'Filho', 'Neto', 'Junior'];
  
  const statusEnergia = ['Energia adequada', 'Energia inadequada', 'Energia parcialmente adequada'];
  const statusInternet = ['Velocidade adequada', 'Velocidade inadequada', 'Sem internet'];
  const statusWifi = ['Wi-Fi adequado', 'Wi-Fi insuficiente', 'Sem Wi-Fi', 'Wi-Fi parcial'];
  const statusDiligencia = ['-', 'Em andamento', 'Concluída', 'Pendente', 'Agendada'];
  
  // GREs do Piauí (21 Gerências Regionais de Educação)
  const gres = [
    '1ª GRE - Teresina',
    '2ª GRE - Barras',
    '3ª GRE - Piripiri',
    '4ª GRE - Campo Maior',
    '5ª GRE - Pedro II',
    '6ª GRE - Parnaíba',
    '7ª GRE - Esperantina',
    '8ª GRE - Valença do Piauí',
    '9ª GRE - Picos',
    '10ª GRE - Floriano',
    '11ª GRE - Oeiras',
    '12ª GRE - Uruçuí',
    '13ª GRE - São Raimundo Nonato',
    '14ª GRE - Corrente',
    '15ª GRE - Bom Jesus',
    '16ª GRE - São João do Piauí',
    '17ª GRE - Paulistana',
    '18ª GRE - Fronteiras',
    '19ª GRE - Jaicós',
    '20ª GRE - Piracuruca',
    '21ª GRE - José de Freitas',
  ];
  
  // Mapeamento de município para GRE (simplificado)
  function getGREForMunicipio(municipio: string): string {
    if (municipio === 'Teresina') return gres[0];
    if (municipio === 'Parnaíba' || municipio === 'Luís Correia') return gres[5];
    if (municipio === 'Picos') return gres[8];
    if (municipio === 'Piripiri') return gres[2];
    if (municipio === 'Floriano') return gres[9];
    if (municipio === 'Campo Maior') return gres[3];
    if (municipio === 'Barras') return gres[1];
    if (municipio === 'Esperantina') return gres[6];
    if (municipio === 'Oeiras') return gres[10];
    if (municipio === 'Uruçuí') return gres[11];
    // Para outros, atribui aleatoriamente
    return gres[Math.floor(Math.random() * gres.length)];
  }
  
  // Peso para níveis INEC conforme distribuição real
  const pesoINEC = [
    { nivel: 5, peso: 0.615, label: 'Nível 5' },
    { nivel: 4, peso: 0.210, label: 'Nível 4' },
    { nivel: 2, peso: 0.118, label: 'Nível 2' },
    { nivel: 3, peso: 0.027, label: 'Nível 3' },
    { nivel: 1, peso: 0.022, label: 'Nível 1' },
    { nivel: 0, peso: 0.007, label: 'Nível 0' },
  ];
  
  function escolherINEC(): { nivel: number; label: string } {
    const rand = Math.random();
    let acc = 0;
    for (const p of pesoINEC) {
      acc += p.peso;
      if (rand <= acc) return { nivel: p.nivel, label: p.label };
    }
    return pesoINEC[0];
  }
  
  function gerarCodINEP(index: number): string {
    return (22000000 + index + Math.floor(Math.random() * 200000)).toString();
  }
  
  function gerarNomeEscola(dep: 'Estadual' | 'Municipal' | 'Federal'): string {
    const prefixos = tiposEscola[dep];
    const prefixo = prefixos[Math.floor(Math.random() * prefixos.length)];
    const nome = nomesComuns[Math.floor(Math.random() * nomesComuns.length)];
    const sufixo = Math.random() > 0.5 ? ` ${sufixos[Math.floor(Math.random() * sufixos.length)]}` : '';
    return `${prefixo} ${nome}${sufixo}`.toUpperCase();
  }
  
  // Apenas escolas estaduais: 640 escolas
  const distribuicaoDep = [
    { dep: 'Estadual' as const, count: 640 },
  ];
  
  let escolaIndex = 0;
  
  for (const { dep, count } of distribuicaoDep) {
    for (let i = 0; i < count; i++) {
      // Escolher município
      let municipio: string;
      if (escolaIndex < 458) {
        municipio = 'Teresina';
      } else if (escolaIndex < 585) {
        municipio = 'Parnaíba';
      } else if (escolaIndex < 697) {
        municipio = 'Picos';
      } else if (escolaIndex < 782) {
        municipio = 'Piripiri';
      } else if (escolaIndex < 860) {
        municipio = 'Floriano';
      } else {
        municipio = municipiosPiaui[Math.floor(Math.random() * municipiosPiaui.length)];
      }
      
      const inec = escolherINEC();
      
      // Correlação: escolas com INEC alto tendem a ter melhor infraestrutura
      const fatorQualidade = inec.nivel / 5;
      
      // Gerar dados de compartimentos e APs (Nota Técnica MEC nº 182/2025)
      const compartimentos = Math.floor(Math.random() * 20) + 5; // 5 a 25 ambientes
      const aps_necessarios = Math.ceil(compartimentos / 2); // 1 AP a cada 2 ambientes
      
      // Correlacionar APs atuais com nível INEC
      let aps_atual: number;
      if (inec.nivel >= 5) {
        aps_atual = aps_necessarios + Math.floor(Math.random() * 3); // Pode ter mais
      } else if (inec.nivel === 4) {
        aps_atual = Math.max(aps_necessarios - Math.floor(Math.random() * 2), Math.floor(aps_necessarios * 0.8));
      } else if (inec.nivel === 3) {
        aps_atual = Math.floor(aps_necessarios * (0.4 + Math.random() * 0.3));
      } else {
        aps_atual = Math.floor(aps_necessarios * Math.random() * 0.5);
      }
      
      const deficit_aps = Math.max(0, aps_necessarios - aps_atual);
      
      // Gerar dados de velocidade (1 Mbps por aluno, mínimo 50 Mbps)
      const matriculas_maior_turno = Math.floor(Math.random() * 400) + 30; // 30 a 430 alunos
      const velocidade_minima = Math.max(50, matriculas_maior_turno); // 1 Mbps/aluno, mínimo 50
      
      // Correlacionar velocidade contratada com nível INEC
      let velocidade_contratada: number;
      if (inec.nivel >= 4) {
        velocidade_contratada = velocidade_minima + Math.floor(Math.random() * 100);
      } else if (inec.nivel === 3) {
        velocidade_contratada = Math.floor(velocidade_minima * (0.6 + Math.random() * 0.4));
      } else {
        velocidade_contratada = Math.floor(velocidade_minima * Math.random() * 0.5);
      }
      
      const escola: Escola = {
        cod_inep: gerarCodINEP(escolaIndex),
        escola: gerarNomeEscola(dep),
        municipio,
        uf: 'PI',
        cod_municipio: (2200000 + Math.floor(Math.random() * 1000)).toString(),
        dependencia: dep,
        gre: getGREForMunicipio(municipio),
        energia: fatorQualidade > 0.6 || Math.random() > 0.15 ? statusEnergia[0] : statusEnergia[Math.floor(Math.random() * statusEnergia.length)],
        internet: fatorQualidade > 0.5 || Math.random() > 0.25 ? statusInternet[0] : statusInternet[Math.floor(Math.random() * statusInternet.length)],
        wifi: fatorQualidade > 0.7 || Math.random() > 0.35 ? statusWifi[0] : statusWifi[Math.floor(Math.random() * statusWifi.length)],
        diligencia: statusDiligencia[Math.floor(Math.random() * statusDiligencia.length)],
        inec: inec.label,
        inec_nivel: inec.nivel,
        // Campos de Wi-Fi/APs
        compartimentos,
        aps_atual,
        aps_necessarios,
        deficit_aps,
        matriculas_maior_turno,
        velocidade_contratada,
        velocidade_minima,
      };
      
      escolas.push(escola);
      escolaIndex++;
    }
  }
  
  // Shuffle para misturar
  for (let i = escolas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [escolas[i], escolas[j]] = [escolas[j], escolas[i]];
  }
  
  return escolas;
}

// Cache dos dados gerados
let escolasCache: Escola[] | null = null;

export function getEscolas(): Escola[] {
  if (!escolasCache) {
    escolasCache = gerarEscolas();
  }
  return escolasCache;
}

export function getEscolaByINEP(inep: string): Escola | undefined {
  return getEscolas().find(e => e.cod_inep === inep);
}

export function calcularKPIs(escolas: Escola[]): KPIs {
  const municipiosUnicos = new Set(escolas.map(e => e.municipio));
  const gresUnicas = new Set(escolas.map(e => e.gre));
  
  return {
    total: escolas.length,
    inec_5: escolas.filter(e => e.inec_nivel === 5).length,
    inec_4: escolas.filter(e => e.inec_nivel === 4).length,
    inec_3: escolas.filter(e => e.inec_nivel === 3).length,
    inec_2: escolas.filter(e => e.inec_nivel === 2).length,
    inec_1: escolas.filter(e => e.inec_nivel === 1).length,
    inec_0: escolas.filter(e => e.inec_nivel === 0).length,
    inec_critico: escolas.filter(e => e.inec_nivel <= 2).length,
    energia_adequada: escolas.filter(e => e.energia.toLowerCase().includes('adequada') && !e.energia.toLowerCase().includes('inadequada')).length,
    internet_adequada: escolas.filter(e => e.internet.toLowerCase().includes('adequada') && !e.internet.toLowerCase().includes('inadequada')).length,
    wifi_adequado: escolas.filter(e => e.wifi.toLowerCase().includes('adequado') && !e.wifi.toLowerCase().includes('insuficiente')).length,
    total_municipios: municipiosUnicos.size,
    total_gres: gresUnicas.size,
    // KPIs de conectividade
    total_compartimentos: escolas.reduce((sum, e) => sum + e.compartimentos, 0),
    total_aps_necessarios: escolas.reduce((sum, e) => sum + e.aps_necessarios, 0),
    total_aps_atual: escolas.reduce((sum, e) => sum + e.aps_atual, 0),
    total_deficit_aps: escolas.reduce((sum, e) => sum + e.deficit_aps, 0),
    escolas_com_deficit: escolas.filter(e => e.deficit_aps > 0).length,
    escolas_velocidade_ok: escolas.filter(e => e.velocidade_contratada >= e.velocidade_minima).length,
    escolas_velocidade_baixa: escolas.filter(e => e.velocidade_contratada < e.velocidade_minima).length,
  };
}

export function getMunicipios(): string[] {
  return [...new Set(getEscolas().map(e => e.municipio))].sort();
}

export const cardsPredefinidos: CardPredefinido[] = [
  {
    id: 'criticas',
    title: 'Conectividade Crítica',
    description: 'Escolas com INEC 0, 1 ou 2 - necessitam intervenção urgente',
    icon: '🔴',
    color: 'red',
    filter: (e) => e.inec_nivel <= 2,
  },
  {
    id: 'wifi_insuficiente',
    title: 'Wi-Fi Insuficiente',
    description: 'Escolas que necessitam upgrade de infraestrutura Wi-Fi',
    icon: '📶',
    color: 'amber',
    filter: (e) => e.wifi.toLowerCase().includes('insuficiente'),
  },
  {
    id: 'deficit_aps',
    title: 'Déficit de APs',
    description: 'Escolas que precisam de mais Access Points',
    icon: '📡',
    color: 'purple',
    filter: (e) => e.deficit_aps > 0,
  },
  {
    id: 'teresina',
    title: 'Teresina (Capital)',
    description: 'Escolas estaduais da capital piauiense',
    icon: '🏙️',
    color: 'indigo',
    filter: (e) => e.municipio === 'Teresina',
  },
  {
    id: 'excelencia',
    title: 'Excelência INEC 5',
    description: 'Escolas com melhor nível de conectividade',
    icon: '🏆',
    color: 'emerald',
    filter: (e) => e.inec_nivel === 5,
  },
  {
    id: 'sem_internet',
    title: 'Sem Internet Adequada',
    description: 'Escolas que necessitam melhorias urgentes de conectividade',
    icon: '🚫',
    color: 'rose',
    filter: (e) => e.internet.toLowerCase().includes('inadequada') || e.internet.toLowerCase().includes('sem'),
  },
  {
    id: 'velocidade_baixa',
    title: 'Velocidade Insuficiente',
    description: 'Escolas com banda larga abaixo do mínimo MEC',
    icon: '🐢',
    color: 'cyan',
    filter: (e) => e.velocidade_contratada < e.velocidade_minima,
  },
  {
    id: 'interior',
    title: 'Interior do Estado',
    description: 'Escolas fora da capital Teresina',
    icon: '🌾',
    color: 'blue',
    filter: (e) => e.municipio !== 'Teresina',
  },
];

// Função para obter estatísticas para gráficos
export function getChartData(escolas: Escola[]) {
  // Distribuição por INEC
  const inecDistribution = [
    { name: 'Nível 5', value: escolas.filter(e => e.inec_nivel === 5).length, color: 'hsl(142, 71%, 45%)' },
    { name: 'Nível 4', value: escolas.filter(e => e.inec_nivel === 4).length, color: 'hsl(84, 60%, 45%)' },
    { name: 'Nível 3', value: escolas.filter(e => e.inec_nivel === 3).length, color: 'hsl(48, 96%, 53%)' },
    { name: 'Nível 2', value: escolas.filter(e => e.inec_nivel === 2).length, color: 'hsl(25, 95%, 53%)' },
    { name: 'Nível 1', value: escolas.filter(e => e.inec_nivel === 1).length, color: 'hsl(0, 84%, 60%)' },
    { name: 'Nível 0', value: escolas.filter(e => e.inec_nivel === 0).length, color: 'hsl(0, 62%, 30%)' },
  ];
  
  // Conectividade por GRE (Top 10)
  const greStats: Record<string, { total: number; bom: number; critico: number }> = {};
  escolas.forEach(e => {
    const greName = e.gre.replace(/^\d+ª GRE - /, '');
    if (!greStats[greName]) {
      greStats[greName] = { total: 0, bom: 0, critico: 0 };
    }
    greStats[greName].total += 1;
    if (e.inec_nivel >= 4) greStats[greName].bom += 1;
    if (e.inec_nivel <= 2) greStats[greName].critico += 1;
  });
  
  const conectividadePorGRE = Object.entries(greStats)
    .map(([name, data]) => ({
      name,
      bom: Math.round((data.bom / data.total) * 100),
      critico: Math.round((data.critico / data.total) * 100),
      total: data.total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);
  
  // Top 10 Municípios
  const municipioCount: Record<string, number> = {};
  escolas.forEach(e => {
    municipioCount[e.municipio] = (municipioCount[e.municipio] || 0) + 1;
  });
  const topMunicipios = Object.entries(municipioCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));
  
  // Status Infraestrutura
  const total = escolas.length;
  const infraStatus = [
    { 
      name: 'Energia', 
      value: Math.round((escolas.filter(e => e.energia.toLowerCase().includes('adequada') && !e.energia.toLowerCase().includes('inadequada')).length / total) * 100),
      color: 'hsl(142, 71%, 45%)'
    },
    { 
      name: 'Internet', 
      value: Math.round((escolas.filter(e => e.internet.toLowerCase().includes('adequada') && !e.internet.toLowerCase().includes('inadequada')).length / total) * 100),
      color: 'hsl(217, 91%, 60%)'
    },
    { 
      name: 'Wi-Fi', 
      value: Math.round((escolas.filter(e => e.wifi.toLowerCase().includes('adequado') && !e.wifi.toLowerCase().includes('insuficiente')).length / total) * 100),
      color: 'hsl(271, 91%, 65%)'
    },
  ];
  
  // Déficit de APs por GRE (Top 10)
  const greDeficit: Record<string, { deficit: number; total: number }> = {};
  escolas.forEach(e => {
    if (!greDeficit[e.gre]) {
      greDeficit[e.gre] = { deficit: 0, total: 0 };
    }
    greDeficit[e.gre].deficit += e.deficit_aps;
    greDeficit[e.gre].total += 1;
  });
  const deficitPorGRE = Object.entries(greDeficit)
    .map(([gre, data]) => ({ 
      name: gre.replace(/^\d+ª GRE - /, ''), 
      deficit: data.deficit,
      total: data.total
    }))
    .sort((a, b) => b.deficit - a.deficit)
    .slice(0, 10);
  
  // Distribuição de velocidade
  const velocidadeDistribuicao = [
    { 
      name: 'Velocidade Adequada', 
      value: escolas.filter(e => e.velocidade_contratada >= e.velocidade_minima).length,
      color: 'hsl(142, 71%, 45%)'
    },
    { 
      name: 'Abaixo do Mínimo', 
      value: escolas.filter(e => e.velocidade_contratada < e.velocidade_minima && e.velocidade_contratada > 0).length,
      color: 'hsl(25, 95%, 53%)'
    },
    { 
      name: 'Sem Internet', 
      value: escolas.filter(e => e.velocidade_contratada === 0).length,
      color: 'hsl(0, 84%, 60%)'
    },
  ];
  
  return {
    inecDistribution,
    conectividadePorGRE,
    topMunicipios,
    infraStatus,
    deficitPorGRE,
    velocidadeDistribuicao,
  };
}
