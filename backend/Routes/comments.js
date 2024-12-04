const express = require('express');
const Comment = require('../Models/CommentModel');
const router = express.Router();

// Add a comment
router.post('/add', async (req, res) => {
  const { userId, username, comment, productId } = req.body;

  try {
    const newComment = new Comment({ userId, username, comment, productId });
    const savedComment = await newComment.save();
    res.json(savedComment);
  } catch (error) {
    res.status(400).json({ error: 'Error adding comment' });
  }
});

// Get all comments for a product
router.get('/get/:productId', async (req, res) => {
  try {
    const comments = await Comment.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching comments' });
  }
});

// Delete a comment
// Delete a comment
router.delete('/delete/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.query; // Retrieve userId from query params
  
    try {
      const comment = await Comment.findById(commentId);
  
      // Check if the comment exists
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
  
      // Check if the userId matches the comment's userId to ensure only the creator can delete it
      if (comment.userId.toString() !== userId) {
        return res.status(403).json({ error: 'Unauthorized: You can only delete your own comments' });
      }
  
      await comment.deleteOne();
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Error deleting comment' });
    }
  });
  

module.exports = router;
