import React, { useState } from 'react';
import { 
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert 
} from 'react-native';

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

  function handleRegister () {
    if(!transactionType)
      return Alert.alert('Selecione o tipo da transação');

    if(category.key === 'category')
      return Alert.alert('Selecione a categoria');
      
    if(name.length === 0)
      return Alert.alert('Preencha o campo de nome');
    
    if(amount.length === 0)
      return Alert.alert('Preencha o campo de valor');         

    const data = {
      name,
      amount,
      transactionType,
      category: category.name
    }
    console.log(data)
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

