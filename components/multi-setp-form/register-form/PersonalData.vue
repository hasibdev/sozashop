<template>
    <div>
        <!-- Shop Name -->
        <input-control placeholder="Shop Name" focus stack labelClasss="mb-2" v-model="formData.shopName" label="Shop Name" :error="validationErrors.shopName"></input-control>

        <div class="row">
            <!-- First Name -->
            <div class="col-lg-6">
                <input-control placeholder="First Name" stack labelClasss="mb-2" v-model="formData.firstName" label="First Name" :error="validationErrors.firstName"></input-control>
            </div>
            <!-- Last name -->
            <div class="col-lg-6">
                <input-control placeholder="Last Name" stack labelClasss="mb-2" v-model="formData.lastName" label="Last Name" :error="validationErrors.lastName"></input-control>
            </div>
        </div>

        <!-- Phone number -->
        <input-control placeholder="Phone Number" stack labelClasss="mb-2" type="tel" v-model="formData.mobile" label="Phone Number" :error="validationErrors.mobile"></input-control>

        <div class="row">
            <!-- Industries Select box -->
            <div class="col-lg-6">
                <!-- Industry -->
                <select-control @input="onIndustryChange" labelClasss="mb-2" stack :label="$t('fields.industry')" :options="industries || []" track="id" name="industry-options" v-model="formData.industryId" :error="validationErrors.industryId"></select-control>
            </div>

            <!-- Country Select -->
            <div class="col-lg-6">
                <select-control :disabled="!formData.industryId" labelClasss="mb-2" :loader="loadingCountries" stack :label="$t('fields.country')" title="countryName" :options="modules || []" track="id" name="modules-options" v-model="formData.moduleId" :error="validationErrors.moduleId"></select-control>
            </div>
        </div>

        <!-- Email -->
        <input-control type="email" placeholder="Email" stack labelClasss="mb-2" v-model="formData.email" label="Email" :error="validationErrors.email"></input-control>

        <!-- Password -->
        <div class="row">
            <div class="col-lg-6">
                <input-control type="password" placeholder="Password" stack labelClasss="mb-2" v-model="formData.password" label="Password" :error="validationErrors.password"></input-control>
            </div>

            <!-- Confirm Password -->
            <div class="col-lg-6">
                <input-control type="password" placeholder="Confirm Password" stack labelClasss="mb-2" v-model="formData.password_confirmation" label="Confirm Password"></input-control>
            </div>
        </div>

        <!-- Sign up Button -->
        <div class="form-group row mt-3">
            <div class="col">
                <StepPagination :isBack='false' :increment="increment" :decrement="decrement" @onNext="saveData" />
                <!-- <btn-primary @click="register" :loading="savingState" class="w-md waves-effect waves-light w-100" type="submit">
                    Register
                </btn-primary> -->
            </div>
        </div>

        <div class="text-center">
            <span class="mt-3 mb-0">Already have an account?
                <nuxt-link :to="localePath('/login')"> Login </nuxt-link>
            </span>
        </div>
    </div>
</template>

<script>
import validation from "@/plugins/mixins/validation"
import StepPagination from '@/components/multi-setp-form/StepPagination.vue'
export default {
    mixins: [validation],
    components: {
        StepPagination,
    },
    data() {
        return {
            formData: {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                password_confirmation: "",
                shopName: "",
                mobile: "",
                moduleId: "",
                industryId: "",
            },
            industries: null,
            modules: [],
            loadingCountries: false,
            savingState: false,
        }
    },
    methods: {
        async register() {
            this.savingState = true
            try {
                await this.$axios.post("/register", this.formData)
                this.$router.push(this.localeRoute("/"))
                this.$toast.success("User Register successfully")
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    this.$toast.error(error.response.data.message)
                }
            } finally {
                this.savingState = false
            }
        },
        async onIndustryChange(id) {
            this.loadingCountries = true
            this.formData.moduleId = null
            try {
                const resModule = await this.$axios.$get(
                    `/admin/modules?industryId=${id}`
                )
                this.modules = resModule.data
            } catch (error) {
                console.log(error)
            } finally {
                this.loadingCountries = false
            }
        },

        saveData() {
            this.increment()
            console.log('save data')
        }
    },
    async fetch() {
        const resIndustry = await this.$axios.$get("ajax/industries")
        this.industries = resIndustry.data
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