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
    console.log('System status response:', response); // Debug
    return response.systemStatus;
  } catch (error) {
    console.error('Erro ao verificar status do sistema:', error);
    // Em caso de erro, retorna um status padrão
    return {
      configured: false,
      version: '1.0.0',
      status: 'error'
    };
  }
}

export async function setupSystem(data) {
  try {
    const mutation = `
      mutation SetupSystem($adminUser: AdminUserInput!) {
        setupSystem(adminUser: $adminUser) {
          success
          message
          token
          user {
            id
            name
            email
            role {
              name
              permissions {
                name
              }
            }
          }
        }
      }
    `;

    const response = await gqlRequest(mutation, { adminUser: data });
    return response.setupSystem;
  } catch (error) {
    console.error('Erro ao configurar sistema:', error);
    throw error;
  }
} 