import styled from 'styled-components/native';

import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View `
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View `
  width: 100%;
  height: ${RFValue(113)}px;
  
  background-color: ${({ theme}) => theme.colors.primary};
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 19px;
`;

export const Title = styled.Text `
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(16)}px;

  color: ${({ theme }) => theme.colors.shape};
`;

export const Content = styled.ScrollView.attrs({

  
}) `

`;

export const ChartContainer = styled.View `
  width: 100%;
  align-items: center;
`;
