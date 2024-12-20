import { formatDistanceToNow as fDistance, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatDistanceToNow(date) {
  if (!date) return ''
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  
  return fDistance(parsedDate, {
    addSuffix: true,
    locale: ptBR
  })
}

export function formatDate(date, format = 'dd/MM/yyyy') {
  if (!date) return ''
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  
  return format(parsedDate, format, {
    locale: ptBR
  })
}

export function formatDateTime(date) {
  if (!date) return ''
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  
  return format(parsedDate, 'dd/MM/yyyy HH:mm', {
    locale: ptBR
  })
}

export function isToday(date) {
  if (!date) return false
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  const today = new Date()
  
  return parsedDate.getDate() === today.getDate() &&
    parsedDate.getMonth() === today.getMonth() &&
    parsedDate.getFullYear() === today.getFullYear()
}

export function isYesterday(date) {
  if (!date) return false
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  return parsedDate.getDate() === yesterday.getDate() &&
    parsedDate.getMonth() === yesterday.getMonth() &&
    parsedDate.getFullYear() === yesterday.getFullYear()
} 