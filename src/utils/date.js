import { formatDistanceToNowStrict } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatDistanceToNow(date) {
  if (!date) return ''
  
  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
    locale: ptBR
  })
    .replace('cerca de ', '')
    .replace('em ', '')
} 