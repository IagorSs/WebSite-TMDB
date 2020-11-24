const baseURL = "https://api.themoviedb.org/3/";

const key = "0c44ec8e26aea5702eb3cb2e20f8938d";

const loadMore = document.getElementById('load-more');

let pageToLoad = 1;

const title = document.getElementById("busca");
const qtdeResults = document.getElementById("qtde_results");

const capas = document.getElementById("espaco_capas");

function getSearch() {
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  const movie = urlParams.get('movie');

  fetch(`${baseURL}search/movie?api_key=${key}&query=${movie}&language=pt-BR&page=${pageToLoad}`)
    .then(response => response.json())
    .then(data => {
      if(pageToLoad == 1) {
        title.append(movie);
        qtdeResults.append(data.total_results);
      }

      if(pageToLoad == data.total_pages) {
        loadMore.parentNode.removeChild(loadMore);
      }

      data.results.map((result) => {
        const wrapper = document.createElement("div");
        wrapper.className = "capa";
        wrapper.onclick = () => window.location = `/pages/movie.html?id=${result.id}`;

        const link = document.createElement("div");

        const img = document.createElement("img");
        img.src = result.poster_path ? `https://image.tmdb.org/t/p/w200${result.poster_path}`:'/imagens/not_image.png';
        img.alt = `Capa de ${result.title}`;

        const description = document.createElement("div");
        description.className = "description";

        const movieTitle = document.createElement("h2");
        movieTitle.append(result.title);

        const movieDescription = document.createElement("p");
        movieDescription.append(result.overview==="" ? "Sem descrição disponível":result.overview);

        description.appendChild(movieTitle);
        description.appendChild(movieDescription);

        link.appendChild(img);

        wrapper.appendChild(link);
        wrapper.appendChild(description);

        capas.appendChild(wrapper);
      });

      pageToLoad++;
    });
}

document.addEventListener('DOMContentLoaded', getSearch);

loadMore.addEventListener('click', getSearch);

const searchButton = document.getElementById('searchButton');

const searchField = document.getElementById('searchField');

searchField.addEventListener('keypress', (e) => e.key === 'Enter' ? searchMovie():'');

searchButton.addEventListener('click', searchMovie);

function searchMovie () {
  window.location = `/pages/search.html?movie=${searchField.value}`;
}