import React,  {useCallback, useEffect, useState } from 'react';

import { ActivityIndicator } from 'react-native'

import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';

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
    LogoutButton,
    LoadContainer

} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighLightProps {
  amount: string;
}

interface HighLightData {
  entries: HighLightProps,
  wastes: HighLightProps,
  total: HighLightProps 
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighLightData>({} as HighLightData);

  const theme = useTheme();

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

      // console.log(item)
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
    const totalSum = entriesSum - wasteSum;
    setHighlightData({
      entries: {
        amount: entriesSum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      },
      wastes: {
        amount: wasteSum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      },
      total: {
        amount: totalSum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      }
    })
    console.log(transactionsFormatted)
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
                  lastTransaction="Última entrada dia 13 de abril"
                />
                <HighlightCard
                  type="outcome"  
                  title="Saídas" 
                  amount={highlightData.wastes.amount} 
                  lastTransaction="Última entrada dia 03 de abril"
                />
                <HighlightCard
                  type="total"  
                  title="Total" 
                  amount={highlightData.total.amount} 
                  lastTransaction="1 à 16 de Abril"   
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

