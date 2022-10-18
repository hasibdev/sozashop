import Vue from "vue";

Vue.mixin({
  data() {
    return {
      isLoading: true
    };
  },

  methods: {
    /**
     * Formate Date
     */
    formatDate(date) {
      return this.$moment(date).format("DD-MM-yyyy");
    },
    /**
    * Get the base 64 filter string
    */
    getQueries(filters) {
      let queryString = "";
      for (const key in filters) {
        queryString += `&${key}=${filters[key]}`;
      }

      return queryString;
    },
    /**
     * Make the loading state false
     */
    disableLoading() {
      this.isLoading = false;
      console.log(this.isLoading);
    },

    /**
     * File Download
     */
    async fileDownload({ method = "get", url, fileType, fileName }) {
      try {
        const response = await this.$axios({
          method,
          url,
          responseType: "arraybuffer",
        })

        let blob = new Blob([response.data], { type: fileType });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      } catch (error) {
        this.$toast.error('Download Error!')
        console.log(error);
      }
    },

    /**
     * Remove Resource
     */
    async removeResource({
      apiUrl,
      redirectUrl,
      success = "Deleted successfully.",
      fail = "Delete Fail.",

    }) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          confirmButtonColor: "var(--danger)",
          cancelButtonColor: "var(--primary)",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
        })
        .then(async result => {
          if (result.isConfirmed) {
            try {
              await this.$axios.delete(apiUrl);
              this.$toast.success(success);
              // this.$nuxt.$emit("getResults");
              this.$router.push(this.localePath(redirectUrl));
            } catch (error) {
              const message = { ...error }.response.data.message
              this.$toast.error(message, { timeout: 8000 });
            }
          }
        });
    }
  }
});
