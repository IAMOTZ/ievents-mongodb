import bcrypt from 'bcryptjs';

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export default (mongoose) => {
  const { Schema } = mongoose;
  const usersSchema = new Schema({
    id: { type: mongoose.ObjectId },
    name: { type: String },
    email: {
      type: String,
      lowercase: true,
      unique: true,
    },
    password: { type: String, },
    role: {
      type: String,
      eun: ['user', 'admin', 'superAdmin'],
      default: 'user',
    },
  });
  // eslint-disable-next-line func-names
  usersSchema.pre('save', function (next) {
    if (this.isModified('password')) {
      this.password = hashPassword(this.password);
    }
    next();
  });
  return mongoose.model('users', usersSchema);
};
