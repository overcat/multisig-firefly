<template>
    <div>
        <h1>Home</h1>
        {{state.appVersion}} - {{state.accountId}}
    </div>
</template>


<script>
    import state from '../state'
    export default {
        data() {
            return {
                state
            }
        },
        mounted() {

        }
    }
</script>

<style>

</style>