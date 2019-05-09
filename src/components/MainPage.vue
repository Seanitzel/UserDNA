<template>
    <v-container pa-0 class="bg">
        <v-tabs centered grow color="cyan" dark icons-and-text>
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab href="#tab-1">
                Users
                <v-icon>verified_user</v-icon>
            </v-tab>

            <v-tab href="#tab-2">
                Play
                <v-icon>tap_and_play</v-icon>
            </v-tab>

            <v-tab href="#tab-3">
                About
                <v-icon>info</v-icon>
            </v-tab>

            <v-tab-item value="tab-1">
                <v-card flat>
                    <v-layout align-center justify-center pa-4>
                        <v-text-field box clearable id="user_input"
                                      v-model="userID"
                                      label="User ID"
                        ></v-text-field>
                        <v-btn @click="mongoAllUsers" id="show_users">
                            Show all users
                        </v-btn>
                        <v-btn @click="add" id="add_user">
                            Add User
                        </v-btn>
                        <v-btn @click="check" id="user_exists">
                            User Exists?
                        </v-btn>
                        <v-btn @click="deleteU" id="delete_user">
                            Delete User
                        </v-btn>
                    </v-layout>
                    <v-flex xs12 my-3>
                        <v-textarea id="text_input" v-model="text" label="Input">
                        </v-textarea>
                    </v-flex>
                </v-card>
                    <v-flex xs12 pa-4 v-if="users">
                        <v-card >                                
                            <li v-for="el,i in users" class="display-1">
                                {{i+1}}: {{el.name}}
                            </li>
                        </v-card>
                    </v-flex>
            </v-tab-item>
            <v-tab-item value="tab-2">
                <v-layout row wrap justify-center center>
                    <v-flex xs12 my-3>
                        <v-textarea id="text_input" v-model="text" label="Input">
                        </v-textarea>
                    </v-flex>
                    <v-flex xs12 my-3 style="text-align: center">
                        <v-btn round large color="blue lighten-3" @click="verGlobaly" id="identify">
                            Identify Globally
                        </v-btn>
                    </v-flex>
                    <v-flex v-if="progress"  xs12 my-1 style="text-align: center">
                        <v-progress-circular width="8" size="50" :value="progress" color="purple">
                            {{ parseInt(progress) }}
                        </v-progress-circular>
                    </v-flex>
                    <v-flex xs12 pa-4 v-if="similarUsers">
                        <v-card class="display-1" v-for="res in similarUsers">
                            <v-card-text class="title">
                                Name: {{res[1]}}
                            </v-card-text>
                            <v-card-text class="title">
                                Score: {{res[0].score}}
                            </v-card-text>
                            <v-divider></v-divider>
                        </v-card>
                    </v-flex>
                    <v-divider></v-divider>
                    <v-flex xs12>
                        <v-text-field box clearable id="user_input"
                                      v-model="userID"
                                      label="User ID"
                                      width="20%"
                        ></v-text-field>
                        <v-btn color="blue" fab large @click="verify" id="identify">
                            By User
                        </v-btn>
                    </v-flex>
                    <v-flex xs12 pa-4 v-if="result">
                        <v-card>
                            <v-card-title class="display-1">
                                Result: {{results[result.result]}}
                            </v-card-title>
                            <v-card-text class="title">
                                Score: {{result.score}}
                            </v-card-text>
                            <v-card-text class="title">
                                Confidence Interval: {{result.confidence_interval}}
                            </v-card-text>
                        </v-card>
                        <v-divider></v-divider>
                        <v-card>
                            <v-card-title class="display-1">Pattern:</v-card-title>
                            <v-card-text style="overflow: auto;" v-text="pattern">
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-tab-item>

            <v-tab-item value="tab-3">
                <v-card flat>
                    <v-card-text>{{ text }}</v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-container>
</template>

<script>
    const port = 3000
    const dna  = new TypingDNA()

    export default {
        data() {
            return {
                text:    null,
                userID:  null,
                result:  null,
                pattern: null,
                users: null,
                similarUsers: null,
                results: ['Not A Match', 'Match'],
                progress:0
            }
        },
        methods: {
            getValues() {
                // console.log(dna.getTypingPattern({
                //     type: 0, text: this.text,
                // }))
                return [
                    this.userID, dna.getTypingPattern({
                        type: 0, text: this.text,
                    }),
                ]
            },

            async add() {
                let val     = this.getValues()
                this.result = await addUser(val[0], val[1])
            },

            async verify() {
                let val      = await this.getValues()
                this.pattern = val[1]
                this.result  = await verifyPattern(val[0], val[1])
                this.dnaReset()
                this.resetInput()
            },

            async check() {
                let val     = this.getValues()
                this.result = (await checkUser(val[0]))
            },

            async deleteU() {
                let val     = this.getValues()
                this.result = await deleteUser(val[0])
            },

            async mongoAllUsers(){
                this.users = await mongoGetAllUsers()
            },

            async changeProg(precent){
                if(precent>0 && precent<100){
                    this.progress = precent
                    console.log(this.progress)
                }
                else{
                    this.progress = 0
                }
            },

            async verGlobaly(){
                this.similarUsers = null
                await this.mongoAllUsers()
                let temp
                let result = []
                let val = await this.getValues()
                let precent = 100/this.users.length
                let changeProg = this.changeProg
                await this.asyncForEach( this.users ,async (user) => {
                    temp = await verifyPattern(user.name, val[1])
                    changeProg(precent)
                    precent += 100/this.users.length
                    result.push([temp,user.name])
                })
                result.sort(function(a,b){
                    return b[0].score - a[0].score
                })
                this.similarUsers = result.slice(0,5)
                this.resetInput()
                this.dnaReset()
            },

            async asyncForEach(array, callback) {
                for (let index = 0; index < array.length; index++) {
                    await callback(array[index], index, array);
                }
            },

            dnaReset(){
                this.userID = null
                dna.reset()
            },

            resetInput(){
                this.text = null
            }
        },
    }

    function replyPrint(res) {
        console.log(res)
        return res
    }

    async function addUser(id, pattern) {
        const res = await fetch(`http://localhost:${port}/api/post/addPattern/${id}/${pattern}`)
        mongoAddUser(id)
        return res.json()
    }

    async function verifyPattern(id, pattern, quality = 2) {
        // /api/get/verifyPattern/:id/:pattern/:quality
        const res = await fetch(`http://localhost:${port}/api/get/verifyPattern/${id}/${pattern}/${quality}`)
        replyPrint(res)
        return res.json()
    }

    async function checkUser(id) {
        const res = await fetch(`http://localhost:${port}/api/get/user/${id}`)
        return res.json()
    }

    async function deleteUser(id) {
        const res = await fetch(`http://localhost:${port}/api/post/deleteUser/${id}`)
        return res.json()
    }

    async function mongoGetAllUsers(){
        const res = await fetch(`http://localhost:${port}/api/get/mongoAllUsers`)
        return res.json()
    }

    async function similarUsersPatt(){
        const users = await mongoGetAllUsers()
        let res = []
        let temp
        users.forEach( async (user) => {
            temp = await verifiedPattern(user.name,pattern)
            res.push(temp)
        })
        return res
    }

    async function mongoAddUser( name){
        await fetch(`http://localhost:${port}/api/get/mongoAddUser/${name}`)
    }
</script>

<style>

</style>
