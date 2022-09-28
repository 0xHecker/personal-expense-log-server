const requireAuth = (req: any, res: any, next: () => void) => {
  if (req?.session?.userId) next();
  else res.status(401).json({ authenticated: false });
};

export default requireAuth;
