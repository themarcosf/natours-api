export const displayAlert = function (type, msg) {
  hideAlert();

  const _html = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", _html);

  window.setTimeout(hideAlert, 5000);
};

export const hideAlert = function () {
  const _el = document.querySelector(".alert");
  if (_el) _el.parentElement.removeChild(_el);
};
