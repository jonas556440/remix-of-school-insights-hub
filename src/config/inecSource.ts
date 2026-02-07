/**
 * Fonte oficial do INEC usada como padrão no dashboard.
 * 
 * Defina VITE_INEC_SOURCE no .env:
 *   - "oficial"   → Dados do MEC/ENEC (padrão)
 *   - "calculado" → Calculado pela árvore de decisão com dados reais
 */
export type INECSource = 'oficial' | 'calculado';

export const INEC_DEFAULT_SOURCE: INECSource =
  (import.meta.env.VITE_INEC_SOURCE as INECSource) || 'oficial';

export function getINECLabel(source: INECSource): string {
  return source === 'oficial' ? 'Oficial (MEC)' : 'Calculado (Dados Reais)';
}
