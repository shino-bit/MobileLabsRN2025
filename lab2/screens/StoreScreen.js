import React from 'react';
import { FlatList, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { ScreenContainer, Header, HeaderTitle } from '../components/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';

// --- Стилі для горизонтальної галереї (Featured) ---
const FeaturedScroll = styled.ScrollView`
  margin-bottom: 20px;
`;

const FeaturedCard = styled.View`
  width: 320px;
  height: 180px;
  background-color: ${(props) => props.theme.surfaceLight};
  margin-left: 15px;
  border-radius: 8px;
  justify-content: flex-end;
  padding: 15px;
  overflow: hidden;
`;

const FeaturedTitle = styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 22px;
  font-weight: bold;
`;

const FeaturedSubtitle = styled.Text`
  color: ${(props) => props.theme.subText};
  font-size: 12px;
  margin-bottom: 8px;
`;

const FeaturedPriceRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DiscountTag = styled.Text`
  background-color: ${(props) => props.theme.accentGreen || '#a3cc27'};
  color: #000;
  padding: 2px 6px;
  border-radius: 2px;
  font-weight: bold;
  margin-right: 10px;
`;

const PriceTextOld = styled.Text`
  color: ${(props) => props.theme.subText};
  text-decoration-line: line-through;
  margin-right: 5px;
`;

const PriceTextNew = styled.Text`
  color: ${(props) => props.theme.accent};
  font-weight: bold;
`;

// --- Стилі для вертикального списку (Звичайні ігри) ---
const GameCard = styled.View`
  flex-direction: row;
  background-color: ${(props) => props.theme.surface};
  margin: 8px 15px;
  border-radius: 4px;
  overflow: hidden;
`;

const ImagePlaceholder = styled.View`
  width: 120px;
  height: 70px;
  background-color: ${(props) => props.theme.surfaceLight};
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

// --- Дані ---
const FEATURED_GAMES = [
  { id: 'f1', title: 'Dead by Daylight', subtitle: 'Recommended by your friend, Player', discount: '-70%', oldPrice: '$18', price: '$5' },
  { id: 'f2', title: 'Cyberpunk 2077', subtitle: 'Top Seller', discount: '-50%', oldPrice: '$60', price: '$30' },
];

const GAMES = [
  { id: '1', title: 'Grand Theft Auto V', price: '$10.00' },
  { id: '2', title: 'Battlefield 4', price: '$35.00' },
  { id: '3', title: 'Factorio', price: '$7.00' },
  { id: '4', title: 'Horizon Zero Dawn', price: '$38.00' },
  { id: '5', title: 'Rust', price: '$40.00' },
  { id: '6', title: 'Phasmophobia', price: '$14.00' },
];

export default function StoreScreen() {
  
  // Компонент шапки зі слайдером, який ми передамо у FlatList
  const renderHeader = () => (
    <FeaturedScroll 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 15 }} // Відступ для останньої картки
    >
      {FEATURED_GAMES.map((game) => (
        <FeaturedCard key={game.id}>
          <FeaturedTitle>{game.title}</FeaturedTitle>
          <FeaturedSubtitle>{game.subtitle}</FeaturedSubtitle>
          <FeaturedPriceRow>
            <DiscountTag>{game.discount}</DiscountTag>
            <PriceTextOld>{game.oldPrice}</PriceTextOld>
            <PriceTextNew>{game.price}</PriceTextNew>
          </FeaturedPriceRow>
        </FeaturedCard>
      ))}
    </FeaturedScroll>
  );

  return (
    <ScreenContainer>
      <Header>
        <Ionicons name="logo-steam" size={28} color="white" />
        <HeaderTitle>Store</HeaderTitle>
      </Header>

      <FlatList
        data={GAMES}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader} // ВАЖЛИВО: вставляємо галерею сюди
        renderItem={({ item }) => (
          <GameCard>
            <ImagePlaceholder />
            <CardInfo>
              <GameTitle>{item.title}</GameTitle>
              <PriceText>{item.price}</PriceText>
            </CardInfo>
          </GameCard>
        )}
      />
    </ScreenContainer>
  );
}