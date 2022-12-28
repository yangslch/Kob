<!--
    游戏地图
-->
<template>
    <!--
        通过ref将parent与div进行绑定
        通过ref将canvas与canvas进行绑定，即通过ref可以做绑定操作
    -->
    <div ref="parent" class="gamemap">
        <!--
            canvas是html的一个标签，其通过js可以动态的绘制图形, tabindex = 0表示从键盘获取输入
        -->
        <canvas ref="canvas" tabindex="0"></canvas>
    </div>
</template>

<script>
import { GameMap } from "@/assets/scripts/GameMap";
import { ref, onMounted } from 'vue' //其作用类似于原生js中的document.getElementById获取DOM元素，
//onMounted函数是指当组件挂载完成后需要执行的操作
//res用于获取vue中的DOM和组件

export default {
    setup() {
        let parent = ref(null);
        let canvas = ref(null);

        onMounted(() => {
            //挂载完成后创建地图对象，传入canvas和parent
            //获取dom的指需要组件对象.value，这个和原生js一样
            new GameMap(canvas.value.getContext('2d'), parent.value)
        });

        return {//在vue中的template如果想使用某个属性或方法，必须要进行return操作，return后才能使用
            parent,
            canvas
        }
    }
}
</script>

<!--
    justify-content: 水平居中
    align-items：竖直巨著
-->
<style scoped>
div.gamemap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
