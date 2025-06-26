import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useParams } from 'react-router-dom';
import './blogReactions.css';

interface ReactionProps {
  blogId: string;
}

interface ReactionSummary {
  reaction: string; // updated from "reaction"
  count: number;
}

const reactionTypes = [
  { type: "like", emoji: "👍" },
  { type: "love", emoji: "❤️" },
  { type: "funny", emoji: "😂" },
  { type: "sad", emoji: "😢" },
  { type: "angry", emoji: "😠" },
];

const BlogReactions: React.FC<ReactionProps> = ({ blogId }) => {
  const [reactions, setReactions] = useState<ReactionSummary[]>([]);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();

  const fetchReactions = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(`/blog/detail/${id}/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = res.data;
      setReactions(data.reaction_summary || []);
      console.log(data);
      // Optional: Only if you send user's own reaction from backend
      // setUserReaction(data.user_reaction || null);
    } catch (err) {
      console.error('Failed to fetch reactions:', err);
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [blogId]);

  const handleReaction = async (reaction: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) return alert("Login to react.");

    setLoading(true);
    try {
      if (userReaction === reaction) {
        await axios.delete(`/blog/reaction/delete/${blogId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserReaction(null);
      } else {
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
      fetchReactions();
    } catch (err) {
      console.error("Failed to react:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reaction-buttons">
      <h4>Reactions</h4>
      <div className="reaction-list">
        {reactionTypes.map(({ type, emoji }) => {
          const count = reactions.find(r => r.reaction === type)?.count || 0;
          const isActive = userReaction === type;

          return (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              disabled={loading}
              className={`reaction-btn ${isActive ? 'active' : ''}`}
            >
              {emoji} <small>{count > 0 ? `${count}` : '0'}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BlogReactions;
