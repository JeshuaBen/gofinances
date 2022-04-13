import React from 'react';
import { categories } from '../utils/categories';

import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date
} from './style';



export interface TransactionCardProps {
  type: 'up' | 'down';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface Props {
  data: TransactionCardProps;
}


export function TransactionCard({ data }: Props) {
  // const  category = categories.filter(
  //   item => item.key === data.category
  // )[0];

  
  const category = categories.map((item) => {
    if(item.key === data.category) {
      data.category = item.icon
      data.name = item.name
    }
  }) 
    
  return(
    <Container>
      <Title>{data.name}</Title>
      <Amount type={data.type}>
        {data.type === 'down' && '- '}
        {data.amount}
      </Amount>

      <Footer>
        <Category>
          <Icon name={data.category}/>
          <CategoryName>{data.name}</CategoryName>

        </Category>
        <Date>{data.date}</Date>
      </Footer>

    </Container>
  )
}