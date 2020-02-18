export default (mongoose) => {
  const { Schema } = mongoose;
  const eventsSchema = new Schema({
    id: { type: mongoose.ObjectId },
    title: { type: String },
    description: { type: String },
    date: { type: String },
    status: {
      type: String,
      enum: ['allowed', 'canceled', 'done'],
      default: 'allowed',
    },
    centerId: { type: mongoose.ObjectId, ref: 'centers', },
    centerName: { type: String },
    userId: { type: mongoose.ObjectId, ref: 'users' },
  });
  return mongoose.model('events', eventsSchema);
};
