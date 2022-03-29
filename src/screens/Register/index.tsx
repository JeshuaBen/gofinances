import React, { useState, useEffect } from 'react';
import { 
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert 
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { useNavigation } from '@react-navigation/native'

import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect'

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes
 } from './styles';

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('');


  const navigation = useNavigation();
  
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  function handleTransactionTypeSelect (type : 'up' | 'down') {
    setTransactionType(type)
  }

  function handleOpenModal () {
    setOpenModal(true);
  }

  function handleCloseModal () {
    setOpenModal(false);
  }

  async function handleRegister () {
    if(!transactionType)
      return Alert.alert('Selecione o tipo da transação');

    if(category.key === 'category')
      return Alert.alert('Selecione a categoria');
      
    if(name.length === 0)
      return Alert.alert('Preencha o campo de nome');
    
    if(amount.length === 0)
      return Alert.alert('Preencha o campo de valor');         

    const transactionData = {
      id: String(uuid.v4()),
      name,
      amount,
      transactionType,
      category: category.name,
      date: new Date(),
    }



    
    try {
      const dataKey = '@gofinances:transactions';
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormated = [
          ...currentData,
        transactionData
        ]
      

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormated));

      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria'
      });
      setName('');
      setAmount('');

      navigation.navigate('Listagem');


    }catch (error) { 
      console.log(error);
      Alert.alert('Não foi possível salvar');
    }
  }
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <Input 
              placeholder="Nome"
              onChangeText={setName}
              autoCapitalize="sentences"
              autoCorrect = {false}
            />
            <Input 
              placeholder="Valor"
              onChangeText={setAmount}
              keyboardType="numeric"
            />

          <TransactionTypes>
            <TransactionTypeButton
                type="up" 
                title="Income"
                onPress={() => handleTransactionTypeSelect('up')}
                isActive={transactionType === 'up'}
              />
              <TransactionTypeButton
                type="down" 
                title="Outcome"
                onPress={() => handleTransactionTypeSelect('down')}
                isActive={transactionType === 'down'}
              />
          </TransactionTypes>

          <CategorySelectButton
            category={category.name}
            onPress={handleOpenModal}          
          />

          </Fields>
          <Button 
            title = "Enviar"
            onPress={handleRegister}
          />
        </Form>

        <Modal visible={openModal}>
          <CategorySelect 
            category = {category}
            setCategory = {setCategory}
            closeSelectCategory ={handleCloseModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
 }

