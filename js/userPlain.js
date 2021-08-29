const userData = JSON.parse(sessionStorage.getItem('user'));

const baseUrl = 'http://localhost:3000/api/v1/';

let planosContratados = {
  "categoria": {
    telasContratadas: 1,
    Pagemtno: 'debito',
    expiracao: new Date()
  }
};

const CategoriaField = document.getElementById('Categoria');
document.addEventListener('DOMContentLoaded', () => {
  fetch(`${baseUrl}categoria_filme/getAll`)
    .then(res => {
      if (res.status >= 400 && res.status < 600) {
        throw new Error("Bad res from server");
      }
      return res.json();
    })
    .then(res => {
      res.forEach(category => {
        const categoryOption = document.createElement('option');
        categoryOption.value = category;
        categoryOption.innerText = category;
    
        CategoriaField.appendChild(categoryOption);
      });

      fetch(`${baseUrl}plano/get/${userData.inscricao}`)
        .then(plains => {
          if (plains.status >= 400 && plains.status < 600) {
            throw new Error("Bad res from server");
          }
          return plains.json();
        })
        .then(plains => {
          plains.forEach(plano => {
            planosContratados[plano.categoria] = plano;
            attPlainData(res[0]);
          })
        });
    })
    .catch(res => {
      alert('Houve um erro');
      console.log(res);
    });
});

const PagamentoField = document.getElementById('Pagamento');
const ScreensField = document.getElementById('Screens');
const ExpiracaoField = document.getElementById('Expiracao');

const screensOnChanged = () => {
  const { value } = ScreensField;
  
  if(currentPlain) {
    ConfirmPlain.disabled = false;
    if(value <= 0) ConfirmPlain.innerText = 'Deletar';
    else ConfirmPlain.innerText = 'Atualizar';
  }
  else {
    ConfirmPlain.disabled = value <= 0;
    ConfirmPlain.innerText = 'Contratar';
  }
};

ScreensField.onchange = screensOnChanged;

let currentPlain;

const attPlainData = (categoria) => {
  currentPlain = planosContratados[categoria];

  if(currentPlain){
    ExpiracaoField.value = currentPlain.expiracao;

    const { options } = PagamentoField;
    for (let j = 0; j < options.length; j++) {
      const opt = options[j];
      
      if (opt.value === currentPlain.pagamento) {
          PagamentoField.selectedIndex = j;
          break;
      }
    }

    ScreensField.value = currentPlain.nTelas;
    ConfirmPlain.innerText = 'Atualizar';
  } else {
    ScreensField.value = 0;
    PagamentoField.selectedIndex = 0;
    ExpiracaoField.value = null;
    ConfirmPlain.innerText = 'Contratar';
  }
}

const UpdatedForm = document.getElementById('UpdatedForm');

const ConfirmPlain = document.getElementById('ConfirmPlain');

UpdatedForm.onsubmit = (e) => {
  e.preventDefault();

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const body = JSON.stringify({
    inscricao: userData.inscricao,
    categoria: CategoriaField.value,
    n_telas: ScreensField.value,
    pagamento: PagamentoField.value,
    expiracao: ExpiracaoField.value
  });

  let method, apiPath;

  switch(ConfirmPlain.innerText) {
    case 'Atualizar':
      method = 'PUT';
      apiPath = 'atualizar';
      break;
    case 'Contratar':
      method = 'POST';
      apiPath = 'novo';
      break;
    case 'Deletar':
      method = 'DELETE';
      apiPath = `deletar/${userData.inscricao}/${CategoriaField.value}`;
      break;
  }

  fetch(`${baseUrl}plano/${apiPath}`, {
    method,
    headers,
    body
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

CategoriaField.onchange = (e) => {
  attPlainData(e.target.value);
  screensOnChanged();
};
