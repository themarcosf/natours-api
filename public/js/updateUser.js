import axios from "axios";
import { displayAlert } from "./alerts";

/** type: data OR password */
export const updateSettings = async function (data, type) {
  try {
    const _url = type === "password" ? "updatePassword" : "currentUser";

    const _res = await axios({
      method: "PATCH",
      url: `/api/v1/users/${_url}`,
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
