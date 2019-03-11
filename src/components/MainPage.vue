<template>
    <v-container>
        <v-layout text-xs-center wrap>
            <v-flex xs12>
                <v-textarea v-model="text" label="Input">
                </v-textarea>
            </v-flex>
            <v-flex xs2>
                <v-text-field v-model="userID"
                        label="User ID"
                ></v-text-field>
            </v-flex>
            <v-flex xs2>
                <v-btn @click="add">
                    Add User
                </v-btn>
            </v-flex>
            <v-flex xs2 @click="verify">
                <v-btn>
                    Verify Pattern
                </v-btn>
            </v-flex>
            <v-flex xs2 @click="check">
                <v-btn>
                    User Exists?
                </v-btn>
            </v-flex>
            <v-flex xs2 @click="deleteU">
                <v-btn>
                    Delete User
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    const port = 3000
    const dna  = new TypingDNA()

    export default {
        data() {
            return {
                text: null,
                userID: null
            }
        },
        methods: {
            getValues() {
                // console.log(dna.getTypingPattern({
                //     type: 0, text: this.text,
                // }))
                return [this.userID,dna.getTypingPattern({
                    type: 0, text: this.text,
                })]
            },

            add() {
                let val = this.getValues()
                addUser(val[0], val[1])
            },

            verify() {
                let val = this.getValues()
                verifyPattern(val[0], val[1])
            },

            check() {
                let val = this.getValues()
                checkUser(val[0])
            },

            deleteU() {
                let val = this.getValues()
                deleteUser(val[0])
            },
        },
    }

    function replyPrint(res) {
        console.log(res)
        return res
    }

    function addUser(id, pattern) {
        fetch(`http://localhost:${port}/api/post/addPattern/${id}/${pattern}`).then((res) => {
            return res.json()
        }).then(res => replyPrint(res))
    }

    function verifyPattern(id, pattern, quality = 2) {
        // /api/get/verifyPattern/:id/:pattern/:quality
        fetch(`http://localhost:${port}/api/get/verifyPattern/${id}/${pattern}/${quality}`).then((res) => {
            return res.json()
        }).then(res => replyPrint(res))
    }

    function checkUser(id) {
        fetch(`http://localhost:${port}/api/get/user/${id}`).then((res) => {
            return res.json()
        }).then(res => replyPrint(res))
    }

    function deleteUser(id) {
        fetch(`http://localhost:${port}/api/post/deleteUser/${id}`).then((res) => {
            return res.json()
        }).then(res => replyPrint(res))
    }
</script>

<style>

</style>
