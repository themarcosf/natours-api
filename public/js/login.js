document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();

  const _email = document.getElementById("email").value;
  const _password = document.getElementById("password").value;

  login(_email, _password);
});

const login = async function (email, password) {
  try {
    const _res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/login",
      data: { email, password },
      withCredentials: true,
    });
    console.log(_res);
  } catch (err) {
    console.log(err.response.data);
  }
};
