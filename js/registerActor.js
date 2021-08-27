const form = {
  name: '',
  birthday: ''
}

const nameField = document.getElementById('Name');
nameField.onchange = ({target}) => form.name = target.value;

const birthdayField = document.getElementById('Birthday');
birthdayField.onchange = ({target}) => form.birthday = target.value;

const formTag = document.getElementById('UpdatedForm');
formTag.onsubmit = (e) => {
  e.preventDefault();
  // TODO submeter form
  console.log(form);
}
