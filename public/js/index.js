/**
 * JAVASCRIPT BUNDLING
 *
 * index.js : entry file for I/O ops
 * ES6 modules : alerts, login, mapbox
 */
import "core-js/stable";
import "regenerator-runtime/runtime";

import { displayMap } from "./mapbox";
import { login, logout } from "./login";
import { requestBooking } from "./stripe";
import { updateSettings } from "./updateUser";
///////////////////////////////////////////////////////////////

/** DOM elements */
const _map = document.getElementById("map");
const _login = document.querySelector(".form--login");
const _logout = document.querySelector(".nav__el-logout");
const _accountSettings = document.querySelector(".form-user-data");
const _passwordSettings = document.querySelector(".form-user-password");
const _bookingBtn = document.getElementById("book-tour");
///////////////////////////////////////////////////////////////

/** delegations */
if (_login)
  _login.addEventListener("submit", (e) => {
    e.preventDefault();
    const _email = document.getElementById("email").value;
    const _password = document.getElementById("password").value;
    login(_email, _password);
  });

if (_logout) _logout.addEventListener("click", logout);

if (_map) displayMap(JSON.parse(_map.dataset.locations));

if (_accountSettings)
  _accountSettings.addEventListener("submit", (e) => {
    e.preventDefault();

    const _form = new FormData();
    _form.append("name", document.getElementById("name").value);
    _form.append("email", document.getElementById("email").value);
    _form.append("photo", document.getElementById("photo").files[0]);

    updateSettings(_form);
  });

if (_passwordSettings)
  _passwordSettings.addEventListener("submit", async (e) => {
    e.preventDefault();

    document.querySelector(".btn--password").textContent = "Updating...";

    const _form = new FormData();
    _form.append(
      "passwordCurrent",
      document.getElementById("password-current").value
    );
    _form.append("password", document.getElementById("password").value);
    _form.append(
      "passwordConfirm",
      document.getElementById("password-confirm").value
    );
    await updateSettings(_form, "password");

    document.querySelector(".btn--password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });

if (_bookingBtn)
  _bookingBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    requestBooking(e.target.dataset.tourId);
  });
