<template>
    <v-app id="moderator" class="moderator">
        <top-header/>
        <div class="ml-12" v-if="moderator=true">
            <h1 class="ma-4">Espace Modérator</h1>
            <v-container>
                <v-btn class="ma-3" @click="clickPosts">Posts</v-btn>
                <v-btn class="ma-3" @click="clickComments">Commentaires</v-btn>
                <div v-if="showPosts">
                    <v-card class="mur__post ma-3 mt-6" v-for="(post, index) in allPosts" v-bind:key="index">
                        <v-card-title>
                            <v-avatar >
                                <img :src="post.avatar" alt="">
                            </v-avatar>
                            <span class="mur__post__title">{{ post.title }}</span>
                        </v-card-title>

                        <v-card-subtitle class=" mur__post__name">
                            Par {{ post.firstName }} {{ post.lastName }}, le {{ post.date }}
                        </v-card-subtitle>

                        <v-card-text class="v-card-text black--text mur__post__content" >
                            {{ post.content }}
                        </v-card-text>
                        <v-card-text class="v-card-text black--text mur__post__content" >
                            <span ><img v-if="post.userId" :src="post.imageUrl" alt="" class="postImage"/></span>
                        </v-card-text>

                        <v-card-actions class="mur__post__manage">
                            <v-btn class="mur__post__manage--btn" title="supprimer le post" @click="deletePost(post.id)" icon>
                                <v-icon>mdi-delete-outline</v-icon>
                            </v-btn> 
                        </v-card-actions>
                    </v-card>
                </div>
                <div v-if="showComments">
                    <v-card class="mur__comments--ind my-1 mx-2 pa-0" color="rgba(255,215,215,0.3)" v-for="(comment, index) in allComments" v-bind:key="index" outlined>
                        <v-card-subtitle class=" pb-0 mur__comments__name">
                            Le {{ comment.date }}, {{ comment.firstName }} {{ comment.lastName }} commente :
                        </v-card-subtitle>

                        <v-card-text class="text--primary mur__comments__content ">
                            {{ comment.comContent }}
                        </v-card-text>

                        <v-card-actions class="mur__comments__manage">
                            <v-btn title="supprimer le commentaire" class="mur__comments__manage--btn" @click="deleteComment(comment.id)" icon>
                                <v-icon >mdi-delete-outline</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </div>
            </v-container>
        </div>
    </v-app>
</template>


<script>

import TopHeader from "./TopHeader"
import axios from "axios"

export default {
    name: "Moderator",
    data(){
        return{
            allPosts: [],
            allComments: [],
            showPosts: true,
            showComments: false
        }
    },
    components: {
        "top-header": TopHeader,
    },
    methods: {
        clickPosts(){
            this.showPosts = true,
            this.showComments = false
        },
        clickComments(){
            this.showPosts = false,
            this.showComments = true
        },
        deletePost(pId){
            axios.delete("http://localhost:3000/api/moderator/post/" + pId, {headers: {Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let rep = JSON.parse(response.data);
                    console.log(rep.message);
                    
                })
                .catch(error => {
                    console.log(error);    
                });
                window.location.reload();
        },
        deleteComment(cId){
            axios.delete("http://localhost:3000/api/moderator/comment/" + cId, {headers: {Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let rep = JSON.parse(response.data);
                    console.log(rep.message);
                        
                })
                .catch(error => {
                    console.log(error);
                });
                window.location.reload();
        }
    },
    mounted(){
        axios.get("http://localhost:3000/api/moderator/posts", {headers: {Authorization: 'Bearer ' + localStorage.token}})
            .then(response => {
                let posts = JSON.parse(response.data);
                this.allPosts = posts;
            })
            .catch(error => {
            console.log(error); 
            });
        axios.get("http://localhost:3000/api/moderator/comments", {headers: {Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let com = JSON.parse(response.data);
                    this.allComments = com;
                })
                .catch(error => {
                console.log(error);
                });
    }
}
</script>

<style lang="scss">
.v-application .ml-12 {
    margin-left: 25px !important;
}
img {
    border-style: none;
    width: 100%;
}

</style>