const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODBFORDEV,{
useNewUrlParser:true
//useCreateIndex:true

})
