import React from 'react';
import styled from 'styled-components/native';
import { Image } from 'react-native';

const Card = styled.View`
  flex-direction: row;
  background-color: ${(props) => props.theme.surface};
  margin: 8px 15px;
  border-radius: 4px;
  overflow: hidden;
`;

const GameImage = styled.Image`
  width: 120px;
  height: 70px;
`;

const CardInfo = styled.View`
  flex: 1;
  padding: 8px 12px;
  justify-content: space-between;
`;

const GameTitle = styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 16px;
  font-weight: 500;
`;

const PriceText = styled.Text`
  color: ${(props) => props.theme.accent};
  font-size: 14px;
  text-align: right;
`;

export default function GameCard({ title, price, imageUrl }) {
  return (
    <Card>
      <GameImage source={{ uri: imageUrl || 'https://via.placeholder.com/120x70' }} />
      <CardInfo>
        <GameTitle>{title}</GameTitle>
        <PriceText>{price}</PriceText>
      </CardInfo>
    </Card>
  );
}