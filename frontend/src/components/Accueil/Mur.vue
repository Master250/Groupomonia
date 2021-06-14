<template>
    <v-app id="mur" class="mur">
        <top-header/>
        <div class="ml-12" v-if="userId">

            <h1 class="ma-4">Fil d'actualité</h1>
            <router-view></router-view>
            <v-container >
                <v-btn class="ma-3" @click="afficheForm">Créer un post</v-btn>
                <!--posts-->
                <v-card class="mur__post ma-3 mt-6" v-for="(post, index) in allPosts" v-bind:key="index">
                    <div class="d-flex justify-space-between">
                        
                        <v-card-title>
                            <v-avatar >
                                <img :src="post.avatar" alt="">
                            </v-avatar>
                            <span class="mur__post__title ml-0"> {{ post.title }}</span>
                        </v-card-title>
                        <v-card-actions class=" mur__post__manage" v-if="post.userId == userId">
                            <v-btn class=" mur__post__manage--btn" title="modifier le post" @click.stop="goDialogUpPost(post.title, post.content, post.imageUrl, post.id)" icon>
                                <v-icon>mdi-pencil-outline</v-icon>
                            </v-btn>
                            <v-btn class=" mur__post__manage--btn" title="supprimer le post" @click="deletePost(post.id)" icon>
                                <v-icon>mdi-delete-outline</v-icon>
                            </v-btn> 
                        </v-card-actions>

                    </div>

                    <v-card-subtitle class=" mur__post__name">
                        Par {{ post.firstName }} {{ post.lastName }}, le {{ post.date }} à {{ post.time }}
                    </v-card-subtitle>

                    <v-card-text class="v-card-text black--text mur__post__content" >
                        {{ post.content }}
                    </v-card-text>

                    <v-img v-if="post.userId" :src="post.imageUrl" alt="photoP" class="postImage" contain ></v-img>

                    <v-card-text class="py-0">
                        <v-btn fab title="like ?" class="ma-3" color="rgb(255,215,215)"  @click="likePost(post.id, post.likes)">
                                <v-icon >mdi-heart-outline</v-icon>
                        </v-btn> 
                        {{ post.likes }}
                        <v-icon>mdi-heart-outline</v-icon>
                            
                        <v-btn text @click="afficheCom(post.id)" title="voir les commentaires">
                            <v-icon>mdi-comment-eye-outline</v-icon>
                            Commentaires
                        </v-btn>
                    </v-card-text>

                    <!--update post - form-->
            
                    <v-dialog v-model="dialogUpPost" max-width="600px">
                        <v-card>
                            <v-card-title>Modifier mon post</v-card-title>
                            <v-card-text>
                                <v-form ref="form" v-model="valid">
                                    <v-text-field v-model="dataPost.title" :rules="titleRules" :counter="50" label="Titre"></v-text-field>
                                    <input type="file" accept="image/*" @change="onChange"  name="file"/>
                                    <v-img v-if="dataPost.imageUrl" :src="dataPost.imageUrl" alt="photo"></v-img>
                                    <v-textarea v-model="dataPost.content" :rules="contentRules" label="Contenu à modifer"></v-textarea>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn text @click="dialogUpPost=false" class="ui brown">Annuler</v-btn>
                                <v-btn text :disabled="!valid" @click="updatePost()" class="ui blue-grey">Valider</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    
                    
                    <!--comments-->
                    <div class="mur__comments" v-if="postId === post.id">
                        <v-card class="mur__comments--ind my-1 mx-2 pa-3 " color="rgba(255,215,215,0.3)" v-for="(comment, index) in allComments" v-bind:key="index" outlined>
                            <v-card-subtitle class="pa-0 mur__comments__name">
                                Le {{ comment.date }}, {{ comment.firstName }} {{ comment.lastName }} commente :
                            </v-card-subtitle>
                            
                            <v-card-text class="pa-0 text--primary mur__comments__content ">
                                {{ comment.comContent }}
                            </v-card-text>
                            
                            <v-card-actions class="d-flex justify-end pa-0 mur__comments__manage" v-if="comment.userId == userId ">
                                <v-btn title="modifier le commentaire" class="mur__comments__manage--btn" @click.stop="goDialogUpCom(comment.comContent, comment.id)" icon>
                                    <v-icon >mdi-pencil-outline</v-icon>
                                </v-btn>
                                <v-btn title="supprimer le commentaire" class="mur__comments__manage--btn" @click="deleteCom(comment.id)" icon>
                                    <v-icon >mdi-delete-outline</v-icon>
                                </v-btn>
                            </v-card-actions>

                            <!--update comment - form-->
                            <v-dialog v-model="dialogUpCom" max-width="500px">
                                <v-card>
                                    <v-card-title>Modifier mon commentaire</v-card-title>
                                    <v-card-text>
                                        <v-form ref="form" v-model="valid">
                                            <v-textarea v-model="dataCom.content" :rules="comContentRules" :counter="255" label="Commentaire"></v-textarea>
                                        </v-form>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn text @click="dialogUpCom=false" class="ui brown">Annuler</v-btn>
                                        <v-btn text :disabled="!valid" @click="updateCom()" class="ui blue-grey">Modifier</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-card>

                        <v-btn v-if="!afficheFrmCm" title="commenter le post" class="ma-2" @click="afficheFormCom()">Commenter</v-btn>
                        
                        <!--new comment - form-->
                        <v-card v-if="afficheFrmCm">
                            <v-form  ref="form" class="ma-3" v-model="valid" v-if="form">
                                <v-textarea background-color="rgba(255,215,215,0.3)" v-model="dataCom.content" :rules="comContentRules" :counter="255" label="Commentaire" autofocus required></v-textarea>
                            </v-form>
                            <v-btn :disabled="!valid" class="success ma-2" @click="sendCom(post.id)">Poster</v-btn>
                            
                        </v-card>
                    </div>
                </v-card>
            </v-container>
        </div>
    </v-app>
