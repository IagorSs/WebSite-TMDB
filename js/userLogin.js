if (sessionStorage.getItem('user')) window.location.replace(`/`);

const forms = {
  userOrEmail: '',
  password: ''
};

const userLabel = document.getElementById('UserLabel');

const submitButton = document.getElementById('SubmitButton');

const isRegister = document.getElementById('EnableRegister');
isRegister.onchange = ({ target }) => {
  userLabel.innerText = target.checked ? 'Email':'Login';
  submitButton.innerText = target.checked ? 'Cadastrar':'Entrar';
}

const userField = document.getElementById('User');
userField.onchange = ({ target }) => forms.userOrEmail = target.value;

const passField = document.getElementById('Pass');
passField.onchange = ({ target }) => forms.password = target.value

const form = document.getElementById('user-form');
form.onsubmit = (event) => {
  event.preventDefault();

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const baseUrl = 'https://api-tp-bd.herokuapp.com/api/v1/';

  const apiPath = isRegister.checked ? 'novo':'login';

  const body = isRegister.checked
  ? {
    email: forms.userOrEmail,
    senha: forms.password
  }
  : {
    login: forms.userOrEmail,
    senha: forms.password
  }

  fetch(`${baseUrl}usuario/${apiPath}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
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
