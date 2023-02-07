import axios from "axios";
import { displayAlert } from "./alerts";

/** type: data OR password */
export const updateSettings = async function (data, type) {
  try {
    const _url = type === "password" ? "updatePassword" : "currentUser";

    const _res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:8000/api/v1/users/${_url}`,
      data,
      withCredentials: true,
    });

    if (_res.data.status === "success") {
      displayAlert("success", "Update successful!");
    }
  } catch (err) {
    displayAlert("error", err.response.data.message);
  }
};
