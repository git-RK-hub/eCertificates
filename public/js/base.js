/* eslint-disable */
export const elements = {
  logoutBtn: document.getElementById('logout-head'),
  signinBtn: document.getElementById('sign-button'),
  loginBtn: document.getElementById('login-button'),
  loginHead: document.getElementById('login-head'),
  signupHead: document.getElementById('signup-head'),
  loginSection: document.querySelector('.login-section'),
  signupSection: document.querySelector('.signup-section'),
  signupForm: document.querySelector('.signupform'),
  loginForm: document.querySelector('.loginform'),
  uploadCertificate: document.querySelector('.uploadCerti'),
  uploadForm: document.getElementById('uploadForm'),
  downloadCerti: document.querySelector('.p8')
};

export const renderLoader = (parent) => {
  const markup = `
            <div class="spinner-grow text-danger" role="status">
              <span class="sr-only">Loading...</span>
            </div>
  `;
  parent.insertAdjacentHTML('afterbegin', markup);
};

export const clearLoader = () => {
  const loader = document.querySelector('.spinner-grow');
  if (loader) loader.parentNode.removeChild(loader);
};

export const removeFormHtml = () => {
  elements.signupCard.style.removeProperty('background-image');
  document.querySelector('.addTwoMore').style.display = 'none';
};

export const addFormHtml = () => {
  elements.signupCard.style.backgroundImage = `url('/img/signup-card-bg-d.jpg')`;
  document.querySelector('.addTwoMore').style.display = 'block';
};
