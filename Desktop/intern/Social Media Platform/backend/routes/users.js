const path = require('path');
const express = require('express');
const multer = require('multer');
const User = require('../models/User');
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

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});

router.put('/me', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    const updates = {};

    if (typeof req.body.bio === 'string') {
      updates.bio = req.body.bio;
    }

    if (req.file) {
      updates.profilePicture = '/uploads/' + req.file.filename;
    }

    if (String(req.body.removeProfilePicture).toLowerCase() === 'true') {
      updates.profilePicture = '';
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

router.delete('/me/profile-picture', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: '' },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete profile picture', error: error.message });
  }
});

router.post('/me/profile-picture/delete', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: '' },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete profile picture', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id).select('-password');

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const me = await User.findById(req.user.id).select('following');

    res.json({
      ...targetUser.toObject(),
      isFollowing: me.following.some((id) => id.toString() === targetUser._id.toString())
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

router.post('/:id/follow', auth, async (req, res) => {
  try {
    const targetId = req.params.id;

    if (targetId === req.user.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const [user, target] = await Promise.all([
      User.findById(req.user.id),
      User.findById(targetId)
    ]);

    if (!user || !target) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyFollowing = user.following.some((id) => id.toString() === targetId);
    if (alreadyFollowing) {
      return res.json({ message: 'Already following this user', isFollowing: true });
    }

    user.following.push(targetId);
    target.followers.push(req.user.id);

    await Promise.all([user.save(), target.save()]);

    res.json({ message: 'Followed user successfully', isFollowing: true });
  } catch (error) {
    res.status(500).json({ message: 'Follow failed', error: error.message });
  }
});

router.post('/:id/unfollow', auth, async (req, res) => {
  try {
    const targetId = req.params.id;

    if (targetId === req.user.id) {
      return res.status(400).json({ message: 'You cannot unfollow yourself' });
    }

    const [user, target] = await Promise.all([
      User.findById(req.user.id),
      User.findById(targetId)
    ]);

    if (!user || !target) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.following = user.following.filter((id) => id.toString() !== targetId);
    target.followers = target.followers.filter((id) => id.toString() !== String(req.user.id));

    await Promise.all([user.save(), target.save()]);

    res.json({ message: 'Unfollowed user successfully', isFollowing: false });
  } catch (error) {
    res.status(500).json({ message: 'Unfollow failed', error: error.message });
  }
});

module.exports = router;
