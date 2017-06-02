const bcrypt = require('bcryptjs');

const PasswordCrypt = {
    create: (password) => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    },

    compare: (password, hash) => {
        return bcrypt.compareSync(password, hash);
    }
};

module.exports = PasswordCrypt;
