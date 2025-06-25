import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useParams } from 'react-router-dom';
import { FaHeart, FaLaugh, FaSadCry, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
interface ReactionProps {
  blogId: string;
}

interface ReactionSummary {
  reaction: string;
  count: number;
}

const reactionTypes = [
  { type: 'like', icon: <FaThumbsUp /> },
  { type: 'dislike', icon: <FaThumbsDown /> },
  { type: 'love', icon: <FaHeart /> },
  { type: 'sad', icon: <FaSadCry /> },
  { type: 'funny', icon: <FaLaugh /> },
];

const BlogReactions: React.FC<ReactionProps> = ({ blogId }) => {
  const [reactions, setReactions] = useState<ReactionSummary[]>([]);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();


  // 🔁 Fetch reactions and user reaction
  const fetchReactions = async () => {

    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(`/blog/detail/${id}/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = res.data;
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
        await axios.delete(`/blog/reaction/delete/${blogId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserReaction(null);
      } else {
        // ✅ React / update
        await axios.post(
            `/blog/reaction/create/${blogId}/`,
            { reaction },
            {
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            }
        );

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
    <div className="blog-reactions">
      {reactionTypes.map(({ type, icon }) => {
        const count = reactions.find(r => r.reaction === type)?.count || 0;
        const isActive = userReaction === type;

        return (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            disabled={loading}
            className={isActive ? 'selected-reaction' : ''}
          >
            {icon} {count > 0 && `(${count})`}
          </button>
        );
      })}
    </div>
  );
};

export default BlogReactions;
