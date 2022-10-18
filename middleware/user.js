export default function({ store, redirect, app }) {
  if (store.$auth.loggedIn == false || store.$auth.user.type !== "user") {
    redirect(app.localePath("/login"));
  }
}
