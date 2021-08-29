const form = {
  nome: '',
  nascimento: ''
};

const baseUrl = 'http://localhost:3000/api/v1/';

const nameField = document.getElementById('Name');
nameField.onchange = ({target}) => form.nome = target.value;

const birthdayField = document.getElementById('Birthday');
birthdayField.onchange = ({target}) => form.nascimento = target.value;

const formTag = document.getElementById('UpdatedForm');
formTag.onsubmit = (e) => {
  e.preventDefault();

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  fetch(`${baseUrl}diretor/novo`, {
    method:'POST',
    headers,
    body: JSON.stringify(form)
  })
  .then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error("Bad res from server");
    }
    alert('Diretor cadastrado com sucesso!');
    window.location.reload();
  })
  .catch(res => {
    alert('Houve um erro');
    console.log(res);
  });
}
