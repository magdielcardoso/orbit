export function formatAccountUrl(name) {
  if (!name) return '';
  return name.toLowerCase()
    .trim()
    .normalize('NFD') // Remove acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove caracteres especiais
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres não alfanuméricos
    .replace(/\s+/g, '-') // Substitui espaços por traços
    .replace(/-+/g, '-'); // Remove traços duplicados
} 