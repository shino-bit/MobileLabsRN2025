import styled from 'styled-components/native';

export const ScreenContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 15px 20px;
  background-color: ${(props) => props.theme.background};
`;

export const HeaderTitle = styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 24px;
  font-weight: bold;
  margin-left: 10px;
`;