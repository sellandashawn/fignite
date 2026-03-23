export const decodeToken = (token) => {
  try {
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid token format");
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 <= Date.now();
};

export const isAdminFromToken = (token) => {
  const decoded = decodeToken(token);
  if (decoded?.userType !== "admin") return false;
  if (isTokenExpired(token)) return false;
  return true;
};

export const getUserTypeFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded?.userType;
};
