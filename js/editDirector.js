const form = {
  id: null,
  nome: null,
  nascimento: null,
  nFilmesDirigidos: 0
};

const baseUrl = 'http://localhost:3000/api/v1/';

const idField = document.getElementById('Id');
idField.onchange = ({target}) => form.id = target.value;

const nameField = document.getElementById('Name');
nameField.onchange = ({target}) => form.nome = target.value;

const birthdayField = document.getElementById('Birthday');
birthdayField.onchange = ({target}) => form.nascimento = target.value;

const filmesDirigidosField = document.getElementById('FilmesDirigidos');
filmesDirigidosField.onchange = ({target}) => form.nFilmesDirigidos = target.value;

const directors = {};

idField.onchange = () => attData();

const attFormsData = () => {
  form.id = idField.value;
  form.nome = nameField.value;
  form.nascimento = birthdayField.value;
  form.nFilmesDirigidos = filmesDirigidosField.value;
}

const attData = () => {
  const current = directors[idField.value];

  nameField.value = current.nome;
  birthdayField.value = current.nascimento;
  filmesDirigidosField.value = current.nFilmesDirigidos;

  attFormsData();
}

document.addEventListener('DOMContentLoaded', () => {
  fetch(`${baseUrl}diretor/getAll`)
    .then(res => {
      if (res.status >= 400 && res.status < 600) {
        throw new Error("Bad res from server");
      }
      return res.json();
    })
    .then(res => {
      res.forEach(actor => {
        const { id } = actor;
        directors[id] = actor;

        const opt = document.createElement('option');
        opt.value = id;
        opt.innerText = id;

        idField.appendChild(opt);
      });

      attData();
    })
    .catch(res => {
      alert('Houve um erro');
      console.log(res);
    });
});

const formTag = document.getElementById('UpdatedForm');
formTag.onsubmit = (e) => {
  e.preventDefault();

  let apiPath, method;

  switch (e.submitter.name) {
    case 'EditDirector':
      apiPath = 'atualizar';
      method = 'PUT';
      break;
    case 'DeleteDirector':
      apiPath = `deletar/${form.id}`;
      method = 'DELETE';
      break;
    default:
      break;
  };

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  fetch(`${baseUrl}diretor/${apiPath}`, {
    method,
    headers,
    body: JSON.stringify(form)
  })
  .then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error("Bad res from server");
    }
    alert('Diretor atualizado com sucesso!');
    window.location.reload();
  })
  .catch(res => {
    alert('Houve um erro');
    console.log(res);
  });
}
