import React from 'react';
import { FlatList } from 'react-native';
import { ScreenContainer, Header, HeaderTitle } from '../components/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import CommunityPost from '../components/CommunityPost';

const POSTS_DATA = [
  {
    id: 'p1',
    author: 'Steam News',
    date: '20 Feb, 2026',
    title: 'Steam Next Fest is Live!',
    description: 'Explore hundreds of free demos and watch developer livestreams all week long during Steam Next Fest.',
    imageUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/51100/header.jpg',
    avatarUrl: 'https://avatars.githubusercontent.com/u/462100?s=200&v=4'
  },
  {
    id: 'p2',
    author: 'Valve Updates',
    date: '18 Feb, 2026',
    title: 'Counter-Strike 2 - The Big Update',
    description: 'New maps, improved networking, and a brand new case are now available in the latest update for CS2.',
    imageUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg',
    avatarUrl: 'https://avatars.githubusercontent.com/u/462100?s=200&v=4'
  }
];

export default function CommunityScreen() {
  return (
    <ScreenContainer>
      <Header>
        <Ionicons name="people" size={28} color="white" />
        <HeaderTitle>Community</HeaderTitle>
      </Header>

      <FlatList
        data={POSTS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CommunityPost 
            author={item.author}
            date={item.date}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            avatarUrl={item.avatarUrl}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ScreenContainer>
  );
}