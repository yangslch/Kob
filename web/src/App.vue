<template>
  <!--NavBar是自己写的组件，需要引入，直接在初始页面展示组件navbar的内容-->
  <NavBar></NavBar>
  <router-view></router-view>
  <!--
    为什么需要router-view
    通过<a>标签实现页面的切换和跳转，会有一定的加载时间消耗，用户体验感不好
  -->
  <!--router-view实现的功能是在一个页面里可以切换着展示不同的组件页面
  比如说后台管理系统的页面，左侧导航栏是不变的，想要切换的只是右侧具体展示的内容，即切换的只是组件页面
  router-view提供的两个新组件
  1.<router-link/>
  用于帮助用户进行视图导航，其完成的是<a/>标签所完成的工作，<a/>标签用href属性指定导航的目标地址，而<router-link>通过to来完成
  2.<router-view>
    负责渲染匹配到的视图组件，即渲染<router-link>指向的目标地址
  
  将组件和渲染关联起来的方式
  创建一个router实例，通过传参来进行配置
  const router = new VueRouter({
    //配置routes
    routes:[
        //定义导航和组件的映射关系
        {
            path:"/vue",
            component:vueComponent
        }
          ]
   一般在router文件夹下的index.js完成该项工作
  -->
  
  

</template>

<script>
import NavBar from '@/components/NavBar.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"

export default {
  components: {
    NavBar,
  }
}

</script>

<!--style用来设置样式
-->
<style>

body {
  background: url("@/assets/image/background.png");
  background-size: cover;
}

</style>
