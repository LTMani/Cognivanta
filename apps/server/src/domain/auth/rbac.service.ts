/**
 * ============================================================================
 * COGNIVANTA RBAC & POLICY ENGINE
 * ============================================================================
 */

import { UserRole, ROLE_PERMISSIONS, AuthorizationError } from '@cognivanta/core';

export class RBACService {
  public static hasPermission(role: UserRole, requiredPermission: string): boolean {
    const permissions = ROLE_PERMISSIONS[role] || [];
    if (permissions.includes('*')) return true;

    if (permissions.includes(requiredPermission)) return true;

    // Check wildcard namespace (e.g. "workspace:*" covers "workspace:create")
    const [namespace] = requiredPermission.split(':');
    if (permissions.includes(`${namespace}:*`)) return true;

    return false;
  }

  public static requirePermission(role: UserRole, requiredPermission: string): void {
    if (!this.hasPermission(role, requiredPermission)) {
      throw new AuthorizationError(
        `Access denied. Role "${role}" does not have required permission "${requiredPermission}".`
      );
    }
  }
}
