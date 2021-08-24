const userData = JSON.parse(sessionStorage.getItem('user'));

const baseUrl = 'http://localhost:3000/api/v1/';

const CategoriaField = document.getElementById('Categoria');
document.addEventListener('DOMContentLoaded', () => {
  fetch(`${baseUrl}/categoria/getAll`)
    .then(res => {
      if (res.status >= 400 && res.status < 600) {
        throw new Error("Bad res from server");
      }
      return res.json();
    })
    .then(res => res.forEach(category => {
      const categoryOption = document.createElement('option');
      categoryOption.value = category;
      categoryOption.innerText = category;
  
      CategoriaField.appendChild(categoryOption);
    }))
    .catch(res => console.log(res));
});

// FIXME delete this
['test','test_2','brabo'].forEach(category => {
  const categoryOption = document.createElement('option');
  categoryOption.value = category;
  categoryOption.innerText = category;

  CategoriaField.appendChild(categoryOption);
});

const PagamentoField = document.getElementById('Pagamento');
document.addEventListener('DOMContentLoaded', () => {
  fetch(`${baseUrl}/pagamento/getAll`)
    .then(res => {
      if (res.status >= 400 && res.status < 600) {
        throw new Error("Bad res from server");
      }
      return res.json();
    })
    .then(res => res.forEach(payment => {
      const paymentOption = document.createElement('option');
      paymentOption.value = payment;
      paymentOption.innerText = payment;
  
      PagamentoField.appendChild(paymentOption);
    }))
    .catch(res => console.log(res));
});

// FIXME delete this
['pay_1','pay_2'].forEach(payment => {
  const paymentOption = document.createElement('option');
  paymentOption.value = payment;
  paymentOption.innerText = payment;

  PagamentoField.appendChild(paymentOption);
});

const ScreensField = document.getElementById('Screens');
const ExpiracaoField = document.getElementById('Expiracao');
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

  if(ConfirmPlain.innerText === 'Atualizar') fetch(`${baseUrl}plano/atualizar`, {
    method: 'PUT',
    headers,
    body
  })
  .then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error("Bad res from server");
    }
  })
  .catch(res => console.log(res));
  else fetch(`${baseUrl}plano/novo`, {
    method: 'POST',
    headers,
    body
  })
  .then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error("Bad res from server");
    };
  })
  .catch(res => console.log(res));

}

const DeletePlain = document.getElementById('DeletePlain');
DeletePlain.onclick = () => {
  fetch(`${baseUrl}plano/deletar/${userData.inscricao}/${CategoriaField.value}`, {
    method: 'DELETE'
  })
  .then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error("Bad res from server");
    }
    return res.json();
  })
  .then(() => window.location.reload())
  .catch(res => console.log(res));
}

const loadData = () => {
  fetch(`${baseUrl}plano/get/${userData.inscricao}/${CategoriaField.value}`)
  .then(res => {
    const { status } = res;
    if (status >= 400 && status < 600 && status != 404) {
      throw new Error("Bad res from server");
    }

    // FIXME change this
    // return res.json();
    return null;
  })
  .then(res => {
    console.log('res', res);
    // FIXME conferir como validar esse obj
    if (res !== null) {
      ScreensField.value = res.n_telas;
      ExpiracaoField.value = res.expiracao;
      PagamentoField.value = res.pagamento;
      DeletePlain.style.display = 'unset';
      ConfirmPlain.innerText = 'Atualizar';
    } else {
      ScreensField.value = 0;
      ExpiracaoField.value = null;
      PagamentoField.value = null;
      DeletePlain.style.display = 'none';
      ConfirmPlain.innerText = 'Criar';
    }
  })
  .catch(res => console.log(res));
};

CategoriaField.onchange = loadData;
document.addEventListener('DOMContentLoaded', loadData);
