import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Button = styled.TouchableOpacity `
  height: ${RFValue(56)}px;
  width: 311px;

  margin-bottom: 16px;
  /* padding: 18px; */

  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: 5px;

  flex-direction: row;
  align-items: center;
`;

export const ImageContainer = styled.View `
  height: 100%;
  justify-content: center;
  align-items: center;

  padding: ${RFValue(16)}px;
  background-color: ${({ theme}) => theme.colors.background};
  border-right-width: 1px;
  border-color: ${({ theme }) => theme.colors.text}
`;

export const Text = styled.Text `
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;

  text-align: center;
`;
