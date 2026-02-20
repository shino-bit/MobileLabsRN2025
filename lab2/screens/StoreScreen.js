import React from 'react';
import { FlatList, ImageBackground, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, Header, HeaderTitle } from '../components/ScreenContainer';
import GameCard from '../components/GameCard';

const FeaturedScroll = styled.ScrollView`
  margin-top: 10px;
  margin-bottom: 20px;
`;

const FeaturedBackground = styled.ImageBackground`
  width: 320px;
  height: 180px;
  margin-left: 15px;
  border-radius: 8px;
  overflow: hidden;
  justify-content: flex-end;
  background-color: ${(props) => props.theme.surfaceLight};
`;

const GradientOverlay = styled.View`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 15px;
`;

const FeaturedTitle = styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 20px;
  font-weight: bold;
`;

const FeaturedPriceRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
`;

const DiscountTag = styled.Text`
  background-color: #a3cc27;
  color: #000;
  padding: 2px 6px;
  border-radius: 2px;
  font-weight: bold;
  margin-right: 10px;
`;

const PriceTextOld = styled.Text`
  color: #8f98a0;
  text-decoration-line: line-through;
  margin-right: 5px;
`;

const PriceTextNew = styled.Text`
  color: ${(props) => props.theme.accent};
  font-weight: bold;
`;

const FEATURED_GAMES = [
  { 
    id: 'f1', 
    title: 'Dead by Daylight', 
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/header.jpg',
    discount: '-70%', oldPrice: '$18', price: '$5' 
  },
  { 
    id: 'f2', 
    title: 'Cyberpunk 2077', 
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
    discount: '-50%', oldPrice: '$60', price: '$30' 
  },
];

const GAMES = [
  { id: '1', title: 'Grand Theft Auto V', price: '$10.00', img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg' },
  { id: '2', title: 'Battlefield 4', price: '$35.00', img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1238860/header.jpg' },
  { id: '3', title: 'Factorio', price: '$7.00', img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/427520/header.jpg' },
  { id: '4', title: 'Horizon Zero Dawn', price: '$38.00', img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1151640/header.jpg' },
];

export default function StoreScreen() {
  const renderHeader = () => (
    <FeaturedScroll horizontal showsHorizontalScrollIndicator={false}>
      {FEATURED_GAMES.map((item) => (
        <FeaturedBackground key={item.id} source={{ uri: item.image }}>
          <GradientOverlay>
             <FeaturedTitle>{item.title}</FeaturedTitle>
             <FeaturedPriceRow>
                <DiscountTag>{item.discount}</DiscountTag>
                <PriceTextOld>{item.oldPrice}</PriceTextOld>
                <PriceTextNew>{item.price}</PriceTextNew>
             </FeaturedPriceRow>
          </GradientOverlay>
        </FeaturedBackground>
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
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <GameCard title={item.title} price={item.price} imageUrl={item.img} />
        )}
      />
    </ScreenContainer>
  );
}