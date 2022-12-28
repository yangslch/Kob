<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link class="navbar-brand" :to="{name: 'home'}">Bots</router-link>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
                <!--获取到router_name，来决定字体是否高亮-->
              <router-link :class="route_name == 'pk_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'pk_index'}">对战</router-link>
            </li>
            <li class="nav-item">
              <router-link :class="route_name == 'record_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'record_index'}">对局列表</router-link>
            </li>
            <li class="nav-item">
              <router-link :class="route_name == 'ranklist_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'ranklist_index'}">排行榜</router-link>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                yanxuecan
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
    
                    <router-link class="dropdown-item" :to="{name: 'user_bot_index'}">我的Bot</router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#">退出</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    </template>
    
    <script>
    import { useRoute } from 'vue-router'
    import { computed } from 'vue'
    
    export default {
        setup() {
        //setup函数，其作用就是对所使用的数据、方法进行配置/赋值


            //路由其实就是当前所处的href
            //useRoute()返回当前路由地址，必须在setup()中调用
            const route = useRoute();
            //计算属性，该方式是vue3的新写法，意思为每次需要使用route_name时，利用computed重新计算当前路由的name
            //watch和computed的区别
            //当你需要进行数值计算，或者是获取某个属性的时候，利用computed
            //当你监听数据data域是否变化，并且执行异步操作或者开销较大的操作时，使用watch
            let route_name = computed(() => route.name)
            return {
                route_name
            }
        }
    }
    </script>
    
    <style scoped>
    
    </style>
    