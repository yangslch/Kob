<!--
    游戏区域，用来展示游戏对战的块
-->
<template>
    <div class="playground">
        <GameMap />
    </div>
</template>

<script>
import GameMap from './GameMap.vue'

export default {
    components: {
        GameMap,
    }
}
</script>
<!--
    vw %多少的游览器宽度， vh %多少的游览器高度。
-->
<style scoped>
div.playground {
    width: 60vw;
    height: 70vh;
    margin: 40px auto;
}
</style>
