import React from 'react';
import styled from 'styled-components/native';

const PostCard = styled.View`
  background-color: ${(props) => props.theme.surface};
  margin-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.surfaceLight || '#2a475e'};
`;

const PostHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
`;

const AuthorAvatar = styled.Image`
  width: 35px;
  height: 35px;
  border-radius: 4px;
  background-color: #2a475e;
`;

const AuthorInfo = styled.View`
  margin-left: 10px;
`;

const AuthorName = styled.Text`
  color: #66c0f4;
  font-weight: bold;
  font-size: 14px;
`;

const PostDate = styled.Text`
  color: ${(props) => props.theme.subText};
  font-size: 11px;
`;

const PostImage = styled.Image`
  width: 100%;
  height: 250px;
  background-color: #171a21;
`;

const PostContent = styled.View`
  padding: 12px;
`;

const PostTitle = styled.Text`
  color: ${(props) => props.theme.text};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
`;

const PostDescription = styled.Text`
  color: ${(props) => props.theme.subText};
  font-size: 13px;
  line-height: 18px;
`;

export default function CommunityPost({ author, date, title, description, imageUrl, avatarUrl }) {
  return (
    <PostCard>
      <PostHeader>
        <AuthorAvatar source={{ uri: avatarUrl }} />
        <AuthorInfo>
          <AuthorName>{author}</AuthorName>
          <PostDate>{date}</PostDate>
        </AuthorInfo>
      </PostHeader>
      
      <PostImage source={{ uri: imageUrl }} resizeMode="cover" />
      
      <PostContent>
        <PostTitle>{title}</PostTitle>
        <PostDescription numberOfLines={3}>{description}</PostDescription>
      </PostContent>
    </PostCard>
  );
}