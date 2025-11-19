export const redirectDest = (role: string | undefined) => {
  switch (role) {
    case "patient":
      return "/patients";
    case "doctor":
      return "/doctors";
    case "admin":
      return "/admin";
    case "nurse":
      return "/nurses";
    default:
      return "/sign-in";
  }
};
