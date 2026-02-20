import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { ScreenContainer, Header, HeaderTitle } from '../components/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';

const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ShieldIcon = styled.View`
  margin-bottom: 30px;
`;

const Title = styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Subtitle = styled.Text`
  color: ${(props) => props.theme.subText};
  font-size: 16px;
  text-align: center;
  margin-bottom: 40px;
`;

const CodeContainer = styled.View`
  background-color: ${(props) => props.theme.surface};
  padding: 20px 40px;
  border-radius: 10px;
  margin-bottom: 20px;
  width: 100%;
  align-items: center;
`;

const AuthCode = styled.Text`
  color: ${(props) => props.theme.accent || '#66c0f4'};
  font-size: 40px;
  font-weight: bold;
  letter-spacing: 5px;
`;

const ProgressBarContainer = styled.View`
  width: 100%;
  height: 4px;
  background-color: ${(props) => props.theme.surfaceLight};
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 30px;
`;

const ProgressFill = styled.View`
  width: ${(props) => props.progress}%;
  height: 100%;
  background-color: ${(props) => props.theme.accent || '#66c0f4'};
`;

const ActionButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.surfaceLight};
  padding: 15px 30px;
  border-radius: 5px;
  width: 100%;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 16px;
  font-weight: bold;
`;

export default function SafetyScreen() {
  const [code, setCode] = useState('A8X2B');
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let newCode = '';
          for (let i = 0; i < 5; i++) {
            newCode += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          setCode(newCode);
          return 100;
        }
        return prev - 1; 
      });
    }, 50); 

    return () => clearInterval(timer);
  }, []);

  return (
    <ScreenContainer>
      <Header>
        <Ionicons name="shield-checkmark" size={28} color="white" />
        <HeaderTitle>Steam Guard</HeaderTitle>
      </Header>

      <Content>
        <ShieldIcon>
          <Ionicons name="shield" size={100} color="#66c0f4" />
        </ShieldIcon>

        <Title>Автентифікатор</Title>
        <Subtitle>Введіть цей код для входу в акаунт Steam.</Subtitle>

        <CodeContainer>
          <AuthCode>{code}</AuthCode>
        </CodeContainer>

        <ProgressBarContainer>
          <ProgressFill progress={progress} />
        </ProgressBarContainer>

        <ActionButton activeOpacity={0.7}>
          <ButtonText>Видалити автентифікатор</ButtonText>
        </ActionButton>
      </Content>
    </ScreenContainer>
  );
}