/* eslint-disable*/

import '@babel/polyfill';
import axios from 'axios';
import { elements, renderLoader, addFormHtml, removeFormHtml } from './base';
import { signup, login, logout } from './authentication';

const saveDocument = async (obj) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://localhost:80/api/v1/user/saveDocument`,
      data: obj,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (res.data.status === 'success') {
      alert('Uploaded');
      window.setTimeout(() => {
        location.assign(`/`);
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
};

const uploadCerti = async (obj) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://localhost:80/api/v1/admin/encrypt`,
      data: obj,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (res.data.status === 'success') {
      alert('Uploaded');
      window.setTimeout(() => {
        location.assign(`/`);
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
};

if (elements.downloadCerti) {
  elements.downloadCerti.addEventListener('click', async (e) => {
    window.x = e.target;
    const certiName = e.target.textContent;
    const userId = e.target.dataset.userid;
    try {
      const res = await axios({
        method: 'POST',
        url: `http://localhost:80/api/v1/user/decrypt`,
        data: {
          certiName,
          userId
        }
      });
      if (res.status === '200') {
        window.setTimeout(() => {
          location.assign(`http://localhost:80/api/v1/user/decrypt`);
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  });
}

if (elements.savedocForm) {
  elements.savedocForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData();
    const file = document.getElementById('docFile');
    const userId = document.getElementById('saveDoc').dataset.userid;
    formData.append('docName', document.getElementById('docName').value);
    formData.append('userId', userId);
    formData.append('docFile', file.files[0]);
    saveDocument(formData);
  });
}

if (elements.uploadForm) {
  elements.uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData();
    const file = document.getElementById('certificate');
    const userId = document.getElementById('uploadCerti').dataset.userid;
    formData.append('certiname', document.getElementById('certiname').value);
    formData.append('userId', userId);
    formData.append('certificate', file.files[0]);
    for (var key of formData.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }
    uploadCerti(formData);
  });
}

if (elements.signupHead) {
  elements.signupHead.addEventListener('click', (e) => {
    e.preventDefault();
    elements.signupSection.style.display = 'grid';
  });
}

if (elements.loginHead) {
  elements.loginHead.addEventListener('click', (e) => {
    e.preventDefault();
    elements.loginSection.style.display = 'grid';
  });
}

if (elements.signupSection) {
  document.querySelector('.p9').addEventListener('click', (e) => {
    e.preventDefault();
    elements.signupSection.style.display = 'none';
  });
}

if (elements.loginSection) {
  document.querySelector('.p10').addEventListener('click', (e) => {
    e.preventDefault();
    elements.loginSection.style.display = 'none';
  });
}

if (elements.loginForm) {
  const loginObj = {};
  elements.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginObj.email = document.getElementById('login-email').value;
    loginObj.password = document.getElementById('login-password').value;
    login(loginObj);
  });
}

if (elements.signupForm) {
  const signupObj = {};
  elements.signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    signupObj.name = document.getElementById('name').value;
    signupObj.email = document.getElementById('signup-email').value;
    signupObj.password = document.getElementById('signup-password').value;
    signupObj.confirmPassword = document.getElementById(
      'confirmPassword'
    ).value;
    signup(signupObj);
  });
}

if (elements.logoutBtn) {
  elements.logoutBtn.addEventListener('click', (e) => {
    logout();
  });
}
