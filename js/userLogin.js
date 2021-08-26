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
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const baseUrl = 'http://localhost:3000/api/v1/';

  switch (event.submitter.name) {
    // TODO implementar chamada na API pra retornar os dados
    case 'Login':
      fetch(`${baseUrl}usuario/login`, {
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
      .then(res => setUserSessionStorage(res))
      .catch(res => console.log(res));

      break;
    case 'Register':
      // fetch(`${baseUrl}usuario/novo`, {
      //   method: 'POST',
      //   headers,
      //   body: JSON.stringify(forms)
      // })
      // .then(res => {
      //   if (res.status >= 400 && res.status < 600) {
      //     throw new Error("Bad res from server");
      //   }
      //   return res.json();
      // })
      // .then(res => setUserSessionStorage(res))
      // .catch(res => console.log(res));

      // FIXME remove this
      setUserSessionStorage({inscricao: '123', email: 'email_test', nome: 'nomeTest', login: 'loginTest'});

      break;
    default:
      console.log('Inesperado');
      break;
  }
}

const setUserSessionStorage = tokenObject => sessionStorage.setItem('user', JSON.stringify(tokenObject))
