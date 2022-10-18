import Vue from 'vue'

Vue.filter('capitalize', (value) => {
  if (value == "") {
    return "";
  }
  let arr = value.split(" ");
  let newArr = arr.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return newArr.join(" ");
})
