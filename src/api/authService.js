import api from "./api";

export const sendOtp = async (phoneNumber, name) => {
  const { data } = await api.post("/whatsapp-auth/send-otp", {
    phone_number: phoneNumber,
    name: name,
  });

  return data;
};

export const verifyOtp = async (phoneNumber, otp) => {
  const { data } = await api.post("/whatsapp-auth/verify-otp", {
    phone_number: phoneNumber,
    otp,
  });

  localStorage.setItem("token", `whatsapp:${data.id}`);
  localStorage.setItem("whatsapp_user", JSON.stringify(data));

  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("whatsapp_user");
};

export const checkPhone = async (phoneNumber) => {
  const { data } = await api.post("/whatsapp-auth/check-phone", {
    phone_number: phoneNumber,
  });

  return data;
};
