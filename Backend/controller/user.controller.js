import User from "../model/user.model.js";
import bcryptjs from "bcryptjs"

const signup =async (req,res) => {

    try {
        const {fullname,email,password} = req.body;
        const user =await User.findOne({email})
        if(user){
            return res.status(400).json({message : "User Already Exists"});
        }

        const hashPassword =await bcryptjs.hash(password,10);

        const createuser = new User({
            fullname : fullname,
            email : email,
            password : hashPassword
        })

        await createuser.save();
        res.status(201).json({message : "User Created successfully",user : {
            _id : createuser._id,
            fullname : createuser.fullname,
            email : createuser.email 
        }});
    } catch (error) {
        console.log("Error" + error.message);
        res.status(500).json({message : "Interval server error"});
    }

}

const login =async (req,res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        const isMatch =await bcryptjs.compare(password,user.password) //user.password=user password that fill in the form
        if(!user || !isMatch){
            return res.status(400).json({message : "Invalid username or password"});

        }
        else{
            res.status(200).json({
                message : "Login successfully",
                user : {
                    _id : user._id,
                    fullname : user.fullname,
                    email : user.email
            }});
        }
    } catch (error) {
        console.log("Error" ,error.message);
        res.status(500).json({message : "Interval server error"});
    }
}

export { signup, login };