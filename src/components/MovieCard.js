import React from 'react';
import './MovieCard.css';

const MovieCard = ({ movie, onCommentClick, user, onEdit, onDelete }) => (
  <div className="movie-card">
    <img className="movie-poster" src={movie.posterUrl || 'https://via.placeholder.com/180x260?text=No+Image'} alt={movie.title} />
    <div className="movie-info">
      <h3>{movie.title}</h3>
      <p className="movie-description">{movie.description}</p>
      <div className="movie-meta">
        <span>Release Date: {movie.release_date}</span>
        <span>Likes: {movie.likes || 0}</span>
      </div>
      {user && user.role === 'user' && (
        <button className="comment-btn" onClick={() => onCommentClick(movie.id)}>Comments</button>
      )}
      {user && user.role === 'admin' && (
        <div style={{marginTop: '8px'}}>
          <button className="comment-btn" style={{background: '#007bff', marginRight: '8px'}} onClick={() => onEdit(movie)}>Edit</button>
          <button className="comment-btn" style={{background: '#dc3545'}} onClick={() => onDelete(movie.id)}>Delete</button>
        </div>
      )}
    </div>
  </div>
);

export default MovieCard;
