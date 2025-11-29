import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { logger } from '../utils/logger';

interface AuditLogParams {
  userId: string;
  action: string;
  tableName: string;
  recordId: string;
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
}

export const auditLog = async (
  params: AuditLogParams
): Promise<void> => {
  try {
    const ipAddress = params.userId ? '0.0.0.0' : 'unknown';
    const userAgent = 'unknown';

    const sql = `
      INSERT INTO audit_logs (id, user_id, action, table_name, record_id, old_data, new_data, timestamp, ip_address, user_agent)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), $7, $8)
    `;

    await query(sql, [
      params.userId,
      params.action,
      params.tableName,
      params.recordId,
      params.oldData ? JSON.stringify(params.oldData) : null,
      params.newData ? JSON.stringify(params.newData) : null,
      ipAddress,
      userAgent,
    ]);

    logger.debug('Audit log created', { ...params });
  } catch (error) {
    logger.error('Failed to create audit log', { error: String(error) });
  }
};

export const auditLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Store original send function
  const originalSend = res.send;

  // Override send to capture response data
  res.send = function (data: any) {
    // Log the request if it's a state-changing operation
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.user) {
      const auditData: AuditLogParams = {
        userId: req.user.userId,
        action: req.method,
        tableName: req.path.split('/')[2] || 'unknown',
        recordId: req.params.id || 'unknown',
        newData: req.body,
      };

      auditLog(auditData).catch((err) => {
        logger.error('Audit logging error', { error: String(err) });
      });
    }

    return originalSend.call(this, data);
  };

  next();
};
