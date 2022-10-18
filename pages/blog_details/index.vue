<template>
  <div id="blogDetail_wrapper">
    <Header height="70px" :scaleable="false" navbarClass="bg-white" /><Header
      height="70px"
      :scaleable="false"
      navbarClass="bg-white"
    />

    <div class="container">
      <!-- .blog- details side -->
      <div class="blog-side">
        <div class="row">
          <div class="col-md-3">
            <div class="menu-ta">
              <h4>Topic</h4>
              <ul>
                <li class="active"><nuxt-link to="/blog">All</nuxt-link></li>
                <li><nuxt-link to="/blog/1">demo 1</nuxt-link></li>
                <li><nuxt-link to="/blog/2">demo 2</nuxt-link></li>
                <li><nuxt-link to="/blog/3">demo 3</nuxt-link></li>
                <li><nuxt-link to="/blog/4"></nuxt-link></li>
              </ul>
            </div>
          </div>
          <div class="col-md-9">
            <!-- .single content start -->
            <div class="single-content">
              <h1>
                <a href="">What is FaaS? Function as a Service explained</a>
              </h1>
              <div class="post-meta">
                <p>Posted 2022-02-01 in <a href="">Cloud Education</a></p>
              </div>

              <div class="post-img mt-5 mb-4">
                <img
                  src="@/static/images/blog/blog_details.jpg"
                  style="max-width: 90%"
                  alt=""
                />
              </div>

              <div class="author-meta d-flex align-items-center mb-5">
                <img
                  src="@/static/images/blog/blog-author.jpg"
                  class="mr-3"
                  alt=""
                />
                <div class="author-name">
                  <span>By</span>
                  <a href="">Brittany King</a>
                </div>
              </div>

              <div class="blog-desc">
                <p>
                  Serverless computing allows developers to build and run
                  applications without having to manage cloud infrastructure.
                  There are still servers in serverless, but they are abstracted
                  away from app development. Using a serverless model a cloud
                  provider handles the routine work of provisioning,
                  maintaining, and scaling the server infrastructure and
                  developers can focus on code for deployment. Function as a
                  Service (FaaS) and serverless are often referred to
                  synonymously, but they actually have two specific definitions.
                  While serverless refers to any category where the server is
                  fully abstracted from the end-user, FaaS is a subset of
                  serverless computing that’s focused on event-driven triggers
                  where code runs in response to events or requests. If there is
                  no event-driven request, the server shuts down, making its
                  resources available for other requests. Once deployed, FaaS
                  responds to demand and automatically scales up and down as
                  needed. Typically,
                </p>
                <p>
                  when a serverless function is sitting idle, it doesn’t cost
                  anything, saving money in many situations. The relationship
                  between IaaS, PaaS, and FaaS Infrastructure as a Service
                  (IaaS), Platform as a Service (PaaS), and FaaS are all cloud
                  computing offerings. The difference between them is the level
                  of abstraction they provide between the user and the
                  infrastructure. IaaS offers the lowest level of abstraction.
                  With IaaS, users have complete control over their
                  infrastructure and the software and tools associated with
                  their tech, but they don’t have to control or manage the
                  physical infrastructure, like bare metal servers or data
                  centers. IaaS gives developers the opportunity to choose the
                  layers of abstraction they want. They can choose to manage
                </p>

                <p>
                  everything, or they can layer in features such as load
                  balancers or even managed services including Managed
                  Kubernetes or Managed Databases to make maintaining their
                  application easier. PaaS adds another layer of abstraction for
                  the end-user. With PaaS, users no longer have to manage the
                  operating system, runtime, or other infrastructural components
                  of their application, but will still have granular control
                  over underlying application and infrastructure configurations.
                  PaaS provides a fully managed infrastructure solution for
                  developers looking to launch applications quickly. When
                  developers choose to use PaaS, they can focus on their
                  development work and let the provider manage backend services
                  and system administration. Of the three, FaaS offers the most
                  abstraction for the user and the most specific functionality.
                  With FaaS, developers have access to a platform that executes
                  application logic on demand, and all of the application
                  resources and other infrastructural components are managed by
                  the service provider. FaaS vs. PaaS While FaaS and PaaS
                  offerings initially seem quite similar, there are key
                  differences to consider when deciding which is right for you.
                  Configuration. Because of its straightforward use case and
                  completely managed solutions, FaaS offers extremely low
                  provisioning time. Even though PaaS offers more abstraction
                  than other cloud computing models, it still requires some
                  configuration. This can be a benefit or a downside depending
                  on the level of control you desire. Operations. FaaS
                  technologies spin entire applications up and down for
                  individual requests. While PaaS has the ability to
                  automatically scale up and down as needed, there are generally
                  always resources running. This feature of FaaS can affect
                  latency, pricing, and the ability to handle complex requests.
                  Scalability. PaaS does scale up and down as needed, but it
                  requires thought and configuration from the developer. FaaS
                  doesn’t require any capacity planning. It scales readily and
                  easily as required. Pricing. PaaS has different pricing models
                  depending on your provider but is often more costly than FaaS
                  if you’re running a low workload. FaaS allows developers to
                  pay per function invocation, saving time if event triggers are
                  few. PaaS may be the better option for consistent or high
                  workloads in terms of pricing. How FaaS works Early
                  applications were typically written using a monolithic
                  architecture. This meant that the application was structured
                  as a single execution that had to be triggered all at once.
                  Over time, developers have increasingly shifted to using
                  microservices. Microservices are a collection of modules that
                  are independently deployable. Because they can be worked on
                  individually, they are easier to test and maintain. A function
                  is essentially a microservice that can only perform one action
                  in response to an event. With FaaS, the provider will spin up
                  a server when a function is triggered. It will execute the
                  function, then shut down the server. Serverless offerings are
                  only active when the function is being used, allowing the same
                  computing resources to be allocated elsewhere when the server
                  is shut down. Developers using FaaS have access to a platform
                  that allows them to execute the code for their applications.
                  Simplicity is the strong suit of FaaS. In order to use FaaS to
                  the best of its ability, developers must ensure that each
                  function only performs one action. The scope of the function
                  should be limited and efficient. Using too many libraries or
                  asking one function to call another function will quickly slow
                  down the application and increase costs. Benefits of FaaS
                  There are many benefits to using FaaS architecture. A few
                  reasons you may choose to use FaaS for your application are:
                  The ability to focus solely on coding and development for your
                  application Cost savings by paying for only what you use The
                  ability to auto-scale without capacity planning or ongoing
                  maintenance Faster time to market due to the ease of
                  development and testing Considerations when choosing FaaS FaaS
                  can be used in a variety of ways, from web apps, data
                  processing, and online chatbots to backend functions and more.
                  Before committing to a FaaS provider, consider the following:
                  Workloads. Choose FaaS for simple and repetitive functions
                  without consistent workloads or high volumes of requests.
                  Because FaaS is typically priced per function execution, costs
                  for high usage could potentially be higher than using a PaaS
                  offering. If your workload is relatively small, FaaS is a
                  great choice for simplifying provisioning and saving money.
                  Control. FaaS is one of the most abstracted cloud offerings.
                  Consider the amount of insight and control you prefer over
                  your configurations and infrastructure. If you want a bit more
                  control than FaaS offers while maintaining similar ease of
                  use, try a PaaS solution. Teams that want complete control
                  over their production environment and the design and behavior
                  of their infrastructure should consider using an IaaS
                  solution. Vendor lock-in. It can be challenging to migrate
                  applications built through providers. Using open-source cloud
                  solutions makes it easier to migrate computing operations from
                  one provider to another. DigitalOcean and Nimbella have joined
                  forces to make serverless computing more accessible.
                  Interested in exploring serverless?
                </p>
              </div>
            </div>
            <!-- .single content end -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Header from "@/components/website/Header.vue";
export default {
  layout: "website",
  components: {
    Header,
  },
};
</script>

<style scoped>
#blogDetail_wrapper {
  padding: 130px 0;
}
.single-content h1 a {
  text-decoration: none;
  color: rgb(3, 27, 78) !important;
  font-size: 31px;
  font-weight: bold;
}
.author-meta img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
.blog-desc p {
  text-align: justify;
}
.post-img img {
  border-radius: 8px;
}
.single-content .post-meta p {
  font-size: 13px;
}
.single-content .post-meta p a {
  text-decoration: underline !important;
}

.blog-side .menu-ta h4 {
  color: rgb(153, 161, 179);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  line-height: 17px;
  margin-bottom: 20px;
  text-transform: uppercase;
  margin-top: 7px;
}
.blog-side .menu-ta ul li a {
  color: rgb(91, 105, 135);
  display: flex;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  padding: 12px 22px 11px;
  text-decoration: none;
}

.blog-side .menu-ta ul li.active {
  background: rgb(242, 248, 255);
  border-radius: 40px;
}
.blog-side .menu-ta ul li a:hover {
  background: rgb(242, 248, 255);
  border-radius: 40px;
  color: rgb(0, 105, 255);
}

</style>
