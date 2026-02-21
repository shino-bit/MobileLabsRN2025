import React, { useContext } from 'react'; 
import { ScrollView, Switch, View } from 'react-native'; 
import styled from 'styled-components/native';
import { ScreenContainer, Header, HeaderTitle } from '../components/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../App'; 

const ProfileTop = styled.View`
  flex-direction: row;
  padding: 20px;
  background-color: ${(props) => props.theme.surface};
  align-items: center;
  margin-bottom: 20px;
`;
const AvatarContainer = styled.View` position: relative; `;
const Avatar = styled.Image`
  width: 80px; height: 80px; border-radius: 8px; border-width: 2px;
  border-color: ${(props) => props.theme.accent || '#66c0f4'};
`;
const LevelBadge = styled.View`
  position: absolute; bottom: -10px; right: -10px; background-color: #eb4b4b;
  border-radius: 12px; width: 24px; height: 24px; align-items: center;
  justify-content: center; border-width: 2px; border-color: ${(props) => props.theme.surface};
`;
const LevelText = styled.Text` color: white; font-size: 12px; font-weight: bold; `;
const UserInfo = styled.View` margin-left: 20px; flex: 1; `;
const UserName = styled.Text` color: ${(props) => props.theme.text}; font-size: 22px; font-weight: bold; margin-bottom: 4px; `;
const Status = styled.Text` color: #53a4c4; font-size: 14px; `;
const SectionContainer = styled.View` padding: 0 20px; margin-bottom: 20px; `;
const SectionTitle = styled.Text`
  color: ${(props) => props.theme.text}; font-size: 18px; font-weight: bold;
  margin-bottom: 15px; border-bottom-width: 1px; border-bottom-color: ${(props) => props.theme.surfaceLight}; padding-bottom: 5px;
`;
const GameCard = styled.View`
  flex-direction: row; background-color: ${(props) => props.theme.surface};
  margin-bottom: 10px; border-radius: 6px; overflow: hidden;
`;
const GameImage = styled.Image` width: 100px; height: 60px; `;
const GameInfo = styled.View` padding: 8px 12px; justify-content: center; `;
const GameTitle = styled.Text` color: ${(props) => props.theme.text}; font-size: 14px; font-weight: bold; `;
const GameHours = styled.Text` color: ${(props) => props.theme.subText}; font-size: 12px; margin-top: 4px; `;

const ThemeSettingsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.surface};
  padding: 15px 20px;
  border-radius: 8px;
  margin-top: 10px;
  margin-bottom: 20px;
`;
const SettingText = styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 16px;
  font-weight: 500;
`;

export default function ProfileScreen() {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

  return (
    <ScreenContainer>
      <Header>
        <Ionicons name="person" size={28} color={isDarkTheme ? "white" : "#171a21"} />
        <HeaderTitle>Profile</HeaderTitle>
      </Header>

      <ScrollView>
        <ProfileTop>
          <AvatarContainer>
            <Avatar source={{ uri: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' }} />
            <LevelBadge>
              <LevelText>14</LevelText>
            </LevelBadge>
          </AvatarContainer>
          <UserInfo>
            <UserName>GamerX</UserName>
            <Status>В мережі</Status>
          </UserInfo>
        </ProfileTop>

        <SectionContainer>
          <ThemeSettingsRow>
            <SettingText>Темна тема</SettingText>
            <Switch
              trackColor={{ false: "#767577", true: "#66c0f4" }}
              thumbColor={isDarkTheme ? "#ffffff" : "#f4f3f4"}
              onValueChange={toggleTheme}
              value={isDarkTheme}
            />
          </ThemeSettingsRow>

          <SectionTitle>Нещодавня активність</SectionTitle>
          
          <GameCard>
            <GameImage source={{ uri: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg' }} />
            <GameInfo>
              <GameTitle>Counter-Strike 2</GameTitle>
              <GameHours>42 год. за останні 2 тижні</GameHours>
            </GameInfo>
          </GameCard>

          <GameCard>
            <GameImage source={{ uri: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg' }} />
            <GameInfo>
              <GameTitle>Cyberpunk 2077</GameTitle>
              <GameHours>12 год. за останні 2 тижні</GameHours>
            </GameInfo>
          </GameCard>
        </SectionContainer>
      </ScrollView>
    </ScreenContainer>
  );
}