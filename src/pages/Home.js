import PropTypes from 'prop-types';
import React, { useState } from 'react';
import MovieList from '../components/MovieList';
import CommentSection from '../components/CommentSection';
import MovieModal from '../components/MovieModal';

const Home = ({ userToken, user, tenant }) => {
Home.propTypes = {
  userToken: PropTypes.string,
  user: PropTypes.shape({
    role: PropTypes.string,
    email: PropTypes.string,
  }),
  tenant: PropTypes.string,
};
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [editMovieData, setEditMovieData] = useState(null);
  const [movieLoading, setMovieLoading] = useState(false);
  const [refreshMovies, setRefreshMovies] = useState(false);

  const handleCommentClick = (movieId) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseComment = () => {
    setSelectedMovieId(null);
  };

  // Admin: Add movie
  const handleAddMovie = () => {
    setEditMovieData(null);
    setShowMovieModal(true);
  };

  // Admin: Edit movie
  const handleEditMovie = (movie) => {
    setEditMovieData(movie);
    setShowMovieModal(true);
  };

  // Admin: Delete movie
  const handleDeleteMovie = (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    setMovieLoading(true);
  fetch(`http://${window.location.hostname}:8000/api/movies/${movieId}`, {
      method: 'DELETE',
      headers: {
        'X-Tenant': tenant,
        'Authorization': `Bearer ${userToken}`
      }
    })
      .then(res => res.json())
      .then(() => {
        setMovieLoading(false);
        setRefreshMovies(r => !r);
      });
  };

  // Admin: Save (add/edit) movie
  const handleSaveMovie = (form) => {
    setMovieLoading(true);
    const isEdit = !!editMovieData;
  const url = isEdit ? `http://${window.location.hostname}:8000/api/movies/${editMovieData.id}` : `http://${window.location.hostname}:8000/api/movies`;
    const method = isEdit ? 'PUT' : 'POST';
    // Map frontend fields to backend fields
    const movieData = {
      name: form.name,
      image: form.image,
      description: form.description,
      release_date: form.release_date
    };
    fetch(url, {
      method,
      headers: {
        'X-Tenant': tenant,
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movieData)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          // Show error from backend
          alert(data.message || 'Failed to save movie');
        } else {
          setShowMovieModal(false);
          setRefreshMovies(r => !r);
        }
        setMovieLoading(false);
      })
      .catch(() => {
        alert('Network error');
        setMovieLoading(false);
      });
  };

  return (
    <div className="home">
      {/* Banner section placeholder */}
      <div className="banner" style={{width: '100%', height: '220px', background: '#f5f5f5', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#e71a0f', fontWeight: 'bold'}}>
        Best Navratri Events at Zero Booking Fees!
      </div>
      {/* Recommended Movies section */}
      <div className="recommended-movies">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginRight: '16px'}}>
          <h2 style={{marginLeft: '16px'}}>Recommended Movies</h2>
          {user && user.role === 'admin' && (
            <button className="comment-btn" style={{background: '#28a745'}} onClick={handleAddMovie}>Add Movie</button>
          )}
        </div>
        <MovieList
          onCommentClick={handleCommentClick}
          user={user}
          onEdit={handleEditMovie}
          onDelete={handleDeleteMovie}
          refresh={refreshMovies}
          userToken={userToken}
          tenant={tenant}
        />
        {selectedMovieId && (
          <CommentSection movieId={selectedMovieId} onClose={handleCloseComment} userToken={userToken} />
        )}
        <MovieModal
          show={showMovieModal}
          onClose={() => setShowMovieModal(false)}
          onSave={handleSaveMovie}
          initialData={editMovieData}
          loading={movieLoading}
        />
      </div>
    </div>
  );
};

export default Home;