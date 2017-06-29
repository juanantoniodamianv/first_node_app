var express = require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;
//var session = require("express-session"); //Guarda en memoria, cada vez que se reinicia el servidor se pierde
var cookieSession = require("cookie-session");
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/session");
var formidable = require('express-formidable');
var mv = require("mv");

var methodOverride = require("method-override"); //middleware sirve para implementar metodos (http) que no implementa el navegador, como PUT y DELETE


var app = express();

// var mongoose = require("mongoose");
// var Schema = mongoose.Schema;

// mongoose.connect("mongodb://localhost/fotos");
// var userSchemaJSON = {
// 	email:String,
// 	password:String
// };

// var user_schema = new Schema(userSchemaJSON); //Se encarga de crear un objeto que mongoose entiende, estructura de la tabla
// var User = mongoose.model("User",user_schema);

app.use("/public",express.static('public')); //building middleware para servir archivos estáticos
//también puedo especificar la ruta para acceder a los archivos estaticos:
//app.use("/estatico",express.static('public'));
app.use(bodyParser.json()); //para leer o hacer parsing --> para peticiones que tengan el formato application/json
app.use(bodyParser.urlencoded({extended: true})); // si esta en false, no se pueden parsear arreglos, y parametros que no sean json..

/* /app */

/* / express-session */
// app.use(session({
// 	secret: "123byuhbsdah12ub",
// 	resave: false, //especifica que la sesion se vuelve a guardar por ,mas que no haya sido modificada
// 	saveUninitialized: true
// }));
app.use(methodOverride("_method"));

app.use(cookieSession({
	name: "session",
	keys: ["llave-1","llave-2"]
}));

app.use(formidable({ keepExtensions: true }));

app.set("view engine", "jade");

app.get("/",function(req,res){
	console.log(req.session.user_id);
	res.render("index");
});

app.get("/signup",function(req,res){
	User.find(function(err,doc){
		console.log(doc);
		res.render("signup");
	});
});

app.get("/login",function(req,res){
	res.render("login");
});

app.post("/users",function(req,res){
	// console.log("Contraseña: "+ req.body.password);
	// console.log("Email: "+ req.body.email);
	var user = new User({email: req.body.email, 
							password: req.body.password, 
							password_confirmation: req.body.password_confirmation,
							username: req.body.username
						});
	//mongoose primero guarda el objeto en la BD y luego ejecuta la funcion dentro de ella
	//function(err,user,numero) se le pueden pasar tres parametros, error, el objeto guardado y el numero de objetos guardados
	//el metodo save es asincrono
	user.save(function(err){
		if(err){
			console.log(String(err));
		}
		res.send("Guardando tus datos");
	});
	//Otra manera es usar promises (then)
	// user.save().then(function(us){
	// 	res.send("Guardado exitoso.");
	// },function(err){
	// 	console.log(String(err));
	// 	res.send("Error al guardar.");
	// });
});

app.post("/sessions",function(req,res){
	//query,params,callback
	User.findOne({email:req.body.email,password:req.body.password},function(err,user){
		console.log(user);
		req.session.user_id = user._id; //El id que mongodb asigna al usuario
		req.session.save();
		res.redirect("/app");
	});
});

app.use("/app",session_middleware);
app.use("/app",router_app);
app.listen(8080);