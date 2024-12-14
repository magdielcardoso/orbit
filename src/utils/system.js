import { gqlRequest } from './graphql';

export async function checkSystemStatus() {
  try {
    const query = `
      query SystemStatus {
        systemStatus {
          configured
          version
          status
        }
      }
    `;

    const response = await gqlRequest(query);
    return response.systemStatus;
  } catch (error) {
    console.error('Erro ao verificar status do sistema:', error);
    return {
      configured: false,
      version: '1.0.0',
      status: 'error'
    };
  }
} 