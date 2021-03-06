/*jslint node: true */
'use strict';

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcrypt-nodejs'),
      authTypes = ['facebook', 'google'];

let userSchema = new Schema({
    name: {
        familyName: {type: String, required: true},
        givenName: {type: String, required: true},
        middleName: {type: String}
    },
    email: {type: String, required: true, index: {unique: true}},
    picture: String,
    //local
    password: String,
    //oauth
    providers: [{name: String, id: String, token: String}], //provider name, user id and accestoken
}),

isprovider = providers => providers.some(provider => authTypes.indexof(provider) !== -1);

//search fields
userSchema.index({email: 'text', 'name.familyName': 'text', 'name.givenName': 'text'});

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, null, null, (err, hash) => {
            if (err) return next(err);
            this.password = hash;
            return next();
        });
    }
    else {
        if (!this.isNew) return next();
        if ((this.password && this.password.length) || (this.providers && isprovider(this.providers))) return next();
        next(new Error('invalid password'));
    }
});

userSchema.methods.authenticate = function (plaintext, cb) {
    bcrypt.compare(plaintext, this.password, cb);
};

module.exports = mongoose.model('users', userSchema);

