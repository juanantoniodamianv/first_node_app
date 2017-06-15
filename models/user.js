var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost/fotos");

/*
	String 
	Numbre
	Date
	Buffer
	Boolean
	Mixed
	Objectid
	Array
 */
var valores = ["M","F"]
var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Coloca un email válido."];
var user_schema = new Schema({
	name: {type: String},
	username: {type: String,required:true,maxlength:[50,"Nombre de usurio muy grande"]},
	password: {
		type: String,
		required:true,
		minlength:[4,"El password es muy corto"],
		validate: {
			validator: function(pass){
				return this.password_confirmation == pass;
			},
			message: "Las contraseñas no coinciden."
		}
	},
	age: {type: Number,min:[5,"La edad no puede ser menor que 5"],max:[100,"La edad no puede ser mayor que 100"]},
	email: {type: String,required: "El email es obligatorio",match:email_match},
	date_of_birth: {type: Date},
	sex: {type:String,enum:{values: valores, message: "Opcion no valida. Ingrese F o M."}}
});

user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
}).set(function(password){
	this.p_c = password;
})
//El primer parametro define el nombre de la colección (en plural)
var User = mongoose.model("User",user_schema);
module.exports.User = User;