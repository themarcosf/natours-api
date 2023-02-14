import axios from "axios";
import { displayAlert } from "./alerts";

export const login = async function (email, password) {
  try {
    const _res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
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
      url: "/api/v1/users/logout",
    });

    if (_res.data.status === "success") {
      displayAlert("success", "Log out successful!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    displayAlert("error", "Error logging out. Retry!");
  }
};
