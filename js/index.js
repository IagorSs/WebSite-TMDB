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

const formatTwoNumber = (numb) => numb < 10 ? `0${numb}`:`${numb}`;
const formatMinutes = (min) => `${formatTwoNumber(Math.floor(min / 60))}:${formatTwoNumber(min % 60)}`

async function loadMovies() {
  // FIXME conferir se isso daqui funciona do if
  // FIXME colocar a categoria em questão na url do if
  // FIXME colocar o id do usuário na url do else
  // fetch(categories.value != 'viewers' ? `${baseUrl}filme/getAll?page=${currentPage}` : `${baseUrl}filme_assistido/getAll?page=${currentPage}`)
  //   .then(result => result.json())
  //   .then((res_) => {
  //   });
  const dataTest = {
    results: [{
      id: 0,
      categoria: 'tt',
      duracao: 125,
      nome: 'titulo',
      produtora: 'prod',
      arquivo: {},
      descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a sapien elit. Vivamus consequat sagittis justo, et egestas massa luctus vel. Phasellus varius ac nisi sit amet tempus. Suspendisse consequat, erat at dapibus egestas, erat ipsum iaculis nunc, non finibus leo libero ac risus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas ultricies lacus at facilisis pellentesque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a sapien elit. Vivamus consequat sagittis justo, et egestas massa luctus vel. Phasellus varius ac nisi sit amet tempus. Suspendisse consequat, erat at dapibus egestas, erat ipsum iaculis nunc, non finibus leo libero ac risus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas ultricies lacus at facilisis pellentesque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      url_trailer: 'url_trailer',
      image_url: '/images/not_image.png',
      ator: {
        id: 2,
        nome: 'nome_ator',
        nascimento: new Date
      },
      diretor: {
        id: 3,
        nome: 'nome_diretor',
        nascimento: new Date,
        filmesDirigidos: 20
      }
    }],
    qtdePaginas: 1
  }
  
  dataTest.results.map((result) => {

    const filmeContent = document.createElement("div");
    filmeContent.classList.add("filmeContent");
    filmeContent.onclick = () => loadTrailler(result.url_trailer);

    const filmeImg = document.createElement("img");
    filmeImg.src = result.image_url;
    filmeImg.alt = `Capa de ${result.nome}`;

    filmeContent.appendChild(filmeImg);

    const textContent = document.createElement('div');
    textContent.classList.add("textContent");

    const h2Title = document.createElement('h2');
    h2Title.innerText = result.nome;
    textContent.appendChild(h2Title);

    const duration = document.createElement('p');
    duration.innerHTML = `<b>Duração:</b> ${formatMinutes(result.duracao)}`;
    textContent.appendChild(duration);

    const producer = document.createElement('p');
    producer.innerHTML = `<b>Produtora:</b> ${result.produtora}`
    textContent.appendChild(producer);

    const director = document.createElement('p');
    director.innerHTML = `<b>Diretor:</b> ${result.diretor.nome}`;
    textContent.appendChild(director);

    const ator = document.createElement('p');
    ator.innerHTML = `<b>Ator Destaque:</b> ${result.ator.nome}`;
    textContent.appendChild(ator);

    const sinopse = document.createElement('p');
    sinopse.innerHTML = `<b>Sinopse:</b> ${result.descricao}`;
    textContent.appendChild(sinopse);

    filmeContent.appendChild(textContent);

    WrapperFilmes.appendChild(filmeContent);

    // mostPopular.push(filmeContent);
  })

  totalPages = dataTest.qtdePaginas;

  loadMore();
}

async function loadMore() {
  let foundItems = 0;

  for (let i = startMovies; i < finalMovies; i++) {
    if (i >= mostPopular.length) {

      if (currentPage === totalPages) {
        loadMoreButton.onclick = () => { };
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
  if (e.target == FilmSelectedOverlay) FilmSelectedOverlay.style.display = 'none';
}
