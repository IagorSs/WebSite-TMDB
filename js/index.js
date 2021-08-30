const baseUrl = 'http://localhost:3000/api/v1/';

const categories = document.getElementById("barra_pesquisa_id");

const user = JSON.parse(sessionStorage.getItem('user'));

document.addEventListener('DOMContentLoaded', () => {
  fetch(`${baseUrl}plano/get/${user.inscricao}`)
    .then(res => {
      if (res.status >= 400 && res.status < 600) {
        throw new Error("Bad res from server");
      }
      return res.json();
    })
    .then(res => res.forEach(({categoria: category}) => {
      const categoryOption = document.createElement('option');
      categoryOption.value = category;
      categoryOption.innerText = category;

      categories.appendChild(categoryOption);
    }))
    .catch(res => console.log(res));
});

const loadCategory = (value) => {
  let apiPath = value === 'Assistidos' ? `assistidosDoUsuario/${user.inscricao}`:`filme/getCategoria/${value}`;
  
  fetch(`${baseUrl}${apiPath}`)
    .then(res => res.json())
    .then(res => resetMovies(res));
}

categories.onchange = ({target}) => loadCategory(target.value);

const WrapperFilmes = document.getElementById("WrapperFilmes");

function resetMovies(movies) {
  WrapperFilmes.innerHTML = '';
  loadMovies(movies);
};

const formatTwoNumber = (numb) => numb < 10 ? `0${numb}`:`${numb}`;
const formatMinutes = (min) => `${formatTwoNumber(Math.floor(min / 60))}:${formatTwoNumber(min % 60)}`

async function loadMovies(movies) {
  
  movies.forEach((result) => {

    const filmeContent = document.createElement("div");
    filmeContent.classList.add("filmeContent");
    filmeContent.onclick = () => loadOverlay(result);

    const filmeImg = document.createElement("img");
    filmeImg.src = result.imageUrl;
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
    director.innerHTML = `<b>Diretor:</b> ${result.idDiretor.nome}`;
    textContent.appendChild(director);

    const ator = document.createElement('p');
    ator.innerHTML = `<b>Ator Destaque:</b> ${result.idAtorPrincipal.nome}`;
    textContent.appendChild(ator);

    const sinopse = document.createElement('p');
    sinopse.innerHTML = `<b>Sinopse:</b> ${result.descricao}`;
    textContent.appendChild(sinopse);

    filmeContent.appendChild(textContent);

    WrapperFilmes.appendChild(filmeContent);
  })
}

document.addEventListener('DOMContentLoaded', () => loadCategory(categories.value));

const FilmSelectedOverlay = document.getElementById('FilmSelectedOverlay');
const loadOverlay = (filme) => {
  FilmSelectedOverlay.style.display = 'flex';

  FilmSelectedOverlay.innerHTML = '';

  const title = document.createElement('h1');
  title.textContent = filme.nome;
  FilmSelectedOverlay.appendChild(title);

  const iframe = document.createElement('iframe');
  iframe.width='80%';
  iframe.height='60%';
  iframe.allowFullscreen=true;
  iframe.src=`https://www.youtube.com/embed/${filme.videoUrl}`;
  FilmSelectedOverlay.appendChild(iframe);

  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('overlay-buttons');

  const buttonFilmeEdit = document.createElement('button');
  buttonFilmeEdit.classList.add('primary-button');
  buttonFilmeEdit.innerText='Editar Filme';
  buttonFilmeEdit.onclick= () => window.location.replace(`/pages/editFilm.html?id=${filme.id}`);

  const buttonFilme = document.createElement('button');
  buttonFilme.classList.add('primary-button');
  buttonFilme.innerText='Ir para o Filme';
  buttonFilme.onclick= showFilme;

  const buttonFilmeDelete = document.createElement('button');
  buttonFilmeDelete.classList.add('primary-button');
  buttonFilmeDelete.innerText='Deletar Filme';
  buttonFilmeDelete.onclick= () => {
    fetch(`${baseUrl}filme/deletar/${filme.id}`, { method: 'DELETE' })
      .then(() => alert('Filme deletado'))
      .catch(() => alert('Houver um erro'))
  };

  buttonsDiv.appendChild(buttonFilmeEdit);
  buttonsDiv.appendChild(buttonFilme);
  buttonsDiv.appendChild(buttonFilmeDelete);

  FilmSelectedOverlay.appendChild(buttonsDiv);
}

const filmDiv = document.getElementById('ShowFilm');
const showFilme = () => {
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
