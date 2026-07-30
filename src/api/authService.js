export const login = async () => {
  localStorage.setItem("token", "dummy-token");
  return true;
};

export const logout = () => {
  localStorage.removeItem("token");
};
