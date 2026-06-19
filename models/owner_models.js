const mongoose = require('mongoose')


const ownerSchema = mongoose.Schema({
    fullname : {
        type: String,
        minLenght: 3,
        trim: true,
    } ,
    email : String ,
    password : String ,
    
    isadmin : Boolean,
    products:{
        type: Array,
        default :[],
    },
    
    picture : String ,
})


module.exports =mongoose.model("owner",ownerSchema);
