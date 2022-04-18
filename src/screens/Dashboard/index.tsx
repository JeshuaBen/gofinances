import React,  {useCallback, useEffect, useState } from 'react';

import { ActivityIndicator } from 'react-native'

import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import AsyncStorage from '@react-native-async-storage/async-storage';

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
    LogoutButton,
    LoadContainer

} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}


interface HighLightProps {
  amount: string;
  lastTransaction: string;
}

interface HighLightData {
  entries: HighLightProps,
  wastes: HighLightProps,
  total: HighLightProps,
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighLightData>({} as HighLightData);

  const theme = useTheme();

  function getLastTransactionDate(
      collection: DataListProps[],
      type: 'up' | 'down'
    ){
    // Fazendo um filtro pelo tipo e depois mapeando as que possuem esse tipo para pegar a data e após converter para milissegundos, faz a comparação do maior e retorna ele como data.

    const lastTransaction = new Date(
      Math.max.apply(Math, collection
        .filter(transaction  => transaction.type === type)
        .map(transaction  => new Date(transaction.date).getTime())));
    
   // Formatando a data 2 dígitos.

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleDateString('pt-BR', { month: 'long' })}`
  }


  // Função para inserir os dados no nosso AsyncStorage, formatar os dados que são retornados e listar eles de forma dinâmica na nossa interface.

  async function loadTransactions() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];


    let entriesSum = 0;
    let wasteSum = 0;

    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) => {

      if(item.type === 'up') {
        entriesSum += Number(item.amount);
      }else {
        wasteSum += Number(item.amount);
      }

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


      return {
        id: item.id,
        name: item.name,
        amount,
        date,
        category: item.category,
        type: item.type
      }
    });
    
    setTransactions(transactionsFormatted);

    const lastTransactionIncomes = getLastTransactionDate(transactions, 'up');
    const lastTransactionOutcomes = getLastTransactionDate(transactions, 'down');
    const totalIntervalDate = `01 a ${lastTransactionOutcomes}`;

    const totalSum = entriesSum - wasteSum;

    setHighlightData({
      entries: {
        amount: entriesSum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última entrada dia ${lastTransactionIncomes}`
      },
      wastes: {
        amount: wasteSum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última saída dia ${lastTransactionOutcomes}`,
      },
      total: {
        amount: totalSum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalIntervalDate
      }
    })
    setIsLoading(false)

  }
  

  useEffect(() => {
    loadTransactions();


  },[])

  useFocusEffect(useCallback(() => {
    loadTransactions()
  },[]));


    return(
        <Container>
          {
            isLoading ? 
            <LoadContainer>
              <ActivityIndicator
                color={theme.colors.primary}
                size='large'
              />
            </LoadContainer> : 
            <>
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
                  amount={highlightData.entries.amount}
                  lastTransaction={highlightData.entries.lastTransaction}
                />
                <HighlightCard
                  type="outcome"  
                  title="Saídas" 
                  amount={highlightData.wastes.amount} 
                  lastTransaction={highlightData.wastes.lastTransaction}

                />
                <HighlightCard
                  type="total"  
                  title="Total" 
                  amount={highlightData.total.amount} 
                  lastTransaction={highlightData.total.lastTransaction}
                />
              </HighlightCards>

              <Transactions>
                <Title>Listagem</Title>
                <TransacionsList 
                  data={transactions}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) =>  <TransactionCard data={item}/>}
                  
                />  
              </Transactions>
            </>
          }
        </Container>      
    )
}

