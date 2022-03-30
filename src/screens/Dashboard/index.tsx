import React,  {useEffect, useState } from 'react';



import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import AsyncStorage from '@react-native-async-storage/async-storage'

import { 
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions, 
    Title,
    TransacionsList,
    LogoutButton

} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}


export function Dashboard() {
  const [data, setData] = useState<DataListProps[]>([]);

  async function loadTransactions() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) => {
      const amount = Number(item.amount)
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date));

      console.log(item)
      return {
        id: item.id,
        name: item.name,
        amount,
        date,
        category: item.category,
        type: item.type
      }
    });
    console.log(transactionsFormatted)
    setData(transactionsFormatted);

  }

  useEffect(() => {
    loadTransactions();
  },[])


    return(
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/89667317?v=4'}}/>
                        <User>
                            <UserGreeting>Olá, </UserGreeting>
                            <UserName>Jeshua</UserName>
                        </User>
                    </UserInfo>
                    <LogoutButton onPress={() => {}}>
                      <Icon name="power"/>
                    </LogoutButton>
                </UserWrapper>
            </Header>

          <HighlightCards>
            <HighlightCard
              type="income" 
              title="Entradas" 
              amount="R$ 17.400,00" 
              lastTransaction="Última entrada dia 13 de abril"
            />
            <HighlightCard
              type="outcome"  
              title="Saídas" 
              amount="R$ 1.259,00" 
              lastTransaction="Última entrada dia 03 de abril"
            />
            <HighlightCard
              type="total"  
              title="Total" 
              amount="R$ 16.141,00" 
              lastTransaction="1 à 16 de Abril"
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransacionsList 
              data={data}
              keyExtractor={item => item.id}
              renderItem={({ item }) =>  <TransactionCard data={item}/>}
              
             />  
          </Transactions>
        </Container>      
    )
}

