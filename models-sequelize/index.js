import { sequelize } from '../database/postgresConnection.js';
import User from './User.js';
import Process from './Process.js';
import Task from './Task.js';
import FormOne from './FormOne.js';
import FormTwo from './FormTwo.js';
import FormThree from './FormThree.js';
import FormFour from './FormFour.js';
import FormFive from './FormFive.js';
import FormSix from './FormSix.js';
import FormSeven from './FormSeven.js';
import FormEight from './FormEight.js';
import FormNine from './FormNine.js';
import FormTen from './FormTen.js';
import FormEleven from './FormEleven.js';
import FormTwelve from './FormTwelve.js';
import FormThirteen from './FormThirteen.js';
import FormFourteen from './FormFourteen.js';
import FormFifteen from './FormFifteen.js';
import FormSixteen from './FormSixteen.js';
import FormSeventeen from './FormSeventeen.js';
import FormEighteen from './FormEighteen.js';
import FormNineteen from './FormNineteen.js';
import FormTwenty from './FormTwenty.js';
import FormTwentyOne from './FormTwentyOne.js';
import FormTwentyTwo from './FormTwentyTwo.js';
import FormTwentyThree from './FormTwentyThree.js';
import FormTwentyFour from './FormTwentyFour.js';
import FormTwentyFive from './FormTwentyFive.js';
import FormTwentySix from './FormTwentySix.js';

// Define relationships
User.hasMany(Process, { foreignKey: 'surveyorId', as: 'processes' });
Process.belongsTo(User, { foreignKey: 'surveyorId', as: 'surveyor' });

User.hasMany(Task, { foreignKey: 'assignedTo', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

Task.hasMany(Process, { foreignKey: 'taskId', as: 'processes' });
Process.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

// Form relationships
Process.belongsTo(FormOne, { foreignKey: 'formOneId', as: 'formOne' });
Process.belongsTo(FormTwo, { foreignKey: 'formTwoId', as: 'formTwo' });
// Add more form relationships as needed

const models = {
  User,
  Process,
  Task,
  FormOne,
  FormTwo,
  FormThree,
  FormFour,
  FormFive,
  FormSix,
  FormSeven,
  FormEight,
  FormNine,
  FormTen,
  FormEleven,
  FormTwelve,
  FormThirteen,
  FormFourteen,
  FormFifteen,
  FormSixteen,
  FormSeventeen,
  FormEighteen,
  FormNineteen,
  FormTwenty,
  FormTwentyOne,
  FormTwentyTwo,
  FormTwentyThree,
  FormTwentyFour,
  FormTwentyFive,
  FormTwentySix,
};

// Sync all models (optional - can be controlled via environment)
const syncModels = async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ All Sequelize models synced successfully');
    }
  } catch (error) {
    console.error('❌ Error syncing models:', error);
  }
};

export { sequelize, syncModels };
export default models;