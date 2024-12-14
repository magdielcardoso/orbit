const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql';

export async function gqlRequest(query, variables = null, options = {}) {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const result = await response.json();

    if (result.errors) {
      console.log('GraphQL Errors:', result.errors);
      throw new Error(result.errors[0].message);
    }

    return result.data;
  } catch (error) {
    console.error('Erro na requisição GraphQL:', error);
    throw error;
  }
} 