import { DataTypes } from 'sequelize';
import { sequelize } from '../database/postgresConnection.js';

const Process = sequelize.define('Process', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tasks',
      key: 'id',
    },
  },
  surveyorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  formType: {
    type: DataTypes.ENUM(
      'formOne', 'formTwo', 'formThree', 'formFour', 'formFive',
      'formSix', 'formSeven', 'formEight', 'formNine', 'formTen',
      'formEleven', 'formTwelve', 'formThirteen', 'formFourteen',
      'formFifteen', 'formSixteen', 'formSeventeen', 'formEighteen',
      'formNineteen', 'formTwenty', 'formTwentyOne', 'formTwentyTwo',
      'formTwentyThree', 'formTwentyFour', 'formTwentyFive', 'formTwentySix'
    ),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  formOneId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'form_ones',
      key: 'id',
    },
  },
  formTwoId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'form_twos',
      key: 'id',
    },
  },
  // Add other form references as needed
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'processes',
  timestamps: true,
});

export default Process;