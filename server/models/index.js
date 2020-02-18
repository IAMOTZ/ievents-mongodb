import mongoose from 'mongoose';
import config from '../config/config';

// Import models
import users from './users';
import events from './events';
import centers from './centers';

const env = process.env.NODE_ENV || 'development';
const presentConfg = config[env];

mongoose.connect(presentConfg.dbUrl);

const db = {};
db.mongoose = mongoose;

db.User = users(mongoose);
db.Event = events(mongoose);
db.Center = centers(mongoose);

export default db;
