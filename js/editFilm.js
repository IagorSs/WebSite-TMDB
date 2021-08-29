const baseUrl = 'http://localhost:3000/api/v1/';

const formatTwoNumber = (numb) => numb < 10 ? `0${numb}`:`${numb}`;
const formatMinutes = (min) => `${formatTwoNumber(Math.floor(min / 60))}:${formatTwoNumber(min % 60)}`

const stringToMinute = (stringVal) => {
  const splitted = stringVal.split(':');
  return 60 * parseInt(splitted[0]) + parseInt(splitted[1]);
}

const nameField = document.getElementById('Name');
const idField = document.getElementById('Id');
const descriptionField = document.getElementById('Description');
const imageField = document.getElementById('Image');
const trailerIdField = document.getElementById('TrailerId');
const productorField = document.getElementById('Productor');
const categoryField = document.getElementById('Category');
const actorField = document.getElementById('Actor');
const directorField = document.getElementById('Director');
const durationField = document.getElementById('Duration');
durationField.onchange = ({target}) => stringToMinute(target.value);

const poster = document.getElementById('Poster');
imageField.onchange = ({target}) => poster.src = target.value;

const trailer = document.getElementById('Trailer');
trailerIdField.onchange = ({target}) => trailer.src = `https://www.youtube.com/embed/${target.value}`;

document.addEventListener('DOMContentLoaded', () => {
  const url = new URL(window.location.href);

  fetch(`${baseUrl}filme/get/${url.searchParams.get('id')}`)
    .then(res => res.json())
    .then(res => {
      console.log({res});

      nameField.value = res.nome;
      idField.value = res.id;
      descriptionField.value = res.descricao;
      imageField.value = res.imageUrl;
      trailerIdField.value = res.videoUrl;
      productorField.value = res.produtora;

      durationField.value = formatMinutes(res.duracao);

      poster.src = res.imageUrl;
      poster.alt = `Poster de ${res.nome}`;

      trailer.src = `https://www.youtube.com/embed/${res.videoUrl}`;

      fetch(`${baseUrl}categoria_filme/getAll`)
        .then(categoriesResponse => categoriesResponse.json())
        .then(categoriesResponse => {
          categoriesResponse.forEach(category => {
            const categoryOption = document.createElement('option');
            categoryOption.value = category;
            categoryOption.innerHTML = category;
            categoryField.appendChild(categoryOption);
          });

          selectValue(categoryField, res.categoria);

        });

      fetch(`${baseUrl}ator/getAll`)
        .then(actorResponse => actorResponse.json())
        .then(actorResponse => {
          actorResponse.forEach(actor => {
            const actorOption = document.createElement('option');
            actorOption.value = actor.id;
            actorOption.innerHTML = actor.nome;
            actorField.appendChild(actorOption);
          });

          selectValue(actorField, res.idAtorPrincipal.id);
        });

      fetch(`${baseUrl}diretor/getAll`)
      .then(diretorResponse => diretorResponse.json())
      .then(diretorResponse => {
        diretorResponse.forEach(director => {
          const directorOption = document.createElement('option');
          directorOption.value = director.id;
          directorOption.innerHTML = director.nome;
          directorField.appendChild(directorOption);
        });

        selectValue(directorField, res.idDiretor.id);
      });
    });
});

const selectValue = (Field, value) => {
  const { options } = Field;
  for (let j = 0; j < options.length; j++) {
    const opt = options[j];
    
    if (opt.value === value) {
      Field.selectedIndex = j;
      break;
    }
  }
}

const form = document.getElementById('UpdatedForm');
form.onsubmit = (e) => {
  e.preventDefault();

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const body = {
    id: idField.value,
    categoria: categoryField.value,
    duracao: stringToMinute(durationField.value),
    nome: nameField.value,
    produtora: productorField.value,
    arquivo: '',
    image_url: imageField.value,
    video_url: trailerIdField.value,
    descricao: descriptionField.value,
    id_ator_principal: actorField.value,
    id_diretor: directorField.value
  }

  fetch(`${baseUrl}filme/atualizar`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  })
  .then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error("Bad res from server");
    };
    alert('Sucesso na operação');
    window.location.reload();
  })
  .catch(res => {
    console.log(res);
    alert('Ocorreu um erro, tente novamente');
  });
}
