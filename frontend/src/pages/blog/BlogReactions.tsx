import React, { useState } from 'react';

interface ReactionProps {
  blogId: string;
  onReacted: () => void;
}

const reactionTypes = ["like", "love", "funny", "sad", "angry"];

const BlogReactions: React.FC<ReactionProps> = ({ blogId, onReacted }) => {
  const [selectedReaction, setSelectedReaction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReaction = async (reaction: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("You must be logged in to react.");
      return;
    }

    setLoading(true);
    try {
      await fetch(`http://127.0.0.1:8000/api/blog/reaction/create/${blogId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reaction }),
      });

      setSelectedReaction(reaction);
      onReacted();  // Refresh reaction data if needed
    } catch (error) {
      console.error("Failed to send reaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reaction-buttons">
      {reactionTypes.map((reaction) => (
        <button
          key={reaction}
          onClick={() => handleReaction(reaction)}
          disabled={loading}
          className={reaction === selectedReaction ? 'selected-reaction' : ''}
        >
          {reaction}
        </button>
      ))}
    </div>
  );
};

export default BlogReactions;
