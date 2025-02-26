import React, { useState } from 'react';

export const BuscadorPeliculas = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const api_key = '1de4415d33954e14940297ff43b351e6';
  const urlBase = 'https://api.themoviedb.org/3/search/movie';
  const urlImg = 'https://image.tmdb.org/t/p/w500';

  const searchMovies = async (page = 1) => {
    if (!inputValue.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${urlBase}?api_key=${api_key}&query=${inputValue}&page=${page}`);
      if (!response.ok) throw new Error('Error en la solicitud');
      const data = await response.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error(error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchMovies();
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container">
      <h1>Buscador de Películas</h1>
      <div className="search-bar">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Buscar películas..."
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {loading ? (
        <div className="loading"></div>
      ) : (
        <div id="results">
          {movies.length === 0 ? (
            <p>No se encontraron resultados para tu búsqueda</p>
          ) : (
            movies.map(movie => (
              <div key={movie.id} className="movie">
                <img src={`${urlImg}${movie.poster_path}`} alt={`Poster de ${movie.title}`} />
                <h2>{movie.title}</h2>
                <p>Lanzamiento: {new Date(movie.release_date).toLocaleDateString()}</p>
                <p>⭐ Calificación: {movie.vote_average}</p>
                <p>{movie.overview}</p>
                <button onClick={() => window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank')}>
                  Más información
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => searchMovies(currentPage - 1)}>Anterior</button>
        )}
        {currentPage < totalPages && (
          <button onClick={() => searchMovies(currentPage + 1)}>Siguiente</button>
        )}
      </div>
    </div>
  );
};
