// BlogComment.tsx
import React from 'react';
import './blogComment.css';

interface Comment {
  id: number;
  content: string;
  guest_session_id: string;
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
              <strong>{comment.author_username ? comment.author_username : comment.guest_session_id}</strong> ·{' '}
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
        Submit
      </button>
    </div>
  );
};

export default BlogComment;
