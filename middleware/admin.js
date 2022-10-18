export default function({ store, redirect, app }) {
  if (store.$auth.loggedIn === false || store.$auth.user.type !== "admin") {
    redirect(app.localePath("/admin/login"));
  }
}
