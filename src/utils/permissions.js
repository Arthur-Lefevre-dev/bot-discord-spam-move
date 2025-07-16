/**
 * Check if a member has admin permissions (Administrator, specific role, or is server owner)
 * @param {GuildMember} member - The Discord guild member
 * @param {string} adminRoleId - The admin role ID (optional)
 * @returns {boolean}
 */
function hasAdminPermission(member, adminRoleId) {
  // Check if user has Administrator permission
  if (member.permissions.has("Administrator")) return true;
  // Check if user has the specific admin role (if configured)
  if (adminRoleId && member.roles.cache.has(adminRoleId)) return true;
  // Check if user is the server owner
  if (member.id === member.guild.ownerId) return true;
  return false;
}

module.exports = { hasAdminPermission };
