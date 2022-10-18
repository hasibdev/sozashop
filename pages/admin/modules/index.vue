<template>
  <!-- Page-content -->
  <div>
    <div class="d-flex justify-content-between">
      <div>
        <input
          class="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
      </div>
      <nuxt-link class="btn btn-primary" to="/admin/modules/create"
        >Add Industry</nuxt-link
      >
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card mt-3 rounded-sm shadow-sm">
          <!-- card header -->
          <div
            class="card-header rounded-top rounded-sm p-3 border-bottom border-gray"
          >
            <div class="d-flex justify-content-between">
              <!-- 1st filter -->
              <div class="d-flex align-items-center cursor-pointer">
                <input type="checkbox" name="" id="" autocomplete="off" />
                <i class="fas fa-angle-down ml-2"></i>
              </div>

              <!-- 2nd filter -->
              <div class="d-flex align-items-center cursor-pointer text-gray">
                <i class="fas fa-filter"></i>
                <i class="fas fa-angle-down ml-1"></i>
              </div>
            </div>
          </div>
          <!-- card header end -->

          <div class="card-body p-0">
            <div class="table-rep-plugin">
              <div
                class="table-responsive mb-0"
                data-pattern="priority-columns"
              >
                <table id="tech-companies-1" class="table">
                  <thead>
                    <tr class="border-0">
                      <th data-priority="1" class="py-3 px-3"></th>
                      <th data-priority="1" class="py-3 px-3">#</th>
                      <th data-priority="1" class="py-3 px-3">
                        {{ $t("fields.name") }}
                      </th>
                      <th data-priority="1" class="py-3 px-3">
                        {{ $t("fields.description") }}
                      </th>
                      <th data-priority="1" class="py-3 px-3" colspan="">
                        {{ $t("fields.action") }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(field, index) in laravelData.data"
                      :key="field.id"
                    >
                      <td>
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          autocomplete="off"
                        />
                      </td>

                      <td>{{ index + 1 }}</td>

                      <th>{{ field.name }}</th>

                      <td>
                        {{ field.description }}
                      </td>

                      <td class="d-flex">
                        <nuxt-link
                          :to="localePath(`/admin/industries/${field.id}`)"
                        >
                          <i
                            class="fas fa-external-link-alt text-success pr-1"
                          ></i>
                        </nuxt-link>
                        <nuxt-link
                          :to="localePath(`/admin/industries/${field.id}/edit`)"
                        >
                          <i class="far fa-edit text-primary px-3"></i>
                        </nuxt-link>
                        <button
                          @click="remove(field.id, index)"
                          class="border-0 bg-transparent"
                        >
                          <i class="far fa-trash-alt text-danger"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- end col -->
    </div>

    <pagination
      class="pb-3 justify-content-center"
      :data="laravelData"
      @pagination-change-page="getResults"
    ></pagination>
  </div>
  <!-- End Page-content -->
</template>

<script>
export default {
  layout: "Admin",

  data() {
    return {
      laravelData: {}
    };
  },

  methods: {
    getResults(page = 1) {
      this.$axios.get("/ajax/fields?page=" + page).then(response => {
        this.laravelData = response.data;
      });
    },

    async remove(id, index) {
      try {
        this.$axios.delete("/ajax/fields/" + id);
        this.fields.splice(index, 1);
        this.$toast.success("Deleted Successfully.");
      } catch (error) {
        console.log(error);
      }
    }
  },
  mounted() {
    this.getResults();
  }
};
</script>
