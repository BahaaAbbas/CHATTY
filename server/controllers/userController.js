const User = require('../model/userModel');
const bcrypt = require('bcrypt');


module.exports.register = async (req, res, next) => {

    try {



        const { username, email, password } = req.body;

        const usernameCheck = await User.findOne({ username });
        console.log("Registering user:", { username, email });

        if (usernameCheck) return res.json({ msg: 'Username Already used', status: false });

        const emailCheck = await User.findOne({ email });


        if (emailCheck) {
            console.log("Email already exists:", email);
            return res.json({ msg: "Email Already used", status: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        });


        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return res.json({ status: true, user: userWithoutPassword });
    } catch (ex) {
        next(ex);
    }
};

module.exports.login = async (req, res, next) => {

    try {



        const { username: email, password } = req.body;


        const user = await User.findOne({ email });



        if (!user) return res.json({ msg: 'Incorrect username or password', status: false });

        const isPasswordValid = await bcrypt.compare(password.trim(), user.password.trim());



        if (!isPasswordValid) return res.json({ msg: 'Incorrect username or password', status: false });

        delete user.password;

        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};


module.exports.setAvatar = async (req, res, next) => {

    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;

        console.log("Avatar Image:", avatarImage);  // Log to check received image
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        })

        return res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage })
    } catch (ex) {
        next(ex);
    }

}

module.exports.getAllUsers = async (req, res, next) => {

    try {

        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            'email',
            'username',
            'avatarImage',
            '_id'

        ]);

        return res.json(users);


    } catch (ex) {
        next(ex);
    }

}
