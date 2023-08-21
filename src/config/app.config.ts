interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Project Manager'],
  customerRoles: ['Guest'],
  tenantRoles: ['Project Owner', 'Team Leader', 'Team Member'],
  tenantName: 'Project Manager',
  applicationName: 'TTSZ Project Management Tool',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
};
