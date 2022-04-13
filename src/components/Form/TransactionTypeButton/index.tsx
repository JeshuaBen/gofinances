import React from 'react';
import { TouchableOpacityProps } from 'react-native'

import { 
  Container,
  Icon,
  Title,
  Button
 } from './styles';

 const icons = {
   up: 'arrow-up-circle',
   down: 'arrow-down-circle'
 }

 interface Props extends TouchableOpacityProps {
  type: 'up' | 'down';
  title: string;
  isActive: boolean
  onPress: () => void;
 }
 
export function TransactionTypeButton ({
  type,
  title,
  isActive,
  onPress,
  ...rest} : Props) {
  return (
    <Container 
      isActive={isActive}
      type={type}
      >
      <Button
        {...rest}
        onPress={onPress}
      >
        <Icon 
          name={icons[type]}
          type={type}
        ></Icon>
        <Title>
          {title}
        </Title>
      </Button>
    </Container>
  )
}

