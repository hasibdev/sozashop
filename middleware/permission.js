export default function ({ store, route, redirect, error }) {
  // Roles
  const roles = store.$auth.user.roles;
  // meta
  const meta = route.meta.find(m => m.hasOwnProperty("permission"));
  // Admin
  const isAdmin = roles.some(r => (r.name === "Super Admin" || r.name === "Admin"));


  // Check Permission for Admin Role
  if (!isAdmin) {
    // Check permissions for any Role
    if (meta?.permission) {
      // Avilable Permissions
      const permissions = roles.reduce((acc, role) => {
        for (const p of role.permissions) {
          acc.push(p.name);
        }
        return acc;
      }, []);

      // Check permission
      if (!permissions.includes(meta.permission)) {
        error({
          statusCode: 403,
          message: "You Are Not Authorized to view this Page"
        });
      }
    }
  }
}
