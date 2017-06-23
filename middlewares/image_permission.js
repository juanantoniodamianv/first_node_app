var Imagen = require("../models/imagenes");
module.exports = function(image,req,res){
	//True = tienes permisos
	if(req.method === "GET" && req.path.indexOf("edit") < 0){
		return true;
	}
	if(image.creator._id.toString() == 	res.locals.user._id){
		return true;
	}

	return false;
}