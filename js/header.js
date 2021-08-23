const profileIcon = document.getElementById('user-profile');

const menuProfile = document.getElementById('menu-drop');

profileIcon.onclick = () => menuProfile.style.display === 'none' ? menuProfile.style.display = 'unset':menuProfile.style.display = 'none';

const myProfile = document.getElementById('MyProfile');
myProfile.onclick = () => window.location.replace('/pages/user.html');

const logOut = document.getElementById('LogOut');
logOut.onclick = () => {
  sessionStorage.removeItem('user');
  document.location.reload();
}