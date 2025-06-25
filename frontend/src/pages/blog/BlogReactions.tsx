import React, { useEffect, useState } from 'react';

interface ReactionProps {
  blogId: string;
}

interface ReactionSummary {
  reaction: string;
  count: number;
}

const reactionTypes = ["like", "love", "funny", "sad", "angry"];

const BlogReactions: React.FC<ReactionProps> = ({ blogId }) => {
  const [reactions, setReactions] = useState<ReactionSummary[]>([]);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔁 Fetch reactions and user reaction
  const fetchReactions = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://127.0.0.1:8000/api/blog/detail/${blogId}/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      const { reactions, user_reaction } = data[0];
      setReactions(reactions || []);
      setUserReaction(user_reaction || null);
    } catch (err) {
      console.error('Failed to fetch reactions:', err);
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [blogId]);

  // 🧠 Handle create/undo
  const handleReaction = async (reaction: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) return alert("Login to react.");

    setLoading(true);
    try {
      if (userReaction === reaction) {
        // 🔄 Undo reaction
        await fetch(`http://127.0.0.1:8000/api/blog/reaction/delete/${blogId}/`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserReaction(null);
      } else {
        // ✅ React / update
        await fetch(`http://127.0.0.1:8000/api/blog/reaction/create/${blogId}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reaction }),
        });
        setUserReaction(reaction);
      }
      fetchReactions(); // Refresh totals
    } catch (err) {
      console.error("Failed to react:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reaction-buttons">
      <h4>Reactions</h4>
      {reactionTypes.map((reaction) => {
        const count = reactions.find(r => r.reaction === reaction)?.count || 0;
        const isActive = userReaction === reaction;

        return (
          <button
            key={reaction}
            onClick={() => handleReaction(reaction)}
            disabled={loading}
            className={isActive ? 'selected-reaction' : ''}
          >
            {reaction} {count > 0 && `(${count})`}
          </button>
        );
      })}
    </div>
  );
};

export default BlogReactions;
