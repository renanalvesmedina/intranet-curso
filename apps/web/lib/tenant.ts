/**
 * Informação do tenant para exibição.
 * Em E01, usa valor placeholder; substituído por dados reais em E03.
 */
export interface TenantInfo {
  /** Identificador único do tenant */
  id: string
  /** Nome da organização */
  name: string
  /** URL do logo (opcional) */
  logoUrl?: string
}

/**
 * Tenant placeholder para E01.
 * TODO: Substituir por contexto real em E03.
 */
export const PLACEHOLDER_TENANT: TenantInfo = {
  id: 'placeholder',
  name: 'Organização',
  logoUrl: undefined,
}
