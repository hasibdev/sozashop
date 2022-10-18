<template>
    <div class="">
        <div v-if="selectedPkg">
            <select-control label="Choose a Package" stack @input="onSelectPackage" :value="selectedPkg.id" :options="packages"></select-control>

            <div class=" text-center mt-4">
                <h3>{{ selectedPkg.name }}</h3>
                <p>${{ selectedPkg.price }} / {{ selectedPkg.type.split('_').join(' ') | capitalize }}</p>

                <div class="d-flex justify-content-center align-items-center">
                    <ul class="font-size-18 text-left mb-4">
                        <li v-for="d in selectedPkg.description" :key="d.id" class="py-1">
                            <i class="fas fa-check font-size-14 mr-2"></i>
                            {{ d.description }}
                        </li>
                    </ul>
                </div>
            </div>

            <StepPagination :increment="increment" :decrement="decrement" @onNext="saveData" />
        </div>

        <!-- Loading -->
        <div class="p-5 text-center" v-else>
            <b-spinner variant="primary" label="Spinning"></b-spinner>
        </div>
    </div>
</template>

<script>
import StepPagination from '@/components/multi-setp-form/StepPagination.vue'
export default {
    name: 'packages-form',
    components: {
        StepPagination
    },
    data() {
        return {
            packages: [],
            selectedPkg: null
        }
    },
    methods: {
        onSelectPackage(id) {
            this.selectedPkg = this.packages.find(pkg => pkg.id == id)
        },
        saveData() {
            console.log('save data')
        }
    },
    async fetch() {
        const res = await this.$axios.get('/ajax/packages')
        this.packages = res.data.data
        this.selectedPkg = res.data.data.find(pkg => pkg.recommended)
    },

    props: {
        increment: {
            type: Function,
        },
        decrement: {
            type: Function,
        },
    },
};
</script>

<style lang="scss" scoped>
</style>