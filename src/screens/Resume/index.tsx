import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components/native';

import { HistoryCard } from '../../components/HistoryCard';


import { 
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer

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
  const [isLoading, setIsLoading] = useState(false); 
  const [selectedDate, setSelectedDate] = useState (new Date);
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  
  const theme = useTheme();

  function handleDateChange(action: 'next' | 'previous') {
    if(action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1))

    }else {
      setSelectedDate(subMonths(selectedDate, 1))
    }
  }

  async function loadData () {
    setIsLoading(true);
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expenses = responseFormatted
    .filter((expense : TransactionData) => 
      expense.type === 'down' &&
      new Date(expense.date).getMonth() === selectedDate.getMonth() &&
      new Date(expense.date).getFullYear() === selectedDate.getFullYear() 
    );

    console.log(expenses);

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
    setIsLoading(false)
   }
   

  useFocusEffect(useCallback(() => {
    loadData();
  },[selectedDate]));

   return (
     <Container>
          <Header>
            <Title>Resumo por categoria</Title>
          </Header>
          
        {
          isLoading ? 
          <LoadContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size='large'
            />
          </LoadContainer> :
          
          <Content 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight(),
            }} 
          >

            <MonthSelect>
              <MonthSelectButton 
                onPress={() => handleDateChange('previous')}
                >
                <MonthSelectIcon name='chevron-left'/>
              </MonthSelectButton>

              <Month>
                { format(selectedDate, 'MMMM, yyyy', {locale: ptBR}) }
              </Month>

              <MonthSelectButton 
                onPress={() => handleDateChange('next')}   
              >
                <MonthSelectIcon name='chevron-right'/>
              </MonthSelectButton>
            </MonthSelect>


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
       }
     </Container>
   )
 }