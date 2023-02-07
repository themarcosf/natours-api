/**
 * JAVASCRIPT BUNDLING
 *
 * index.js : entry file for I/O ops
 * ES6 modules : alerts, login, mapbox
 */
import "core-js/stable";
import "regenerator-runtime/runtime";
import { login, logout } from "./login";
import { updateSettings } from "./updateUser";
import { displayMap } from "./mapbox";
///////////////////////////////////////////////////////////////

/** DOM elements */
const _map = document.getElementById("map");
const _login = document.querySelector(".form--login");
const _logout = document.querySelector(".nav__el-logout");
const _accountSettings = document.querySelector(".form-user-data");
const _passwordSettings = document.querySelector(".form-user-password");
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

if (_accountSettings) {
  _accountSettings.addEventListener("submit", (e) => {
    e.preventDefault();
    const _name = document.getElementById("name").value;
    const _email = document.getElementById("email").value;
    updateSettings({ name: _name, email: _email });
  });
}

if (_passwordSettings) {
  _passwordSettings.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--password").textContent = "Updating...";

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );

    document.querySelector(".btn--password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}
