const { Role, Class } = require('../models');

const getClasses = async (req, res) => {
  try {
    const data = await Class.findAll({ attributes: ['id', 'name'] });
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No classes found' });
    }
    return res.json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Failed to fetch classes', details: err.message });
  }
};

const getRoles = async (req, res) => {   
  try {
    const data = await Role.findAll({ attributes: ['id', 'name'] });
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No roles found' });
    }
    return res.json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Failed to fetch roles', details: err.message });
  }
};

module.exports = {
  getClasses,
  getRoles,
};
