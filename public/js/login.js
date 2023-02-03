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
