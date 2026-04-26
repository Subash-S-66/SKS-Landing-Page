const Service = require('../models/Service');

const getServices = async (req, res) => {
  try {
    const filter = req.user ? {} : { visible: true }; // Admin sees all, public sees visible
    const services = await Service.find(filter).sort('order');
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getServices, createService, updateService, deleteService };
