import React from 'react';

import {
  Container,
  Category,
  Icon
} from './styles';

interface Props {
  category: string;
}

export function CategorySelect({category} : Props) {
  return (
    <Container>
      <Category>{category}</Category>
      <Icon name="chevron-down"/>
    </Container>
  )
}