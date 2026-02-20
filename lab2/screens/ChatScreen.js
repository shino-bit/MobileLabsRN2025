import React from 'react';
import { FlatList } from 'react-native';
import { ScreenContainer, Header, HeaderTitle } from '../components/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import ChatItem from '../components/ChatItem';


const DEFAULT_AVATAR = 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';

const CHAT_DATA = [
  {
    id: '1',
    name: 'GamerX',
    avatar: DEFAULT_AVATAR,
    lastMessage: 'Пішли в CS2?',
    time: '18:45',
    isOnline: true,
  },
  {
    id: '2',
    name: 'SniperPro',
    avatar: DEFAULT_AVATAR,
    lastMessage: 'gg wp',
    time: 'Вчора',
    isOnline: false,
  },
  {
    id: '3',
    name: 'Gordon Freeman',
    avatar: DEFAULT_AVATAR,
    lastMessage: '...',
    time: 'Вівторок',
    isOnline: true,
  },
  {
    id: '4',
    name: 'Master69',
    avatar: DEFAULT_AVATAR,
    lastMessage: 'Як пройти того боса?',
    time: '12 Лют',
    isOnline: false,
  },
  {
    id: '5',
    name: 'Arthur',
    avatar: DEFAULT_AVATAR,
    lastMessage: 'I have a plan, Dutch!',
    time: '10:15',
    isOnline: true,
  },
  {
    id: '6',
    name: 'Geralt',
    avatar: DEFAULT_AVATAR,
    lastMessage: 'Позбираємо усі картки у відьмак 1?',
    time: '09:30',
    isOnline: false,
  },
  {
    id: '7',
    name: 'Lara',
    avatar: DEFAULT_AVATAR,
    lastMessage: 'Го некст.',
    time: 'Пн',
    isOnline: true,
  },
  {
    id: '8',
    name: 'Master',
    avatar: DEFAULT_AVATAR,
    lastMessage: 'Підготуй нове лобі.',
    time: 'Нд',
    isOnline: false,
  },
  {
    id: '9',
    name: 'Slayer',
    avatar: DEFAULT_AVATAR,
    lastMessage: 'Ще одна катка в такому ж дусі і я ліваю з лобі',
    time: '01 Лют',
    isOnline: true,
  },
  {
    id: '10',
    name: 'CJ',
    avatar: DEFAULT_AVATAR,
    lastMessage: 'Кинь свій ДС.',
    time: '28 Січ',
    isOnline: false,
  },
];

export default function ChatScreen() {
  return (
    <ScreenContainer>
      <Header>
        <Ionicons name="chatbubbles" size={28} color="white" />
        <HeaderTitle>Chat</HeaderTitle>
      </Header>

      <FlatList
        data={CHAT_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem
            name={item.name}
            avatar={item.avatar}
            lastMessage={item.lastMessage}
            time={item.time}
            isOnline={item.isOnline}
          />
        )}
        contentContainerStyle={{ paddingBottom: 80 }} 
      />
    </ScreenContainer>
  );
}