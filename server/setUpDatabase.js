// import db from './models-2/index';
import db from './models';
import { createSuperAdmin } from './commonHelpers';

const { User } = db;

createSuperAdmin(User).then(() => {
  process.exit();
});

