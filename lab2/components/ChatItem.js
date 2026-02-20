import React from 'react';
import styled from 'styled-components/native';

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.surfaceLight || '#2a475e'};
  align-items: center;
`;

const AvatarContainer = styled.View`
  margin-right: 15px;
  position: relative;
`;

const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background-color: #1b2838;
`;

const StatusIndicator = styled.View`
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: ${(props) => (props.isOnline ? '#53a4c4' : '#8f98a0')};
  position: absolute;
  bottom: -2px;
  right: -2px;
  border-width: 2px;
  border-color: ${(props) => props.theme.background};
`;

const ChatInfo = styled.View`
  flex: 1;
  justify-content: center;
`;

const UserName = styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const LastMessage = styled.Text`
  color: ${(props) => props.theme.subText};
  font-size: 14px;
`;

const TimeText = styled.Text`
  color: ${(props) => props.theme.subText};
  font-size: 12px;
`;

export default function ChatItem({ name, avatar, lastMessage, time, isOnline }) {
  return (
    <ItemContainer activeOpacity={0.7}>
      <AvatarContainer>
        <Avatar source={{ uri: avatar }} />
        <StatusIndicator isOnline={isOnline} />
      </AvatarContainer>
      
      <ChatInfo>
        <UserName>{name}</UserName>
        <LastMessage numberOfLines={1}>{lastMessage}</LastMessage>
      </ChatInfo>
      
      <TimeText>{time}</TimeText>
    </ItemContainer>
  );
}