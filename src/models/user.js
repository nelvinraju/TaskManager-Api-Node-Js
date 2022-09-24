const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Wrong email')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value <0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:4,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password contains password ')
            }
        }
    },
    avatar:{
        type:Buffer
    }
    ,tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
})

// this is for adding a refernce to the tasks cretaed by user (frogien key relation only a virtual not saved in db)
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

// for exposing public visible data
userSchema.methods.toJSON = function(){

    const user =this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject

}

// to generate jwt tokens
userSchema.methods.generateAuthToken = async function() {

    const user = this
    const token = jwt.sign({_id:user._id.toString()},'thisismynewcode')
    user.tokens =user.tokens.concat({token:token})
    await user.save()
    return token
}

// for login verification
userSchema.statics.findByCredentials = async (email , password) =>{
    const user = await User.findOne({email:email})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password , user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

// password hashing

userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){

    user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

// delete user tasks when user is removed

userSchema.pre('remove', async function(next){

    const user= this
    await Task.deleteMany({ owner:user._id})
    next()
})


const User= mongoose.model('User',userSchema)

module.exports=User