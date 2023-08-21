import { getServerSession } from '@roq/nextjs';
import { NextApiRequest } from 'next';
import { NotificationService } from 'server/services/notification.service';
import { convertMethodToOperation, convertRouteToEntityUtil, HttpMethod, generateFilterByPathUtil } from 'server/utils';
import { prisma } from 'server/db';

interface NotificationConfigInterface {
  roles: string[];
  key: string;
  tenantPath: string[];
  userPath: string[];
}

const notificationMapping: Record<string, NotificationConfigInterface> = {
  'project.create': {
    roles: ['project-owner', 'team-leader', 'team-member'],
    key: 'project-created',
    tenantPath: ['project_manager', 'project'],
    userPath: [],
  },
  'project.update': {
    roles: ['project-owner', 'team-leader', 'team-member'],
    key: 'project-updated',
    tenantPath: ['project_manager', 'project'],
    userPath: [],
  },
  'project.delete': {
    roles: ['project-owner', 'team-leader', 'team-member'],
    key: 'project-deleted',
    tenantPath: ['project_manager', 'project'],
    userPath: [],
  },
  'task.create': {
    roles: ['project-owner', 'team-leader', 'team-member'],
    key: 'task-created',
    tenantPath: ['project_manager', 'project', 'task'],
    userPath: [],
  },
  'task.update': {
    roles: ['project-owner', 'team-leader', 'team-member'],
    key: 'task-updated',
    tenantPath: ['project_manager', 'project', 'task'],
    userPath: [],
  },
  'task.delete': {
    roles: ['project-owner', 'team-leader', 'team-member'],
    key: 'task-deleted',
    tenantPath: ['project_manager', 'project', 'task'],
    userPath: [],
  },
  'team.create': {
    roles: ['project-owner', 'team-leader', 'team-member'],
    key: 'team-created',
    tenantPath: ['project_manager', 'project', 'team'],
    userPath: [],
  },
  'team.update': {
    roles: ['project-owner', 'team-leader', 'team-member'],
    key: 'team-updated',
    tenantPath: ['project_manager', 'project', 'team'],
    userPath: [],
  },
  'team.delete': {
    roles: ['project-owner', 'team-leader', 'team-member'],
    key: 'team-deleted',
    tenantPath: ['project_manager', 'project', 'team'],
    userPath: [],
  },
};

const ownerRoles: string[] = ['project-manager'];
const customerRoles: string[] = ['guest'];
const tenantRoles: string[] = ['project-owner', 'team-leader', 'team-member'];

const allTenantRoles = tenantRoles.concat(ownerRoles);
export async function notificationHandlerMiddleware(req: NextApiRequest, entityId: string) {
  const session = getServerSession(req);
  const { roqUserId } = session;
  // get the entity based on the request url
  let [mainPath] = req.url.split('?');
  mainPath = mainPath.trim().split('/').filter(Boolean)[1];
  const entity = convertRouteToEntityUtil(mainPath);
  // get the operation based on request method
  const operation = convertMethodToOperation(req.method as HttpMethod);
  const notificationConfig = notificationMapping[`${entity}.${operation}`];

  if (!notificationConfig || notificationConfig.roles.length === 0 || !notificationConfig.tenantPath?.length) {
    return;
  }

  const { tenantPath, key, roles, userPath } = notificationConfig;

  const tenant = await prisma.project_manager.findFirst({
    where: generateFilterByPathUtil(tenantPath, entityId),
  });

  if (!tenant) {
    return;
  }
  const sendToTenant = () => {
    console.log('sending notification to tenant', {
      notificationConfig,
      roqUserId,
      tenant,
    });
    return NotificationService.sendNotificationToRoles(key, roles, roqUserId, tenant.tenant_id);
  };
  const sendToCustomer = async () => {
    if (!userPath.length) {
      return;
    }
    const user = await prisma.user.findFirst({
      where: generateFilterByPathUtil(userPath, entityId),
    });
    console.log('sending notification to user', {
      notificationConfig,
      user,
    });
    await NotificationService.sendNotificationToUser(key, user.roq_user_id);
  };

  if (roles.every((role) => allTenantRoles.includes(role))) {
    // check if only  tenantRoles + ownerRoles
    await sendToTenant();
  } else if (roles.every((role) => customerRoles.includes(role))) {
    // check if only customer role
    await sendToCustomer();
  } else {
    // both company and user receives
    await Promise.all([sendToTenant(), sendToCustomer()]);
  }
}
