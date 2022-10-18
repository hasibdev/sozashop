import Vue from "vue";
import { mapGetters } from "vuex";

export default{
	computed: {
		...mapGetters({
			validationErrors: "validation/validationErrors"
		})
	}
	// install(Vue, options) {
	// 	Vue.mixin({
	// 	});
	// }
};

// Vue.use(Validation);