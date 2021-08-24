const baseUrl = 'http://localhost:3000/api/v1/';

const categories = document.getElementById("barra_pesquisa_id");

document.addEventListener('DOMContentLoaded', () => {
  fetch(`${baseUrl}/categoria/getAll`)
    .then(res => {
      if (res.status >= 400 && res.status < 600) {
        throw new Error("Bad res from server");
      }
      return res.json();
    })
    .then(res => res.forEach(category => {
      const categoryOption = document.createElement('option');
      categoryOption.value = category;
      categoryOption.innerText = category;
  
      categories.appendChild(categoryOption);
    }))
    .catch(res => console.log(res));
});

categories.onchange = resetMovies;

const WrapperFilmes = document.getElementById("WrapperFilmes");

let startMovies = 0, finalMovies = 4;

function resetMovies() {
  startMovies = 0;
  finalMovies = 4;
  WrapperFilmes.innerHTML = '';
  loadMore();
}

let mostPopular = [];
let totalPages;
let currentPage = 1;

async function loadMovies() {
  // if(categories.value != 'viewers') {
  //   // FIXME conferir se isso daqui funciona
  //   // FIXME colocar a categoria em questão na url
  //   fetch(`${baseUrl}filme/getAll?page=${currentPage}`)
  //   .then(result => result.json())
  //   .then(res => {
  //     const obj = {
  //       results: [{
  //         id: 0,
  //         categoria: 'tt',
  //         duracao: 120,
  //         nome: 'titulo',
  //         produtora: 'prod',
  //         arquivo: {},
  //         descricao: 'siopse',
  //         url_trailer: 'url_trailer',
  //         image_url: 'image',
  //         ator: {
  //           id: 2,
  //           nome: 'nome_ator',
  //           nascimento: new Date
  //         },
  //         diretor: {
  //           id: 3,
  //           nome: 'nome_diretor',
  //           nascimento: new Date,
  //           filmesDirigidos: 20
  //         }
  //       }],
  //       qtdePaginas: 2
  //     }

  //     res.results.map((result) => {

  //       const filmeWrap = document.createElement("div");
  //       filmeWrap.classList.add("filmeContent");
  //       filmeWrap.onclick = () => loadTrailler(result.url_trailer);

  //       const filmeImg = document.createElement("img");
  //       filmeImg.src = result.image_url;
  //       filmeImg.alt = `Capa de ${result.nome}`;
  //       result.genre_ids.map((genre) => {
  //         filmeWrap.classList.add(genre);
  //       })

  //       filmeWrap.id = String(result.id);
  //       filmeWrap.appendChild(filmeImg);

  //       mostPopular.push(filmeWrap);
  //     })

  //     totalPages = res.total_pages;

  //     loadMore();
  //   });
  // } else {
  //   // FIXME colocar o id do usuário na url
  //   fetch(`${baseUrl}filme_assistido/getAll?page=${currentPage}`)
  //   .then(result => result.json())
  //   .then(data => {
  //     data.results.map((result) => {

  //       const capa = document.createElement("div");
  //       capa.classList.add("capa");

  //       const capaImg = document.createElement("img");
  //       capaImg.onclick= () => window.location = `/pages/movie.html?id=${result.id}`;
  //       capaImg.src = result.poster_path ? `https://image.tmdb.org/t/p/w200${result.poster_path}`:'/imagens/not_image.png';
  //       capaImg.alt = `Capa de ${result.title}`;
  //       capaImg.style.cursor = "pointer";
  //       result.genre_ids.map((genre) => {
  //         capa.classList.add(genre);
  //       })

  //       capa.id = String(result.id);
  //       capa.appendChild(capaImg);

  //       mostPopular.push(capa);
  //     })

  //     totalPages = data.total_pages;

  //     loadMore();
  //   });
  // }
  
}

async function loadMore() {
  let foundItems = 0;

  for(let i=startMovies; i<finalMovies; i++) {
    if(i >= mostPopular.length) {

      if(currentPage === totalPages){
        loadMoreButton.onclick = () => {};
        return;
      }

      startMovies = finalMovies + foundItems - 6;

      currentPage++;
      return loadMovies();
    }

    await addCapa(i);
  }

  startMovies = finalMovies;
  finalMovies += 4;
}

document.addEventListener('DOMContentLoaded', loadMovies);

const loadMoreButton = document.getElementById("botao_filmes");

loadMoreButton.onclick = loadMore;

const teste = document.getElementById('teste');
const FilmSelectedOverlay = document.getElementById('FilmSelectedOverlay');

// TODO carregar o trailer do clicado
const loadTrailler = (url) => {
  FilmSelectedOverlay.style.display = 'flex';
}

// TODO remove this
document.getElementById('teste').onclick = loadTrailler;

const filmDiv = document.getElementById('ShowFilm');

const showMovieButton = document.getElementById('show-movie');
showMovieButton.onclick = () => {
  filmDiv.style.display = 'flex';
  FilmSelectedOverlay.style.display = 'none';

  setTimeout(() => {
    filmDiv.style.display = 'none';
    FilmSelectedOverlay.style.display = 'flex';
  }, 2000);
};

FilmSelectedOverlay.onclick = e => {
  if(e.target == FilmSelectedOverlay) FilmSelectedOverlay.style.display = 'none';
}
