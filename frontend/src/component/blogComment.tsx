// BlogComment.tsx
import React, { useEffect, useState } from 'react';
import './blogComment.css';

interface Comment {
  id: number;
  content: string;
  author: string;
  author_username: string;
  created_at: number;
}

interface BlogCommentProps {
  comments: Comment[];
  onCommentSubmit: (comment: string) => void;
}

const BlogComment: React.FC<BlogCommentProps> = ({ comments, onCommentSubmit }) => {
  const [newComment, setNewComment] = React.useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=>{
    const checkStatus = async () =>{
      if (!isLoggedIn) return;
      const token = localStorage.getItem('access_token');
      if (!token){
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    };
    checkStatus();
  }, [isLoggedIn]);

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      onCommentSubmit(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="blog-comment-container">
      <h3>Comments ({comments.length})</h3>
      <ul className="comment-list">
        {comments.map((comment) => (
          <li className="comment-item" key={comment.id}>
            <div className="comment-meta">
              <strong>{comment.author_username}</strong> ·{' '}
              {new Date(comment.created_at).toLocaleDateString()}
            </div>
            <div className="comment-text">{comment.content}</div>
          </li>
        ))}
      </ul>
      <textarea
        className="comment-input"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        rows={4}
      />
      <button
        className="comment-submit"
        onClick={handleCommentSubmit}
        disabled={!newComment.trim()}
      >
        {isLoggedIn ? 'Submit' : 'Login to comment'}
      </button>
    </div>
  );
};

export default BlogComment;
