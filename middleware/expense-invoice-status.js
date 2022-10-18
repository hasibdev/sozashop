export default function ({
  route,
  $axios,
  error
}) {
  return $axios.get(
    `/expense-invoices/${route.params.id}`
  ).then((res) => {
    if(res.data.data.status !== 'draft'){
      error({statusCode: 404, message: "Sorry, the page you are looking for is not found."})
    }
  })
  .catch(err => console.log(err));

}
