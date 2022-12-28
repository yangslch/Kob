<!--
    ContentField用于将内容放在一个白框内
    其代码是在bootstrap上寻找
    container是一个自适应大小的容器
-->
<template>
    <div class="container content-field">
        <div class="card">
            <div class="card-body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
</script>

<!--
    设置白框的上边距
    div.class名称是class选择器的书写格式
-->
<style scoped>
div.content-field {
    margin-top: 20px;
}
</style>
