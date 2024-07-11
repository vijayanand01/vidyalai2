import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import useWindowWidth from '../hooks/useWindowWidth';

const CarouselContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  transition: 'transform 0.5s ease', // Add transition for smooth sliding effect
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

const ShowMoreButton = styled.button`
  margin-top: 10px;
  margin-bottom: 20px; /* Adjust margin as needed */
  margin-left: 650px;
  padding: 10px 20px;
  background-color: #28a745; /* Green color for "Show More" button */
  color: white;
  border: none;
  cursor: pointer;
`;

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visiblePosts, setVisiblePosts] = useState(4); // Initial number of posts to display
  const [hasMorePosts, setHasMorePosts] = useState(true); // Flag to track if there are more posts to load
  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    fetchPostsData();
  }, [isSmallerDevice]);

  const fetchPostsData = async () => {
    try {
      const { data: initialPostsData } = await axios.get('/api/v1/posts'); // Fetch all posts initially
      const { data: usersData } = await axios.get('https://jsonplaceholder.typicode.com/users');

      // Combine post data with user data
      const postsWithUsers = initialPostsData.map(post => ({
        ...post,
        user: usersData.find(user => user.id === post.userId)
      }));

      setPosts(postsWithUsers);
    } catch (error) {
      console.error('Error fetching posts or users:', error);
    }
  };

  const handlePrevClick = () => {
    setCurrentIndex(currentIndex => Math.max(currentIndex - 1, 0));
  };

  const handleNextClick = () => {
    setCurrentIndex(currentIndex => Math.min(currentIndex + 1, posts.length - 1));
  };

  const handleShowMore = () => {
    setVisiblePosts(posts.length); // Show all fetched posts
    setHasMorePosts(false); // No more posts to load
  };

  return (
    <Container>
      <CarouselContainer>
        <PostListContainer style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {posts.slice(0, visiblePosts).map(post => (
            <Post key={post.id} post={post} />
          ))}
        </PostListContainer>
      </CarouselContainer>
      {hasMorePosts && (
        <ShowMoreButton onClick={handleShowMore}>
          Load More
        </ShowMoreButton>
      )}
    </Container>
  );
}
