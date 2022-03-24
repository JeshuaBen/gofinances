import React from 'react';


import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

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
    TransacionsList

} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}


export function Dashboard() {
  const data: DataListProps[] = [
  {
    id: '1',
    type: 'income',
    title:'Desenvolvimento de sites',
    amount:'R$ 12.450,00',
    category: {
      name: 'Vendas',
      icon: 'dollar-sign'
    },
    date:'12/04/2020'  
  },
  {
    id: '2',
    type: 'outcome',
    title:'Hamburgueria Pizzy',
    amount:'R$ 59,00',
    category: {
      name: 'Alimentação',
      icon: 'coffee'
    },
    date:'12/04/2020'  
  },
  {
    id: '3',
    type: 'outcome',
    title:'Aluguel do apartamento',
    amount:'R$ 1.200,00',
    category: {
      name: 'Casa',
      icon: 'shopping-bag'
    },
    date:'12/04/2020'  
  }];


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
                    <Icon name="power"/>
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

