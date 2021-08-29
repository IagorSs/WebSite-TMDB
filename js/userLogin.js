if (sessionStorage.getItem('user')) window.location.replace(`/`);

const forms = {
  login: '',
  senha: ''
};

const userField = document.getElementById('User');
userField.onchange = ({ target }) => forms.login = target.value;

const passField = document.getElementById('Pass');
passField.onchange = ({ target }) => forms.senha = target.value;

const form = document.getElementById('user-form');
form.onsubmit = (event) => {
  event.preventDefault();

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const baseUrl = 'http://localhost:3000/api/v1/';

  let apiPath;

  switch (event.submitter.name) {
    case 'Login':
      apiPath='login';
      break;
    case 'Register':
      apiPath='novo';
      break;
    default:
      console.log('Inesperado');
      break;
  }

  fetch(`${baseUrl}usuario/${apiPath}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(forms)
  })
  .then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error("Bad res from server");
    }
    return res.json();
  })
  .then(res => {
    console.log('us', res);
    setUserSessionStorage(res);
    window.location.reload();
  })
  .catch(res => {
    alert('Houve um erro');
    console.log(res);
  });

}

const setUserSessionStorage = tokenObject => sessionStorage.setItem('user', JSON.stringify(tokenObject))
