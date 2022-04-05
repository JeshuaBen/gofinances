import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components/native';

import { HistoryCard } from '../../components/HistoryCard';


import { 
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
 } from './styles';
import { categories } from '../../components/utils/categories';

 interface TransactionData {
   type: 'up' | 'down';
   name: string;
   amount: string;
   category: string;
   date: string;
 }

 interface CategoryData {
   key: string;
   name: string;
   total: number;
   totalFormatted: string;
   color: string;
   percent: string;
 }

 export function Resume () {

  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
  
  const theme = useTheme();
   
   async function loadData () {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expenses = responseFormatted
    .filter((expense : TransactionData) => expense.type === 'down');

    const totalExpenses = expenses
    .reduce((acumullator : number, expense : TransactionData) => {
      return acumullator + Number(expense.amount);
    }, 0);

    const totalByCategory : CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expenses.forEach((expense : TransactionData) => {
        if(expense.category === category.key) {
          categorySum += Number(expense.amount);    
        }
      });
      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        const percent = `${(categorySum / totalExpenses * 100).toFixed(0)}%`; 

        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categorySum,
          totalFormatted: totalFormatted,
          color:category.color,
          percent: percent
        })
      }

    });
    
    setTotalByCategories(totalByCategory);
    
   }
   
   useEffect(() => {
     loadData();
   }, []);

   return (
     <Container>
       <Header>
         <Title>Resumo por categoria</Title>
       </Header>
       
      <Content 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: useBottomTabBarHeight(),
        }} 
      >
        <ChartContainer>
          <VictoryPie 
            data ={totalByCategories}
            colorScale={totalByCategories.map(category => category.color)}
            style={{
              labels: { 
                fontSize: RFValue(16),
                fontWeight: 'bold',
                fill: theme.colors.shape,
              }, 

            }}
            labelRadius={50}
            x='percent'
            y='total'
            
          />
        </ChartContainer>
        {
          totalByCategories.map(items => (
            <HistoryCard
              key={items.key} 
              title={items.name}
              amount={items.totalFormatted}
              color={items.color}
            />
          ))
        }
       </Content>
     </Container>
   )
 }