export default {
  computed: {
    /**
     * Get the actionable ids
     */
    actionable() {
      const rows = this.laravelData.data.filter(row => {
        return this.checkedList.includes(row.id) && row.deletedAt === null
      })

      return rows.map(row => row.id);
    },

    /**
     * Get the restoreable ids
     */
    restorable() {
      const rows = this.laravelData.data.filter(row => {
        return this.checkedList.includes(row.id) && row.deletedAt !== null
      })

      return rows.map(row => row.id);
    }

  },

  methods: {
    /**
     * Delete items from list
     */
    remove(id, index) {
      this.$swal
        .fire({
          title: "Are you sure want to delete?",
          icon: "warning",
          confirmButtonColor: "var(--danger)",
          cancelButtonColor: "var(--primary)",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await this.$axios.delete(`${this.url}/` + id);

              this.laravelData.data.splice(index, 1);
              this.$toast.success("Deleted successfully");
            } catch (error) {
              const message = { ...error }.response.data.message
              this.$toast.error(message, { timeout: 8000 });
            }
          }
        });
    },

    /**
     * Delete all selected resources
     */
    removeAll() {
      this.$swal
        .fire({
          title: "Are you sure want to delete?",
          icon: "warning",
          confirmButtonColor: "var(--danger)",
          cancelButtonColor: "var(--primary)",
          showCancelButton: true,
          confirmButtonText: "Yes, delete all!",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await this.$axios.post(`${this.url}/delete-all`, {
                ids: this.checkedList
              });

              this.getResults();
              this.$toast.success("Deleted successfully");
            } catch (error) {
              this.$toast.error("Delete Fail!");
              console.log(error);
            }
          }
        });
    },

    /**
     * Restore the resource
     */
    restore(id, index) {
      this.$swal
        .fire({
          title: "Are you sure want to restore?",
          // text: "You won't be able to revert this!",
          icon: "info",
          confirmButtonColor: "var(--primary)",
          cancelButtonColor: "var(--danger)",
          showCancelButton: true,
          confirmButtonText: "Yes, restore it!",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await this.$axios.post(`${this.url}/${id}/restore`);
              this.laravelData.data.splice(index, 1, res.data.data);
              this.$toast.success("Restored successfully");
            } catch (error) {
              this.$toast.error("Something went wrong");
              console.log(error);
            }
          }
        });
    },

    /**
     * Restore all selected resources
     */
    restoreAll() {
      this.$swal
        .fire({
          title: "Are you sure want to restore all?",
          icon: "info",
          confirmButtonColor: "var(--primary)",
          cancelButtonColor: "var(--danger)",
          showCancelButton: true,
          confirmButtonText: "Yes, restore all!",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await this.$axios.post(`${this.url}/restore-all`, {
                ids: this.restorable
              });

              this.getResults();
              this.$toast.success("Restored successfully");
            } catch (error) {
              this.$toast.error("Restore Failed!");
              console.log(error);
            }
          }
        });
    },

    /**
     * Force delete the resource
     */
    forceDelete(id, index) {
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
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await this.$axios.delete(`${this.url}/${id}/force-delete`);

              this.laravelData.data.splice(index, 1);
              this.$toast.success("Deleted successfully");
            } catch (error) {
              this.$toast.error("Delete Fail!");
              console.log(error);
            }
          }
        });
    },

    /**
     * Force delete all the selected resources
     */
    forceDeleteAll() {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          confirmButtonColor: "var(--danger)",
          cancelButtonColor: "var(--primary)",
          showCancelButton: true,
          confirmButtonText: "Yes, delete all!",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await this.$axios.post(`${this.url}/force-delete-all`, {
                ids: this.checkedList
              });

              this.getResults();
              this.$toast.success("Deleted successfully");
            } catch (error) {
              this.$toast.error("Delete Failed!");
              console.log(error);
            }
          }
        });
    },

    /**
     * Check the table has bulk action slot
     */
    hasBulkActionSlot() {
      return !!this.$slots['bulk-action']
    }

  }
}
