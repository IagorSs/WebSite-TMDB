const form = {
  id: null,
  nome: null,
  nascimento: null
};

const baseUrl = 'https://api-tp-bd.herokuapp.com/api/v1/';

const idField = document.getElementById('Id');
idField.onchange = ({target}) => form.id = target.value;

const nameField = document.getElementById('Name');
nameField.onchange = ({target}) => form.nome = target.value;

const birthdayField = document.getElementById('Birthday');
birthdayField.onchange = ({target}) => form.nascimento = target.value;

const actors = {};

idField.onchange = () => attData();

const attFormsData = () => {
  form.id = idField.value;
  form.nome = nameField.value;
  form.nascimento = birthdayField.value;
}

const attData = () => {
  const current = actors[idField.value];

  nameField.value = current.nome;
  birthdayField.value = current.nascimento;

  attFormsData();
}

document.addEventListener('DOMContentLoaded', () => {
  fetch(`${baseUrl}ator/getAll`)
    .then(res => {
      if (res.status >= 400 && res.status < 600) {
        throw new Error("Bad res from server");
      }
      return res.json();
    })
    .then(res => {
      res.forEach(actor => {
        const { id } = actor;
        actors[id] = actor;

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
    case 'EditActor':
      apiPath = 'atualizar';
      method = 'PUT';
      break;
    case 'DeleteActor':
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

  fetch(`${baseUrl}ator/${apiPath}`, {
    method,
    headers,
    body: JSON.stringify(form)
  })
  .then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error("Bad res from server");
    }
    alert('Ator atualizado com sucesso!');
    window.location.reload();
  })
  .catch(res => {
    alert('Houve um erro');
    console.log(res);
  });
}
