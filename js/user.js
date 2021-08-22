const env = {
  url: 'http://127.0.0.1:5500'
}

if (sessionStorage.getItem('user')) window.location = `${env.url}`

const forms = {
  user: '',
  pass: ''
};

const userField = document.getElementById('User');
userField.onchange = ({ target }) => forms.user = target.value;

const passField = document.getElementById('Pass');
passField.onchange = ({ target }) => forms.pass = target.value;

const form = document.getElementById('user-form');
form.onsubmit = (event) => {
  const userData = {
    inscricao: '',
    email: '',
    nome: '',
    login: ''
  };

  switch (event.submitter.name) {
    // TODO implementar chamada na API pra retornar os dados
    case 'Login':
      console.log('Tentando entrar...');
      break;
    case 'Register':
      console.log('Tentando cadastrar...');
      break;
    default:
      console.log('Inesperado');
      break;
  }

  sessionStorage.setItem('user', JSON.stringify(userData));
}
