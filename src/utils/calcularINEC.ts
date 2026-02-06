// ============================================================
// Cálculo REAL do INEC — Árvore de Decisão Oficial
// Fonte: Nota Técnica MEC nº 182/2025 — ENEC
// Resolução CEnec nº 2 e 3/2024
// ============================================================

export interface INECInput {
  energia: string;
  internet: string;
  wifi: string;
  velocidade_contratada: number;
  velocidade_minima: number;
  aps_atual: number;
  aps_necessarios: number;
}

/**
 * Calcula o nível INEC real com base nos dados existentes,
 * seguindo a árvore de decisão oficial do MEC.
 * 
 * 1. Energia adequada? NÃO → Nível 0
 * 2. Possui internet? NÃO → Nível 0
 * 3. Velocidade adequada (≥1 Mbps/aluno, mín. 50 Mbps)?
 *    NÃO → Possui Wi-Fi? NÃO → Nível 1 / SIM → Nível 2
 * 4. Possui Wi-Fi? NÃO → Nível 3
 * 5. Wi-Fi suficiente (≥1 AP a cada 2 ambientes)?
 *    NÃO → Nível 4 / SIM → Nível 5
 */
export function calcularINECReal(input: INECInput): number {
  const energiaStr = input.energia.toLowerCase();
  const internetStr = input.internet.toLowerCase();
  const wifiStr = input.wifi.toLowerCase();

  // 1. Energia adequada?
  const energiaAdequada = energiaStr.includes('adequada') && !energiaStr.includes('inadequada');
  if (!energiaAdequada) return 0;

  // 2. Possui internet?
  const possuiInternet = !internetStr.includes('sem internet');
  if (!possuiInternet) return 0;

  // 3. Velocidade adequada?
  const velocidadeAdequada = input.velocidade_contratada >= input.velocidade_minima;
  
  if (!velocidadeAdequada) {
    // Possui Wi-Fi?
    const possuiWifi = !wifiStr.includes('sem wi-fi') && !wifiStr.includes('sem wifi');
    return possuiWifi ? 2 : 1;
  }

  // 4. Possui Wi-Fi?
  const possuiWifi = !wifiStr.includes('sem wi-fi') && !wifiStr.includes('sem wifi');
  if (!possuiWifi) return 3;

  // 5. Wi-Fi suficiente? (≥1 AP a cada 2 ambientes)
  const wifiSuficiente = input.aps_atual >= input.aps_necessarios;
  return wifiSuficiente ? 5 : 4;
}

/**
 * Retorna explicação textual do motivo do nível calculado
 */
export function explicarINECCalculado(input: INECInput): string {
  const nivel = calcularINECReal(input);
  const energiaStr = input.energia.toLowerCase();
  const internetStr = input.internet.toLowerCase();
  
  switch (nivel) {
    case 0: {
      const semEnergia = !(energiaStr.includes('adequada') && !energiaStr.includes('inadequada'));
      const semInternet = internetStr.includes('sem internet');
      if (semEnergia && semInternet) return 'Sem energia adequada e sem internet';
      if (semEnergia) return 'Energia inadequada';
      return 'Sem conexão à internet';
    }
    case 1: return `Velocidade insuficiente (${input.velocidade_contratada}/${input.velocidade_minima} Mbps) e sem Wi-Fi`;
    case 2: return `Velocidade insuficiente (${input.velocidade_contratada}/${input.velocidade_minima} Mbps)`;
    case 3: return `Velocidade OK (${input.velocidade_contratada} Mbps) mas sem Wi-Fi`;
    case 4: return `Déficit de ${input.aps_necessarios - input.aps_atual} AP(s) — ${input.aps_atual}/${input.aps_necessarios}`;
    case 5: return `Plenamente conectada — ${input.aps_atual} APs, ${input.velocidade_contratada} Mbps`;
    default: return 'Dados insuficientes';
  }
}
