/**
 * JAVASCRIPT BUNDLING
 *
 * index.js : entry file for I/O ops
 * ES6 modules : alerts, login, mapbox
 */
import "core-js/stable";
import "regenerator-runtime/runtime";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";
///////////////////////////////////////////////////////////////

/** DOM elements */
const _map = document.getElementById("map");
const _login = document.querySelector(".form");
const _logout = document.querySelector(".nav__el-logout");
///////////////////////////////////////////////////////////////

/** delegations */
if (_login) {
  _login.addEventListener("submit", (e) => {
    e.preventDefault();
    const _email = document.getElementById("email").value;
    const _password = document.getElementById("password").value;
    login(_email, _password);
  });
}

if (_logout) _logout.addEventListener("click", logout);

if (_map) displayMap(JSON.parse(_map.dataset.locations));
