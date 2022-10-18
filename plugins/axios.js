export default function({ $axios, store, app, error }) {
  $axios.onError(err => {
    if (err.response.status === 422) {
      store.dispatch("validation/setErrors", err.response.data.errors);
      app.$toast.error("Form Submition Error!", {
        timeout: 2000
      });
    }

    // Check unauthorized access
    // if (err.response.status === 403 || err.response.status === 401) {
    //   error({statusCode: err.response.status, message: "Sorry, you are unauthorize."})
    // }
    return Promise.reject(err);
  });


  $axios.onRequest(() => {
    store.dispatch("validation/clearErrors");
  });
}
