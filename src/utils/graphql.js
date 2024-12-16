const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL?.replace(/"/g, '') || 'http://localhost:4000/graphql';

if (!GRAPHQL_URL) {
  console.error('VITE_GRAPHQL_URL não está definida no ambiente');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

export async function gqlRequest(query, variables = null, options = {}) {
  try {
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('Fazendo requisição para:', GRAPHQL_URL); // Debug
    
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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