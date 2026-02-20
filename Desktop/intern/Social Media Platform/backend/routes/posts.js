const path = require('path');
const express = require('express');
const multer = require('multer');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({ storage });

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const post = await Post.create({
      author: req.user.id,
      content,
      image: req.file ? '/uploads/' + req.file.filename : ''
    });

    const populated = await Post.findById(post._id).populate('author', 'username profilePicture');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
});

router.get('/feed', auth, async (_req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch feed', error: error.message });
  }
});

router.get('/user/:id', auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user posts', error: error.message });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to edit this post' });
    }

    if (typeof req.body.content === 'string' && req.body.content.trim()) {
      post.content = req.body.content.trim();
    }

    if (req.file) {
      post.image = '/uploads/' + req.file.filename;
    }

    await post.save();

    const updated = await Post.findById(post._id)
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to delete this post' });
    }

    await Post.findByIdAndDelete(post._id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const alreadyLiked = post.likes.some((id) => id.toString() === req.user.id);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();

    res.json({
      message: alreadyLiked ? 'Post unliked' : 'Post liked',
      likesCount: post.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to like/unlike post', error: error.message });
  }
});

router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.user.id,
      text
    });

    await post.save();

    const updated = await Post.findById(post._id)
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');

    res.status(201).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
});

module.exports = router;
