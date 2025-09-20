import React, { useState } from 'react';
import './MovieModal.css';

const MovieModal = ({ show, onClose, onSave, initialData, loading }) => {
  const [form, setForm] = useState(initialData ? {
    name: initialData.name || '',
    image: initialData.image || '',
    description: initialData.description || '',
    release_date: initialData.release_date || ''
  } : {
    name: '',
    image: '',
    description: '',
    release_date: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => {
  setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.description || !form.release_date) {
      setError('All fields except image are required.');
      return;
    }
    setError('');
    onSave(form);
  };

  if (!show) return null;

  return (
    <div className="movie-modal">
      <div className="movie-modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{initialData ? 'Edit Movie' : 'Add Movie'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
          />
          <input
            type="date"
            name="release_date"
            placeholder="Release Date"
            value={form.release_date}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={handleChange}
          />
          <button type="submit" className="movie-btn" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update' : 'Add'}
          </button>
        </form>
        {error && <p className="movie-error">{error}</p>}
      </div>
    </div>
  );
};

export default MovieModal;
