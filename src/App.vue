<template>
    <v-app>
        <v-toolbar app>
            <v-toolbar-title class="headline text-uppercase">
                <span>User DNA</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>

        <v-content>
            <main-page/>
        </v-content>
    </v-app>
</template>

<script>
    import MainPage from './components/MainPage'

    export default {
        name:       'App',
        components: {
            MainPage,
        },
        data() {
            return {
                //
            }
        },
    }
</script>
