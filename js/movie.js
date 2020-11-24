const baseURL = "https://api.themoviedb.org/3/";

const key = "0c44ec8e26aea5702eb3cb2e20f8938d";

const content = document.getElementById("content");

const movieTitle = document.getElementById("movieTitle");

document.addEventListener('DOMContentLoaded', () => {
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  const movie = urlParams.get('id');

  fetch(`${baseURL}movie/${movie}?api_key=${key}&language=pt-BR`)
    .then(response => response.json())
    .then(data => {
      movieTitle.append(data.title);

      const img = document.createElement("img");
      img.src = data.poster_path ? `https://image.tmdb.org/t/p/w200${data.poster_path}`:'/imagens/not_image.png';
      img.alt = `Capa de ${data.title}`;

      const textContent = document.createElement("div");
      textContent.className = "textContent";

      const originalTitle = document.createElement("h2");
      originalTitle.append(data.original_title);
      textContent.appendChild(originalTitle);

      textContent.appendChild(document.createElement("hr"));

      const originalLanguage = document.createElement("p");
        const bold1 = document.createElement("span");
        bold1.className = "bold";
        bold1.append("Língua original: ");
        originalLanguage.appendChild(bold1);
        originalLanguage.append(data.original_language);
      textContent.appendChild(originalLanguage);

      const aval = document.createElement("p");
        const bold2 = document.createElement("span");
        bold2.className = "bold";
        bold2.append("Avaliação: ");
        aval.appendChild(bold2);
        aval.append(`${data.vote_average} / 10`);
      textContent.appendChild(aval);

      const releaseDate = document.createElement("p");
        const bold3 = document.createElement("span");
        bold3.className = "bold";
        bold3.append("Data de estreia: ");
        releaseDate.appendChild(bold3);
        releaseDate.append(`${data.release_date.slice(8,10)}/${data.release_date.slice(5,7)}/${data.release_date.slice(0,4)}`);
      textContent.appendChild(releaseDate);

      const description = document.createElement("p");
      description.id = "description";
      description.append(data.overview);
      textContent.appendChild(description);

      const genres = document.createElement("p");
        const bold4 = document.createElement("span");
        bold4.className = "bold";
        bold4.append("Gêneros: ");
        genres.appendChild(bold4);
        data.genres.map((genre, index) => {
          if(index == 0) genres.append(genre.name);
          else genres.append(`, ${genre.name}`);
        })
      textContent.appendChild(genres);


      content.appendChild(img);
      content.appendChild(textContent);
    })
});

const searchButton = document.getElementById('searchButton');

const searchField = document.getElementById('searchField');

searchField.addEventListener('keypress', (e) => e.key === 'Enter' ? searchMovie():'');

searchButton.addEventListener('click', searchMovie);

function searchMovie () {
  window.location = `/pages/search.html?movie=${searchField.value}`;
}