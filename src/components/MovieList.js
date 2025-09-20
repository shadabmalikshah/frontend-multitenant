import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ onCommentClick, user, onEdit, onDelete, refresh, userToken, tenant }) => {
MovieList.propTypes = {
  onCommentClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  refresh: PropTypes.bool,
  userToken: PropTypes.string,
  tenant: PropTypes.string,
  user: PropTypes.object,
};
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch movies from backend with Authorization header
    const headers = {
      'X-Tenant': tenant
    };
    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    }
  fetch(`http://${window.location.hostname}:8000/api/movies`, {
      headers
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMovies(data);
        } else {
          setMovies([]);
        }
      });
  }, [refresh, userToken]);

  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onCommentClick={onCommentClick}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default MovieList;
