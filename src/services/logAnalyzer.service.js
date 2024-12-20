import { BaseService } from './base.service'

export class LogAnalyzer extends BaseService {
  constructor() {
    super()
    this.analyzedLogs = []
    this.metrics = {
      errors: 0,
      warnings: 0,
      info: 0
    }
  }

  async analyzeLogs(logs) {
    try {
      const query = `
        query AnalyzeLogs($logs: [LogInput!]!) {
          analyzeLogs(logs: $logs) {
            metrics {
              errors
              warnings
              info
            }
            patterns {
              type
              count
              examples
            }
          }
        }
      `
      const response = await this.request(query, { logs })
      return response.analyzeLogs
    } catch (error) {
      console.error('Erro ao analisar logs:', error)
      throw error
    }
  }

  // Métodos de análise local
  analyzeLogPatterns(logs) {
    const patterns = {}
    
    logs.forEach(log => {
      const key = `${log.type}_${log.level}`
      if (!patterns[key]) {
        patterns[key] = {
          count: 0,
          examples: []
        }
      }
      
      patterns[key].count++
      if (patterns[key].examples.length < 3) {
        patterns[key].examples.push(log)
      }
    })

    return patterns
  }

  updateMetrics(logs) {
    this.metrics = logs.reduce((acc, log) => {
      switch (log.level) {
        case 'ERROR':
          acc.errors++
          break
        case 'WARNING':
          acc.warnings++
          break
        case 'INFO':
          acc.info++
          break
      }
      return acc
    }, { errors: 0, warnings: 0, info: 0 })
  }

  getMetricsSummary() {
    return {
      ...this.metrics,
      total: this.metrics.errors + this.metrics.warnings + this.metrics.info
    }
  }
}

export const logAnalyzer = new LogAnalyzer() 