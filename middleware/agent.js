export default function ({ store, redirect, app }) {
  if (store.$auth.loggedIn === false || store.$auth.user.type !== "agent" ) {
    redirect(app.localePath("/agent/login"));
  }
}
