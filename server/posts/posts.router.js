const express = require('express');
const axios = require('axios');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');

const router = express.Router();

// GET /api/v1/posts route with pagination support
router.get('/', async (req, res) => {
  try {
    const start = parseInt(req.query._start) || 0;
    const limit = parseInt(req.query._limit) || 10; // Default limit if not specified

    console.log(`Fetching posts from start: ${start} with limit: ${limit}`);

    const posts = await fetchPosts({ start, limit });

    const postsWithImages = await Promise.all(posts.map(async (post) => {
      const { data: photos } = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
      return {
        ...post,
        images: photos.slice(0, 3).map(photo => ({
          url: photo.thumbnailUrl,
        })),
      };
    }));

    res.json(postsWithImages);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

module.exports = router;
