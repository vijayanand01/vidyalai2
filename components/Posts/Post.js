import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import styled from '@emotion/styled';

const PostContainer = styled.div(() => ({
  width: '300px',
  margin: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
  padding: '16px',
}));

const CarouselContainer = styled.div(() => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
}));

const Carousel = styled.div(() => ({
  display: 'flex',
  overflowX: 'scroll',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollSnapType: 'x mandatory',
  position: 'relative',
}));

const CarouselItem = styled.div(() => ({
  flex: '0 0 auto',
  scrollSnapAlign: 'start',
}));

const Image = styled.img(() => ({
  width: '280px',
  height: 'auto',
  maxHeight: '300px',
  padding: '10px',
}));

const Content = styled.div(() => ({
  padding: '10px',
  '& > h2': {
    marginBottom: '16px',
  },
}));

const Button = styled.button(() => ({
  position: 'absolute',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  color: '#000',
  fontSize: '20px',
  cursor: 'pointer',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
}));

const PrevButton = styled(Button)`
  left: 10px;
`;

const NextButton = styled(Button)`
  right: 10px;
`;

const UserInfo = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
}));

const Avatar = styled.div(() => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#007bff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '10px',
  fontSize: '20px',
  color: '#fff',
}));

const UserName = styled.div(() => ({
  fontSize: '18px',
  fontWeight: 'bold',
}));

const UserEmail = styled.div(() => ({
  fontSize: '14px',
  color: '#6c757d',
}));

const Post = ({ post }) => {
  const carouselRef = useRef(null);

  const handleNextClick = () => {
    if (carouselRef.current) {
      const imageWidth = carouselRef.current.querySelector('img').clientWidth + 20; // Including padding
      carouselRef.current.scrollBy({
        left: imageWidth,
        behavior: 'smooth',
      });
    }
  };

  const handlePrevClick = () => {
    if (carouselRef.current) {
      const imageWidth = carouselRef.current.querySelector('img').clientWidth + 20; // Including padding
      carouselRef.current.scrollBy({
        left: -imageWidth,
        behavior: 'smooth',
      });
    }
  };

  const getInitials = (name) => {
    const names = name.split(' ');
    const initials = names.map(n => n.charAt(0)).join('');
    return initials;
  };

  return (
    <PostContainer>
      <UserInfo>
        <Avatar>{getInitials(post.user.name)}</Avatar>
        <div>
          <UserName>{post.user.name}</UserName>
          <UserEmail>{post.user.email}</UserEmail>
        </div>
      </UserInfo>
      <CarouselContainer>
        <PrevButton onClick={handlePrevClick}>&#10094;</PrevButton>
        <Carousel ref={carouselRef}>
          {post.images.map((image, index) => (
            <CarouselItem key={index}>
              <Image src={image.url} alt={post.title} />
            </CarouselItem>
          ))}
        </Carousel>
        <NextButton onClick={handleNextClick}>&#10095;</NextButton>
      </CarouselContainer>
      <Content>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </Content>
    </PostContainer>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    body: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string
      })
    ),
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string
    })
  }).isRequired,
};

export default Post;