</template>

<script>
import TopHeader from "./TopHeader"

import axios from "axios"

export default {
    name: "Mur",
    data(){
        return{
           
            token:"",
            userId: "",
            admin: "",
            afficheFrmCm: false,
            allPosts: [],
            allLikes: [],
            allComments: [],
            postId: "",
            dialogUpCom: false,
            dialogUpPost: false,

            valid: true,
            titleRules: [
                v => !!v || 'Title is required',
                v => (v && v.length <= 50) || 'Title must be less than 50 characters',
            ],
            contentRules: [
                v => !!v || 'Content is required',
            ],
            comContentRules: [
                v => !!v || 'Comment is required',
                v => (v && v.length <= 50) || 'Comment must be less than 50 characters',
            ],
            dataPost: {
                id: "",
                title:"",
                content:"",
                image: "",
                imageUrl: "",
                userId:"",
            },
            dataPostS: "",
            dataCom:{
                id: "",
                content:"",
                userId: localStorage.userId,
            },
            dataComS: "",
            dataLike:{
                userId: "",
                nbLikes: "",
                postId: "",
                liked: false,
            },
            dataLikeS: "",
            form: true
            
            
        }
    },
    methods: {
        
        afficheCom(pId){
            this.postId = pId;
            this.afficheFrmCm = false;
            axios.get("http://localhost:3000/api/posts/" + pId + "/comments", {headers: {Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let com = JSON.parse(response.data);
                    this.allComments = com;
                })
                .catch(error => {
                console.log(error);
                });
        },
        sendCom(pId){
            this.dataCom.userId = this.userId;
            this.dataComS = JSON.stringify(this.dataCom);
            
            axios.post("http://localhost:3000/api/posts/" + pId + "/comments", this.dataComS, {headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let rep = JSON.parse(response.data);
                    console.log(rep.message);
                    this.dataCom.content="";
                    this.dataCom.userId="";
                    this.afficheFrmCm=false;
                    
                })
                .catch(error => {
                    console.log(error); 
                    this.message=error;
                    this.msg=true
                });
                window.location.reload();
        },
        deletePost(pId){
            axios.delete("http://localhost:3000/api/posts/" + pId, {headers: {Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let rep = JSON.parse(response.data);
                    console.log(rep.message);
                    this.$router.push('/Accueil/Mur');
                })
                .catch(error => {
                    console.log(error);    
                });
                alert("Post supprimé");
                window.location.reload();
        },
        deleteCom(cId){
            axios.delete("http://localhost:3000/api/posts/comments/" + cId, {headers: {Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let resp = JSON.parse(response.data);
                    console.log(resp.message);
                    
                })
                .catch(error => {
                    console.log(error);
                });
                alert("Commentaire supprimé");
                window.location.reload();
        },
        goDialogUpPost(postTitle, postContent, postImage, postId){
            this.dataPost.title = postTitle;
            this.dataPost.content = postContent;
            this.dataPost.id = postId;
            this.dataPost.imageUrl = postImage;
            this.dialogUpPost = true;
        },
        onChange(e) {
            console.log(e.target.files);
            const file = e.target.files[0]
            this.dataPost.image = file
            this.dataPost.imageUrl = URL.createObjectURL(file)
        },
        updatePost(){
           
            this.token = localStorage.getItem("token");
            this.dataPost.userId = localStorage.getItem('userId');
            const formData = new FormData();
            formData.append('image', this.dataPost.image);
            formData.append('content', this.dataPost.content);
            formData.append('title', this.dataPost.title);
            formData.append('userId', this.dataPost.userId);
            
            axios.put("http://localhost:3000/api/posts/" + this.dataPost.id, formData, {headers: {'Content-Type': 'multipart/form-data', Authorization: 'Bearer ' + this.token}})
                .then(response => {
                    let rep = JSON.parse(response.data);
                    console.log(rep.message);
                    this.dataPost.title = "";
                    this.dataPost.content = "";
                    this.dataPost.userId = "";
                    this.dataPost.imageUrl="";
                    this.dataPost.id = "";
                    this.dialogUpPost = false;                   
                    
                })
                .catch(error => {
                    console.log(error);
                });
                alert("Post modifié");
                window.location.reload();
        },
        goDialogUpCom(comContent, comId){
            this.dataCom.id = comId;
            this.dataCom.content = comContent;
            this.dialogUpCom = true; 
        },
        updateCom(){
            this.dataCom.userId = localStorage.userId;
            this.dataComS = {id: this.dataCom.id, comContent: this.dataCom.content, userId:this.dataCom.userId,postId: this.postId};
            axios.put("http://localhost:3000/api/posts/comments/" + this.dataCom.id, this.dataComS, {headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let rep = JSON.parse(response.data);
                    console.log(rep.message);
                    this.dataCom.content = "";
                    this.dataCom.userId = "";
                    this.afficheFrmCm = false;
                    this.dialogUpCom = false;
                    
                })
                .catch(error => {
                    console.log(error);
                });
                alert("Commentaire modifié");
                window.location.reload();
        },
        afficheForm(){
            this.$router.push('/Accueil/Mur/Post')
        },
        afficheFormCom(){
            this.afficheFrmCm = true
        },
 
        likePost(postId, nbLikes){
            this.allLikes.forEach(element => {
                if(element.postId == postId && element.userId == localStorage.userId){
                    this.dataLike.nbLikes = nbLikes+-1;
                    this.dataLike.liked = true;
                }
            });
            if(this.dataLike.liked == false){
                this.dataLike.nbLikes = nbLikes+1;
            }
            this.dataLike.userId = localStorage.userId;
            this.dataLike.postId = postId;
            this.dataLikeS = JSON.stringify(this.dataLike);
            axios.post("http://localhost:3000/api/posts/" + postId + "/like", this.dataLikeS, {headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let rep = JSON.parse(response.data);
                    console.log(rep.message);
                    this.dataLike.liked = false;
                    
                })
                .catch(error => {
                    console.log(error);
                    this.dataLike.liked = false;
                });
                window.location.reload();
        },
    },
    components: {
        "top-header": TopHeader, 
    },
    mounted(){
        this.userId = localStorage.userId;
        
        axios.get("http://localhost:3000/api/posts", {headers: {Authorization: 'Bearer ' + localStorage.token}})
            .then(response => {
                let posts = JSON.parse(response.data);
                this.allPosts = posts;
            })
            .catch(error => {
            console.log(error); 
            });
        axios.get("http://localhost:3000/api/posts/likes", {headers: {Authorization: 'Bearer ' + localStorage.token}})
            .then(response =>{
                let likes = JSON.parse(response.data);
                this.allLikes = likes;
                
            })
            .catch(error => {
                console.log(error)
            });
        
    },
}
</script>
<style lang="scss">
    h1{
        text-align: center;
    }
    .mur{
        &__comments{
            &--ind{
                position: relative;
            }
        }
   }
   .ml-12 {
    //background-image: url('http://localhost:3000/images/bkg-blu.jpg');
    background-image: url('http://localhost:3000/images/icon.svg');
    background-repeat: round;
    background-attachment: fixed;
    width:100%;
    margin: auto;
    }
    img {
    border-style: none;
    width: 100%;
    
    }
    .container {
    width: 50%;
    padding: 0px;
    margin-right: auto;
    margin-left: auto;
    }
    @media screen and (max-width:768px) {
        .container {
        width: 100%;
        margin:0;
        }

        img {
            width: 100%;
        }
        
        .v-application .ma-3 {
            //margin: 0 !important;
            width: 80%;
            margin: auto; 
        }
    }
    .v-application .ml-12 {
    margin-left: 30px !important;
   
}
.v-card:not(.v-sheet--tile):not(.v-card--shaped) {
    border-radius: 20px 30px 20px 0px;
}
body, html {
    height: auto;
}
</style>