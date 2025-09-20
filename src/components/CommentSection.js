import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import './CommentSection.css';

const CommentSection = ({ movieId, onClose, userToken }) => {
  const [comments, setComments] = useState([]);
  // Removed unused myComments and setMyComments
CommentSection.propTypes = {
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func,
  userToken: PropTypes.string,
};
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    // Fetch all comments for the movie
    const tenant = window.location.hostname.split('.')[0] || 'solar';
  fetch(`http://${window.location.hostname}:8000/api/movies/${movieId}/all-comments`, {
      headers: {
        'X-Tenant': tenant,
        'Authorization': `Bearer ${userToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setComments(data);
        setLoading(false);
        // If you want to filter my comments client-side:
        // setMyComments(data.filter(c => c.user_id === /* current user id */));
      });
  }, [movieId, userToken]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const tenant = window.location.hostname.split('.')[0] || 'solar';
  fetch(`http://${window.location.hostname}:8000/api/movies/${movieId}/comments`, {
      method: 'POST',
      headers: {
        'X-Tenant': tenant,
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ movie_id: movieId, comment: newComment })
    })
      .then(res => res.json())
      .then(() => {
        setNewComment('');
        // Refresh comments
  fetch(`http://${window.location.hostname}:8000/api/movies/${movieId}/all-comments`, {
          headers: {
            'X-Tenant': tenant,
            'Authorization': `Bearer ${userToken}`
          }
        })
          .then(res => res.json())
          .then(data => setComments(data));
      });
  };

  return (
    <div className="comment-modal">
      <div className="comment-modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Comments</h2>
        {loading ? <p>Loading...</p> : (
          <>
            <div className="comments-list">
              {comments.length === 0 ? <p>No comments yet.</p> : comments.map(c => (
                <div key={c.id} className="comment-item">
                  <span className="comment-user">{c.user_name ? c.user_name : `User ${c.user_id}`}:</span>
                  <span className="comment-text">{c.comment}</span>
                  <span className="comment-date">{new Date(c.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="add-comment">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add your comment..."
                rows={3}
                style={{width: '100%', marginBottom: '8px'}}
              />
              <button onClick={handleAddComment} className="comment-btn">Add Comment</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentSection;