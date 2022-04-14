import React, { createContext, ReactNode, useContext } from 'react';


interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContextData {
  user: User;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider ({ children }: AuthProviderProps) {
  const user = {
    id: '1214151',
    name: 'John Smith',
    email: 'john@example.com',
  };

  async function signInWithGoogle() {
    // Usando o try catch pelo motivo de que o usuário irá sair da aplicação para fazer a autenticação e vai voltar depois, portanto caso dê algo errado, a nossa aplicação não irá crashar.
    try {
      const CLIENT_ID = '';
      const REDIRECT_URI = '';
      const RESPONSE_TYPE = '';
      const SCOPE = '';

      const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

    } catch (error) {
      throw new Error(error);
    }

  }

  return (
    <AuthContext.Provider value = {{ user }}>
      { children }
    </AuthContext.Provider>
  )
}

function useAuth () {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth }