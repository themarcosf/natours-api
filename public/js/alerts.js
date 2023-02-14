/** @param {String} type : success or error */
export const displayAlert = function (type, msg) {
  hideAlert();

  document
    .querySelector("body")
    .insertAdjacentHTML(
      "afterbegin",
      `<div class="alert alert--${type}">${msg}</div>`
    );

  window.setTimeout(hideAlert, 5000);
};

export const hideAlert = function () {
  const _el = document.querySelector(".alert");
  if (_el) _el.parentElement.removeChild(_el);
};
