export function formatAccountUrl(str) {
  if (!str) return ''
  
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')     // Remove acentos
    .replace(/[&]/g, '-and-')            // Substitui & por and
    .replace(/[@]/g, '-at-')             // Substitui @ por at
    .replace(/[.]/g, '-dot-')            // Substitui . por dot
    .replace(/[^a-z0-9-]/g, '-')         // Substitui caracteres não alfanuméricos por hífen
    .replace(/[-]+/g, '-')               // Remove hífens duplicados
    .replace(/^[-]|[-]$/g, '')           // Remove hífens do início e fim
} 