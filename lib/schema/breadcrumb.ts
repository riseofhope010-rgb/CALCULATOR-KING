export interface BreadcrumbItem {
  name: string
  url: string
}

export interface BreadcrumbSchema {
  '@context': string
  '@type': string
  itemListElement: Array<{
    '@type': string
    position: number
    name: string
    item: string
  }>
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function formatBreadcrumbSchemaAsScript(items: BreadcrumbItem[]): string {
  const schema = generateBreadcrumbSchema(items)
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
}

export function generateCalculatorBreadcrumb(
  baseUrl: string,
  calculatorName: string,
  calculatorId: string,
  locationName?: string,
  locationId?: string,
  roleName?: string,
  roleId?: string
): BreadcrumbSchema {
  const items: BreadcrumbItem[] = [
    { name: 'Home', url: baseUrl },
    { name: 'Calculators', url: `${baseUrl}/calculators` },
    { name: calculatorName, url: `${baseUrl}/calculators/${calculatorId}` },
  ]

  if (locationName && locationId) {
    items.push({
      name: locationName,
      url: `${baseUrl}/calculators/${calculatorId}/${locationId}`,
    })
  }

  if (roleName && roleId && locationId) {
    items.push({
      name: roleName,
      url: `${baseUrl}/calculators/${calculatorId}/${locationId}/${roleId}`,
    })
  }

  return generateBreadcrumbSchema(items)
}
