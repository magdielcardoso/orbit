class LogAnalyzer {
  constructor() {
    this.errorPatterns = {
      successPatterns: {
        count: 0,
        timestamp: Date.now(),
        threshold: 1,
        timeWindow: 60000,
        message: 'Operação realizada com sucesso'
      },
      infoPatterns: {
        count: 0,
        timestamp: Date.now(),
        threshold: 1,
        timeWindow: 60000,
        message: 'Informação do Sistema'
      },
      apiErrors: {
        count: 0,
        slowCount: 0,
        timestamp: Date.now(),
        threshold: 5,
        slowThreshold: 1000, // ms
        timeWindow: 300000,
        message: 'Sistema apresentando falhas na API'
      },
      authErrors: {
        count: 0,
        timestamp: Date.now(),
        threshold: 3,
        timeWindow: 300000,
        message: 'Possível problema de autenticação'
      },
      systemErrors: {
        count: 0,
        timestamp: Date.now(),
        threshold: 2,
        timeWindow: 60000,
        message: 'Sistema apresentando instabilidade'
      },
      performanceIssues: {
        count: 0,
        timestamp: Date.now(),
        threshold: 3,
        timeWindow: 60000,
        message: 'Sistema com problemas de performance'
      }
    };
  }

  analyzeLog(log) {
    const alerts = [];
    
    // Reseta contadores antigos
    this.resetOldCounters();

    // Analisa mensagens de sucesso
    if (log.statusCode === 200 || log.success === true || log.message?.toLowerCase().includes('sucesso')) {
      this.errorPatterns.successPatterns.count++;
      alerts.push({
        type: 'success',
        message: `${log.message || this.errorPatterns.successPatterns.message}`,
        count: this.errorPatterns.successPatterns.count
      });
    }

    // Analisa mensagens informativas
    if (log.type === 'info' || log.level === 'info') {
      this.errorPatterns.infoPatterns.count++;
      if (log.message && !log.message.includes('System Status')) { // Ignora logs de status do sistema
        alerts.push({
          type: 'info',
          message: log.message,
          count: this.errorPatterns.infoPatterns.count
        });
      }
    }

    // Analisa por tipo de log
    if (log.type === 'http' || log.level === 'http') {
      if (log.statusCode >= 400 || log.message.includes('error')) {
        this.errorPatterns.apiErrors.count++;
        if (this.errorPatterns.apiErrors.count >= this.errorPatterns.apiErrors.threshold) {
          alerts.push({
            type: 'error',
            message: `${this.errorPatterns.apiErrors.message} - ${this.errorPatterns.apiErrors.count} falhas nos últimos 5 minutos`,
            count: this.errorPatterns.apiErrors.count
          });
        }
      }

      if (log.responseTime) {
        const responseTime = parseFloat(log.responseTime);
        if (responseTime > this.errorPatterns.apiErrors.slowThreshold) {
          this.errorPatterns.performanceIssues.count++;
          if (this.errorPatterns.performanceIssues.count >= this.errorPatterns.performanceIssues.threshold) {
            alerts.push({
              type: 'warn',
              message: `${this.errorPatterns.performanceIssues.message} - ${this.errorPatterns.performanceIssues.count} requisições lentas (>1s)`,
              count: this.errorPatterns.performanceIssues.count
            });
          }
        }
      }
    }

    if (log.type === 'error' || log.level === 'error') {
      this.errorPatterns.systemErrors.count++;
      if (this.errorPatterns.systemErrors.count >= this.errorPatterns.systemErrors.threshold) {
        alerts.push({
          type: 'error',
          message: this.errorPatterns.systemErrors.message,
          count: this.errorPatterns.systemErrors.count
        });
      }
    }

    if (log.message?.toLowerCase().includes('auth') || log.message?.toLowerCase().includes('unauthorized')) {
      this.errorPatterns.authErrors.count++;
      if (this.errorPatterns.authErrors.count >= this.errorPatterns.authErrors.threshold) {
        alerts.push({
          type: 'warn',
          message: this.errorPatterns.authErrors.message,
          count: this.errorPatterns.authErrors.count
        });
      }
    }

    return alerts;
  }

  resetOldCounters() {
    const now = Date.now();
    Object.keys(this.errorPatterns).forEach(key => {
      const pattern = this.errorPatterns[key];
      if (now - pattern.timestamp > pattern.timeWindow) {
        pattern.count = 0;
        pattern.timestamp = now;
      }
    });
  }
}

export const logAnalyzer = new LogAnalyzer(); 