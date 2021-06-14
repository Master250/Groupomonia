<template>
    <v-app id="formPost">
        <top-header/>
        <h1 class="ml-12">Post Panel</h1>
        <v-card class="ma-3 ml-12" v-if="userId=true">
            
            <v-card-title class="mb-3">
                <h2>Nouveau post </h2>
            </v-card-title>
            
            <v-card-text>
                <v-form ref="form" class="ma-3" v-model="valid" enctype="multipart/form-data">
                    <div class="loader" v-if="loading">
                        <span class="helper"></span>
                        <img class="loaderImg" src="../../assets/ajax-loader.gif" alt="load" />
                    </div>
                    <v-text-field v-model="dataPost.title" :rules="titleRules" :counter="50" label="Title" autofocus required></v-text-field>
                    <input type="file" accept="image/*" @change="onChange" name="file" label="Image" :rules="imageRules" required />
                    <v-img v-if="dataPost.imageUrl" :src="dataPost.imageUrl" alt="imageForm"  ></v-img>
                    <v-textarea v-model="dataPost.content" :rules="contentRules" label="Content" required></v-textarea>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-btn  :disabled="!valid" class="success" @click="sendPost">Poster</v-btn>
            </v-card-actions>
        </v-card>
    </v-app>
</template>
<script>
import axios from "axios"
import TopHeader from "./TopHeader"


export default {
    name: "FormPost",
    data(){
        return{
            loading:false,
            token:"",
            valid: true,
            titleRules: [
                v => !!v || 'Title is required',
                v => (v && v.length <= 50) || 'Title must be less than 50 characters',

            ],
            contentRules: [
                v => !!v || 'Content is required',
            ],
            imageRules:[
                v => !!v || 'Image is required',
            ],
            dataPost:{
                title: "",
                content:"",
                image: null,
                imageUrl: null,
                userId: localStorage.userId
            },
            dataPostS: "",
            msg: false,
            message: "",
        }
    },
    methods: {
        
        onChange(e) {
            console.log(e.target.files);
            const file = e.target.files[0]
            this.dataPost.image = file
            this.dataPost.imageUrl = URL.createObjectURL(file)
        },
        sendPost(){
            
            this.loading = true;
            this.token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append('image', this.dataPost.image);
            formData.append('content', this.dataPost.content);
            formData.append('title', this.dataPost.title);
            formData.append('userId', this.dataPost.userId);
            
            axios.post("http://localhost:3000/api/posts/", formData, {headers: {'Content-Type': 'multipart/form-data', Authorization: 'Bearer ' + this.token}})
                .then(response => {
                    
                    let rep = JSON.parse(response.data);
                    this.message = rep.message;
                    this.msg = true;
                    this.form = false;
                    
                })
                .catch(error => {
                    console.log(error); 
                    this.message = error;
                    this.msg = true
                })
                .finally(() => {
                    this.loading = false;
                    this.$router.push('/Accueil/Mur')
                });
        },
    },
    components: {
        "top-header": TopHeader, 
        
    },
}
</script>
<style lang="scss">


</style>