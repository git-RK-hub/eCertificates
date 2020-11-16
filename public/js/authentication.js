/* eslint-disable */
import axios from 'axios';
axios.defaults.withCredentials = true;

export const signup = async (obj) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://localhost:80/api/v1/user/signup`,
      data: obj
    });
    if (res.data.status === 'success') {
      alert('signup');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    alert(err);
  }
};

export const login = async (obj) => {
  try {
    console.log(obj);
    const res = await axios({
      method: 'POST',
      url: `http://localhost:80/api/v1/user/login`,
      data: obj
    });
    if (res.data.status === 'success') {
      alert('login');
      window.setTimeout(() => {
        location.assign(`http://localhost:80/`);
      }, 1000);
    }
  } catch (err) {
    // showAlert('error', err.response.data.message);
    alert(err);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:80/api/v1/user/logout'
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response);
  }
};
