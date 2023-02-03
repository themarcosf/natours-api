import axios from "axios";
import { displayAlert } from "./alerts";

export const login = async function (email, password) {
  try {
    const _res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/login",
      data: { email, password },
      withCredentials: true,
    });

    if (_res.data.status === "success") {
      displayAlert("success", "Log in successful!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    displayAlert("error", err.response.data.message);
  }
};

export const logout = async function () {
  try {
    const _res = await axios({
      method: "GET",
      url: "http://127.0.0.1:8000/api/v1/users/logout",
    });
    console.log(_res);

    /**
     * @dev location.reload(bool)
     * true : force reload from server
     * false : reload from cache
     */
    if (_res.data.status === "success") location.reload(true);
  } catch (err) {
    displayAlert("error", "Error logging out. Retry!");
  }
};
