import useFlashMessage from "../../../../hooks/useFlashMessage";
import api from "../../../../utils/api";


export const updatePet = async (petData, id) => {
  const { setFlashMessage } = useFlashMessage();
  const token = localStorage.getItem("token") || ""; 


    let msgType = "success";
    const formData = new FormData();
    const petFormData = Object.keys(petData).forEach((key) => {
      if (key === "images") {
        for (let i = 0; i < petData[key].length; i++) {
          formData.append(`images`, petData[key][i]);
        } 
      } else {
        formData.append(key, petData[key]);
      }
    });

    formData.append("pet", petFormData);

    const data = await api
      .patch(`pets/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {

        window.location.reload()
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        msgType = "error";
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
  };