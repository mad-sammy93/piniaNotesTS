<template>
    <MainSection>
        <div class="status__nav">
            <slot></slot>
        </div>
    </MainSection>
</template>
<script setup lang="ts">
import MainSection from "./MainSection.vue";
    components: { MainSection }
</script>

<style scoped>
.status__nav{
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
}

</style>