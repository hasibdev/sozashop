<template>
    <loading-view :loading="$fetchState.pending">
        <detail-view v-if="packages">
            <template #header>
                <h3 class="font-weight-normal mb-3">
                    Packages
                </h3>
            </template>

            <template>
                <div class="row">
                    <div v-for="pkg in packages" :key="pkg.id" class="text-center mb-4 col-md-6 col-xl-4 d-flex justify-content-center">
                        <div style="width: 360px;" class="relative overflow-hidden border rounded px-3 py-5 h-100 shadow-sm d-flex flex-column align-items-center h-100">
                            <!-- Recomended Badge -->
                            <p v-if="pkg.recommended" class="recomended-badge">Recomended</p>

                            <!-- Header -->
                            <div class="border-bottom w-100">
                                <h3>{{ pkg.name }}</h3>
                                <p>${{ pkg.price }} / {{ pkg.type.split('_').join(' ') | capitalize }}</p>
                            </div>

                            <!-- list -->
                            <div class="d-flex justify-content-center  mt-3 mb-4 flex-grow-1">
                                <ul class="font-size-18 text-left">
                                    <li v-for="d in pkg.description" :key="d.id" class="py-2">
                                        <i class="fas fa-check-circle font-size-14 mr-2 text-primary"></i>
                                        {{ d.description }}
                                    </li>
                                </ul>
                            </div>

                            <!-- Choose Button -->
                            <div>
                                <!-- <btn-primary class="" to="/">Choose</btn-primary> -->

                                <a :href="`${$config.apiBaseUrl}/client/${$auth.user.clientId}/package/${pkg.id}/checkout`" class="btn btn-primary px-5" :class="{'disabled' : $auth.user.client.packageId == pkg.id}" target="_blank" rel="noopener noreferrer">Buy Now</a>

                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </detail-view>
    </loading-view>
</template>

<script>
export default {
    name: 'settings-packages',
    data() {
        return {
            packages: null
        }
    },
    async fetch() {
        try {
            const res = await this.$axios.get('/ajax/packages')
            this.packages = res.data.data
        } catch (error) {
            console.log(error)
        }
    },
     created() {
    if (!this.hasPagePermission("settings.package-list")) {
      this.$router.push(this.localePath("/dashboard"));
    }
  },
}
</script>

<style lang="scss" scoped>
.recomended-badge {
    position: absolute;
    top: 6%;
    left: -35%;
    background: var(--primary);
    color: white;
    // padding: 1px 40px;
    width: 100%;
    width: 100%;
    transform: rotate(-45deg);
}
</style>