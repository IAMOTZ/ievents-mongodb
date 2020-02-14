export default (mongoose) => {
  const { Schema } = mongoose;
  const centersSchema = new Schema({
    id: {
      type: mongoose.ObjectId,
    },
    name: {
      type: String,
      allowNull: false,
      index: true,
    },
    location: {
      type: String,
    },
    details: {
      type: String,
    },
    capacity: {
      type: Number,
    },
    price: {
      type: mongoose.Types.Decimal128,
    },
    images: {
      type: [String],
    },
  });
  return mongoose.model('centers', centersSchema);
};
