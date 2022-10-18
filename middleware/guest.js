export default function ({ store, redirect, app }) {
  if (store.$auth.loggedIn == true) {
    if (store.$auth.user.type == "user")
      redirect(app.localePath("/dashboard"));

    if (store.$auth.user.type == "admin")
      redirect(app.localePath("/admin"));

    if (store.$auth.user.type == "agent")
      redirect(app.localePath("/agent"));
  } 
}
