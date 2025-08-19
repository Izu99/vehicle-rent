import { Request, Response, NextFunction } from 'express';

export function requireRole(role: string | string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;
    
    if (!userRole) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const allowedRoles = Array.isArray(role) ? role : [role];
    
    if (allowedRoles.includes(userRole)) {
      return next();
    }
    
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  };
}

// Specific role middleware functions
export const requireAdmin = requireRole('admin');
export const requireRentCompany = requireRole(['admin', 'rental-company']);
export const requireCustomer = requireRole(['admin', 'customer']);
