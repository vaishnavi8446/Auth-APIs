const express = require('express');
const app = express();
const mongoose = require('mongoose');
let bcypt = require('bcryptjs');
// let jwtToken=require('../codingRound/services/token');

app.use(express.json());
mongoose.connect("mongodb://localhost:27017/Users",{
        useNewUrlParser:true
    },(err)=>{
        if(!err){
            console.log("Connected");
        }
        else{
            console.log("Error");
        }
    })
    

//create user schema
const usersSc ={
    userId: String,
    name:String,
    email:String,
    password:String,
    dob:Date,
    isAdmin:Boolean,
    createdAt:Date,
    updatedAt:Date

}

//modeling of schema
const userModel = mongoose.model("users",usersSc);

//create UserDocument schema
const userDocument ={
    userId: String,
    name:String,
    documentId:String

}

//modeling of UserDocument schema
const userDocumentModel = mongoose.model("userDocument",userDocument);

//create forgot schema
const forgotSc ={
    requestId: String,
    OTP :String,
    createdAt:Date

}

//modeling of UserDocument schema
const forgotModel = mongoose.model("forgotPwd",forgotSc);



//1.Working
app.post('/auth/register', async(req,res) =>{
    let now= new Date().getTime();
    try{
        const registerObj = new userModel({
            userId: req.body.userId,
            name: req.body.name,
            email: req.body.email,
            password:req.body.password,
            dob: req.body.dob,
            isAdmin: req.body.isAdmin,
            createdAt: now,
            updatedAt: now

        });
        registerObj.save(function(err,data){
            if(err){
                console.log(err);
            }
            else{
                res.send({
                    status:200,
                    msg:"Successfully registered!",
                    result:data
                })
            }
        })
    }
    catch(err){
        console.log(err)
    }
}
)

//2.Not Working
app.post('/auth/login', async(req,res) =>{
    try{
        let email= req.body.email;
        let password = req.body.password;
        let user = userModel.findOne({email});
        if(!user){
            throw new Error('User does not exist');
        }
        const isMatched = bcypt.compare(password,user.password);
        if(!isMatched){
            return res.status(401).json({
                message:"invalid credentials!",
                status_code:401
            })
        }
        // let token = await jwtToken.getToken(obj);
      
        res.send({
                    status:200,
                    msg:"Successfully login!"
                })
       
    }
    catch(err){
        console.log(err)
    }
}
)

//not working- now was not intialize also otp initialize in capital
app.post('/forgotRegister', async(req,res) =>{
    let now= new Date().getTime();
    try{
        const registerObj = new forgotModel({
            requestId: req.body.requestId,
            otp: req.body.otp,
            createdAt: new Date(now)

        });
        registerObj.save(function(err,data){
            if(err){
                console.log(err);
            }
            else{
                res.send({
                    status:200,
                    msg:"Successfully registered!",
                    result:data
                })
            }
        })
    }
    catch(err){
        console.log(err)
    }
}
)

//3.working but will not work bcoz of forgotRegister
app.post('auth/forgotpassword',async(req,res) =>{
    try{
    let requestId= req.body.requestId;
    let request = forgotModel.findOne({requestId});
    if(!request){
        throw new Error('Request does not exist');
    }
    let otp = req.body.otp;

    if(!otp){
        return res.status(401).json({
            message:"Please enter the otp",
            status_code:401
        })
    }
    const userFilter = {
        requestId:requestId
    };
    const updateOtp ={
        otp:otp
    }
    await forgotModel.findOneAndUpdate(userFilter,updateOtp);

    res.send({
        status:200,
        msg:"Successfully updated"
    })
    }
    catch(err){
        console.log(err)
    }

})

//4.
app.post('/auth/forgotpasswwordconfirm',async(req,res) =>{
    try{
        let email= req.body.email;
        let userEmail = userModel.findOne({email});
        if(!userEmail){
            throw new Error('User does not exist');
        }
        let newPassword = req.body.newPassword;
    
        if(!newPassword){
            return res.status(401).json({
                message:"Please enter new password",
                status_code:401
            })
        }
        const userFilter = {
            email:userEmail
        };
        const updatePwd ={
            password:newPassword
        }
        await userModel.findOneAndUpdate(userFilter,updatePwd);
    
        res.send({
            status:200,
            msg:"Successfully updated",
            userEmail: userEmail
        })
        }
        catch(err){
            console.log(err);
        }
})

//5.Working
app.get('/users',async(req,res) =>{
    try{
        userModel.find(function(err,data){
            if(err){
                console.log(err);
            }
            else{
                res.send({
                    status:200,
                    msg:"Successfully updated",
                    count:data.length,
                    result:data
                })
            }
        }).skip(1).limit(2);
    }
    catch(err){
        console.log(err);
    }
})

//9.working
app.post('/register', async(req,res) =>{
    try{
        const registerObj = new userDocumentModel({
            userId: req.body.userId,
            name: req.body.name,
            documentId: req.body.documentId

        });
        registerObj.save(function(err,data){
            if(err){
                console.log(err);
            }
            else{
                res.send({
                    status:200,
                    msg:"Successfully registered!",
                    result:data
                })
            }
        })
    }
    catch(err){
        console.log(err)
    }
}
)

//6.Working
app.get('/users/:userId',async(req,res) =>{
    try{
        let userId = req.params.userId;
        userDocumentModel.findOne({userId:userId},function(err,data){
            if(err){
                console.log(err);
            }
            else{
                res.send({
                        status:200,
                        msg:"Successfully fetch user with userId",
                        result:data
                    })
                }
        })
    }
    catch(err){
        console.log(err);
    }
})

//7-Not working
app.post('/userUpdate',async(req,res) =>{
    try{
        let userId = req.body.userId;
        let newVal = {$set:{name:"Vaishnavi",email:"vaishu@gmail.com"}}
        userModel.findByIdAndUpdate({userId,newVal},function(err,data){
            if(err){
                console.log(err);
            }
            else{
                res.send({
                        status:200,
                        msg:"Successfully updated user details",
                        result:data
                    })
                }
        })
    }
    catch(err){
        console.log(err);
    }
})

//8.Working

app.get('/user/:documentId',async(req,res) =>{
    try{
        let documentId = req.params.documentId;
        console.log(documentId)
        userDocumentModel.findOne({documentId:documentId},function(err,data){
            if(err){
                console.log(err);
            }
            else{
                res.send({
                        status:200,
                        msg:"Successfully fetch user with provided documentId",
                        result:data
                    })
                }
        })
    }
    catch(err){
        console.log(err);
    }
})

app.listen(3000,()=>{
    console.log("Port running on 3000");
})