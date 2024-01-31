// registerPet.js
import useFlashMessage from "../../../../hooks/useFlashMessage";
import api from "../../../../utils/api";



export async function registerPet(pet, navigate) {

  const { setFlashMessage } = useFlashMessage();
  const token = localStorage.getItem("token") || ""; 
  let msgType = "success";
  const formData = new FormData();
  
  await Object.keys(pet).forEach((key) => {
    if (key === "images") {
      for (let i = 0; i < pet[key].length; i++) {
        formData.append("images", pet[key][i]);
      }
    } else {
      formData.append(key, pet[key]);
    }
  });

  try {
    const response = await api.post("pets/create", formData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data);
    setFlashMessage(response.data.message, msgType);
    
    if (msgType !== "error") {
      navigate("/pet/mypets");
    }

    return response.data;
  } catch (err) {
    msgType = "error";
    setFlashMessage(err.response.data.message, msgType);
    throw err;
  }
}
