import React, { 
  createContext,
  ReactNode,
  useContext,
  useState
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

// CLIENT_ID sendo a credencial que nós configuramos pelo site do google
const { CLIENT_ID } = process.env;
// Quando terminar o processo do usuário se autenticar, para onde ele irá retornar 
const { REDIRECT_URI } = process.env;



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
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  },
  type: string; 
}

const AuthContext = createContext({} as AuthContextData);


function AuthProvider ({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>({} as User)


  async function signInWithGoogle() {
    // Usando o try catch pelo motivo de que o usuário irá sair da aplicação para fazer a autenticação e vai voltar depois, portanto caso dê algo errado, a nossa aplicação não irá crashar.
    try {

      // O que nós queremos obter deste redirecionamento
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      // Agora iremos passar os parâmetros para nossa URL. Primeiro passando a interrogração e depois o nome do parâmetro e a variável correspondente ao mesmo. De modo a ser ?client_id=${CLIENT_ID}

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;


      const { type, params } = await AuthSession
      .startAsync({ authUrl }) as AuthorizationResponse;

      if(type === 'success') {
        // Estaremos consumindo esse endpoint em caso de sucesso para termos acesso às informações que nós queremos do usuário.
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)
        const userInfo = await response.json();
        
        setUser({
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture
        });

        console.log(userInfo.name)
      }  


    } catch (error) {
      throw new Error(error as string)
    }  
  }

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      });
      
      if (credential) {
        const userLogged = {
          id: String(credential.user),
          email: credential.email!,
          name: credential.fullName!.givenName!,
          photo: undefined
        }
        setUser(userLogged)
        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged))
      }


    } catch (error) {
      throw new Error(error as string);
    }
  }

  
  return (
    <AuthContext.Provider value = {{ 
      user, 
      signInWithGoogle,
      signInWithApple 
      }}>
      { children }
    </AuthContext.Provider>
  )
}
  
function useAuth () {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth }