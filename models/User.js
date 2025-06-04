const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        require: [true, "Le nom de l'utilisateur est requis"],
        unique:true
    },
    email: {
        type: String,
        require: [true, "L'adresse email est requis"],
        unique:true,
        match: [/.+@.+\..+/, 'veuillez entrer un email valide']
    },
    phone: {
        type: String,
        require: [true, "Le numéro de téléphone est requis"]
    },
    adress: {
        type: String,
        require: [true, "L'adresse est requis"]
    },
    password: {
        type: String,
        require: [true, "Le mot de passe est requis"],
        minlength : [6, 'Le mot de passe doit contenir au moins 6 caractère']
    },
    createAt : {
        type: Date,
        default : Date.now
    }

})

//middleware mongo pour hacher le mot de passe avant de le sauvegarder
UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
       return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

//methode pour comparer les mots de passe
UserSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

module.exports = mongoose.model('User', UserSchema);