<template>
    <div id="profil" class="d-flex justify-center" >
        <top-header/>
        <v-card class="ma-12" min-width="300px" flat v-if="userId=true">
            <v-card-title class="my-3" >
                <h1>Mon profil</h1>
            </v-card-title>
            <v-avatar>
             <img  :src="dataGet.avatar" alt="avatarProf">
            </v-avatar>
            <v-card-text class="ml-2">
                <p>Prénom : {{ dataGet.firstName }}</p>
                <p>Nom : {{ dataGet.lastName }}</p>
                <p>Email : {{ dataGet.email }}</p>
            </v-card-text>

            <v-card-actions class="d-flex justify-space-between">
                <v-btn @click.stop="dialogUp=true, goDialogProfil(dataGet.avatar, dataGet.firstName, dataGet.lastName, dataGet.email, dataGet.id)" title="modifier mes informations" class="ui blue">Modifier</v-btn>
                <v-btn @click.stop="dialogDelete=true" title="supprimer mon profil" class="ui red">Supprimer</v-btn>
            </v-card-actions>
        </v-card>

        <v-dialog persistent v-model="dialogUp" max-width="600px" v-if="userId">
            <v-card>
                <v-card-title>Modifier mon profil</v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="valid">
                        <input type="file" accept="image/*" @change="onChange"  name="file" required/>
                        <v-img v-if="dataUp.avatarUrl" :src="dataUp.avatarUrl" alt="avatarPof"></v-img>
                        <v-text-field v-model="dataUp.firstName" :rules="nameRules" label="Prénom" prepend-icon="mdi-account-circle" required></v-text-field>
                        <v-text-field  v-model="dataUp.lastName" :rules="nameRules" label="Nom" prepend-icon="mdi-account-circle" required></v-text-field>
                        <v-text-field v-model="dataUp.email" :rules="emailRules" label="e-mail" prepend-icon="mdi-at" required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn text @click="dialogUp=false" class="ui brown">Annuler</v-btn>
                    <v-btn text :disabled="!valid" @click="updateUser" class="ui blue-grey">Valider</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="350px" >
            <v-card>
                <v-card-title>
                    Êtes-vous sûr.e ?
                </v-card-title>
                <v-card-text>
                    <p>En supprimant votre profil, vous effacerez aussi tous vos posts ainsi que vos commentaires.</p>
                    <p>{{ msg }}</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialogDelete=false">
                        Annuler
                    </v-btn>
                    <v-btn text @click="deleteUser">
                        Supprimer mon profil
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import TopHeader from "./TopHeader"
import axios from "axios"

export default {
    name: "Profil",
    data() {
        return{
            token:"",
            dialogUpPost:false,
            dialogDelete: false,
            dialogUp: false,
            msg: "",
            dataGet: { 
                id:"",
                firstName: "",
                lastName: "",
                email: "",
                avatar:null,
                avatarUrl:null,
            },
            dataUp: {
                firstName: "",
                lastName: "",
                email: "",
                avatar: null,
                avatarUrl: null
            },
            dataUpS: "",
            valid: true,
            nameRules: [
                v => !!v || 'Nom requis',
            ],
            emailRules: [
                v => !!v || 'E-mail requis',
                v => /.+@.+\..+/.test(v) || 'E-mail invalide',
            ],
            
        }
    },
    methods: {
        deleteUser() {
            
            axios.delete("http://localhost:3000/api/auth/", {headers: {Authorization: 'Bearer ' + localStorage.token}})
            .then(response => {
                let data = JSON.parse(response.data);
                console.log(data);
                localStorage.userId = "";
                localStorage.token = "";  
            })
            .catch(error => {
                console.log(error);
                this.msg = error  
            });
            localStorage.clear();
            this.$router.push('/');
        },
        goDialogProfil(userAvatar, userFirstname, userLastname, userEmail, userId){
            this.dataGet.id = userId;
            this.dataGet.email = userEmail;
            this.dataUp.firstName = userFirstname;
            this.dataUp.lastName = userLastname;
            this.dataUp.avatarUrl = userAvatar;
            this.goDialogProfil = true;
        },
        onChange(e) {
            console.log(e.target.files);
            const file = e.target.files[0]
            this.dataUp.avatar = file
            this.dataUp.avatarUrl = URL.createObjectURL(file)
        },
        updateUser() {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem("token");
            let formData = new FormData();
            formData.append('avatar',this.dataUp.avatar);
            formData.append('firstName',this.dataUp.firstName);
            formData.append('lastName' ,this.dataUp.lastName);
            formData.append('email',this.dataUp.email);
            formData.append('userId', userId);
            
            axios.put("http://localhost:3000/api/auth/"+ userId,formData, {headers: {'Content-Type': 'multipart/form-data', Authorization: 'Bearer ' + token}})
            .then(response => {
                let data = JSON.parse(response.data);
                console.log(data);
                this.dialogUp = false;
                
            })
            .catch(error => {
                console.log(error);
                this.msg = error  
            });
            this.$router.push('/Accueil/Mur');
        }
    },
    mounted() { 
        axios.get("http://localhost:3000/api/auth/", {headers: {Authorization: 'Bearer ' + localStorage.token}})
            .then(response => {
                
                let profil = JSON.parse(response.data);
                this.dataGet.id = profil[0].id;
                this.dataGet.email = profil[0].email;
                this.dataGet.firstName = profil[0].firstName;
                this.dataGet.lastName = profil[0].lastName;
                this.dataGet.avatar = profil[0].avatar;
                this.dataUp.email = profil[0].email;
                this.dataUp.firstName = profil[0].firstName;
                this.dataUp.lastName = profil[0].lastName;
                this.dataUp.avatar = profil[0].avatar;
            })
            .catch(error => {
                console.log(error);
            }); 
        
    },
    
    
    components: {
        "top-header": TopHeader,

    },
    
}
</script>

<style lang="scss">

#profil {
    background-image: url('http://localhost:3000/images/icon.svg');
    background-repeat: round;
    background-attachment: fixed;
    width:100%;
    margin: auto;
    }

</style>