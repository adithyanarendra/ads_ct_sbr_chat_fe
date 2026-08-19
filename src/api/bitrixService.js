import api from "./api";

export const makeLeadHot = async (leadId, callbackDate, callbackTime) => {
  const { data } = await api.post("/bitrix/lead/hot", {
    lead_id: leadId,
    callback_date: callbackDate,
    callback_time: callbackTime,
  });

  return data;
};
