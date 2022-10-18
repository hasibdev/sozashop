<template>
  <section class="bg-white" style="padding: 80px 0">
    <div class="container">
      <div class="d-flex flex-column align-items-center justify-content-center">
        <h1 class="text-dark w-50 text-center">We are build awesome marketing template</h1>
        <p class="text-justify text-dark w-75 text-center mt-3">At sit veniam evertitur democritum, ex modo tacimates nec, et inani regione abhorreant mel. Mei denique atomorum argumentum in, dicant recteque maiestatis ei mea. Vix dolorem dissentiet ex, ut ullum viderer pri. Principes complectitur et vim, quo ad quod tractatos mnesarchum. Eu euripidis disputando vim. Cu duo graece oportere cotidieque. Eu nonumy volumus nec. Vim consulatu quaerendum cu.</p>
        <div class="section-heading-icon my-2"></div>
      </div>

      <div class="row mt-5">
        <div v-for="(template, i) in templates" :key="i" class="col-sm-4 col-md-4">
          <div class="row">
            <!-- <img :src="template.imgUrl" style="height: 50px; width: 50px;" alt=""> -->
            <span class="icon col-md-3 " :class="template.icon"></span>
            <div class="col-md-9">
              <p class="font-size-24 text-dark">{{ template.title }}</p>
              <p>{{ template.designation }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "MarketTemplae",
  props: {
    templates: {
      type: Array,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>