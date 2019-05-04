<template>
    <div v-bind:class="{ disabled: state.loading }">
        <v-dialog v-model="state.loading" hide-overlay persistent>
            <v-card color="primary" dark
            >
                <v-card-text>Loading
                    <v-progress-linear
                            indeterminate
                            color="white"
                            class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
        <router-view></router-view>

    </div>
</template>

<script>
    import state from '../state'

    export default {
        name: 'AppLayout',
        data() {
            return {
                state,
            }
        }
    }

</script>

<style>
    .disabled {
        pointer-events: none;
    }
</style>