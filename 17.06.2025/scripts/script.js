document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = '596ca8a5';

  let page = 1;
  let foundItems = 0;
  let query = '';
  let filterType = '';

  const formEl = document.getElementById('filmSearchForm');
  const resultsSection = document.getElementById('resultsBlock');
  const cardContainer = document.getElementById('cardList');
  const paginationEl = document.querySelector('#pageNav ul');
  const infoPanel = document.getElementById('filmDetails');
  const notFoundEl = document.getElementById('emptyResult');
  const backBtn = document.getElementById('goBackBtn');
  const loader = document.getElementById('spinnerBox');
  const resultIndicator = document.getElementById('itemsFound');
  const warning = document.getElementById('warnBox');

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputVal = document.getElementById('movieInput').value.trim();
    const typeVal = document.getElementById('categorySelect').value;

    if (!inputVal) {
      warning.classList.remove('d-none');
      return;
    } else {
      warning.classList.add('d-none');
    }

    query = inputVal;
    filterType = typeVal;
    page = 1;

    toggleLoading(true);
    fetchMovies(query, filterType, page);
  });

  backBtn.addEventListener('click', () => {
    infoPanel.classList.add('d-none');
    resultsSection.classList.remove('d-none');
  });

  function fetchMovies(title, type, currentPage) {
    let endpoint = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(title)}&page=${currentPage}`;
    if (type) endpoint += `&type=${type}`;

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        toggleLoading(false);
        if (data.Response === 'True') {
          showResults(data);
        } else {
          displayEmptyState();
        }
      })
      .catch(err => {
        console.error('Помилка при запиті:', err);
        toggleLoading(false);
        displayEmptyState();
      });
  }

  function showResults(data) {
    foundItems = parseInt(data.totalResults, 10);
    cardContainer.innerHTML = '';

    data.Search.forEach(entry => {
      const card = generateCard(entry);
      cardContainer.appendChild(card);
    });

    renderPagination();
    resultIndicator.textContent = foundItems;

    resultsSection.classList.remove('d-none');
    infoPanel.classList.add('d-none');
    notFoundEl.classList.add('d-none');
  }

  function generateCard(movie) {
    const container = document.createElement('div');
    container.className = 'col-12 col-sm-6 col-lg-4 col-xl-3';

    const cardHTML = `
      <div class="card movie-card h-100 shadow-sm">
        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=Немає+постера'}" 
             class="card-img-top" alt="${movie.Title}" 
             onerror="this.src='https://via.placeholder.com/300x450?text=Немає+постера'">
        <div class="card-body">
          <h5 class="card-title">${movie.Title}</h5>
          <p class="card-text">${movie.Year} | ${localizeType(movie.Type)}</p>
          <button class="btn btn-outline-dark w-100 detail-btn" data-id="${movie.imdbID}">
            <i class="fas fa-info-circle me-2"></i>Деталі
          </button>
        </div>
      </div>
    `;

    container.innerHTML = cardHTML;
    container.querySelector('.detail-btn').addEventListener('click', () => {
      toggleLoading(true);
      getFullDetails(movie.imdbID);
    });

    return container;
  }

  function renderPagination() {
    paginationEl.innerHTML = '';
    const maxPages = Math.ceil(foundItems / 10);

    const buildItem = (label, disabled, onClick, isActive = false) => {
      const item = document.createElement('li');
      item.className = `page-item ${disabled ? 'disabled' : ''} ${isActive ? 'active' : ''}`;
      item.innerHTML = `<a class="page-link" href="#">${label}</a>`;
      if (!disabled) item.addEventListener('click', (e) => {
        e.preventDefault();
        onClick();
      });
      return item;
    };

    paginationEl.appendChild(buildItem('«', page === 1, () => {
      page--;
      toggleLoading(true);
      fetchMovies(query, filterType, page);
    }));

    const limit = 5;
    let start = Math.max(1, page - Math.floor(limit / 2));
    let end = Math.min(maxPages, start + limit - 1);

    if (end - start < limit - 1) {
      start = Math.max(1, end - limit + 1);
    }

    for (let i = start; i <= end; i++) {
      paginationEl.appendChild(buildItem(i, false, () => {
        page = i;
        toggleLoading(true);
        fetchMovies(query, filterType, page);
      }, i === page));
    }

    paginationEl.appendChild(buildItem('»', page === maxPages, () => {
      page++;
      toggleLoading(true);
      fetchMovies(query, filterType, page);
    }));
  }

  function getFullDetails(id) {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        toggleLoading(false);
        if (data.Response === 'True') showDetails(data);
      })
      .catch(err => {
        console.error('Помилка завантаження деталей:', err);
        toggleLoading(false);
      });
  }

  function showDetails(movie) {
    document.getElementById('movieName').textContent = `${movie.Title} (${movie.Year})`;
    document.getElementById('posterImage').src = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=Немає+постера';
    document.getElementById('posterImage').alt = movie.Title;

    document.getElementById('movieDescription').textContent = movie.Plot || 'Опис відсутній';
    document.getElementById('releaseDate').textContent = movie.Released || 'Невідомо';
    document.getElementById('movieTime').textContent = movie.Runtime || 'Невідомо';
    document.getElementById('movieGenre').textContent = movie.Genre || 'Невідомо';
    document.getElementById('directorName').textContent = movie.Director || 'Невідомо';
    document.getElementById('castList').textContent = movie.Actors || 'Невідомо';
    document.getElementById('countryName').textContent = movie.Country || 'Невідомо';
    document.getElementById('awardsInfo').textContent = movie.Awards || 'Немає інформації';
    document.getElementById('movieRating').textContent = movie.imdbRating ? `${movie.imdbRating}/10` : 'Немає рейтингу';
    document.getElementById('movieCategory').textContent = localizeType(movie.Type);
    document.getElementById('movieYear').textContent = movie.Year;

    infoPanel.classList.remove('d-none');
    resultsSection.classList.add('d-none');
  }

  function localizeType(rawType) {
    const dictionary = {
      movie: 'Фільм',
      series: 'Серіал',
      episode: 'Епізод'
    };
    return dictionary[rawType] || rawType;
  }

  function displayEmptyState() {
    resultsSection.classList.add('d-none');
    infoPanel.classList.add('d-none');
    notFoundEl.classList.remove('d-none');
  }

  function toggleLoading(state) {
    loader.classList.toggle('d-none', !state);
    resultsSection.classList.toggle('d-none', state);
    infoPanel.classList.add('d-none');
    notFoundEl.classList.add('d-none');
  }
});
