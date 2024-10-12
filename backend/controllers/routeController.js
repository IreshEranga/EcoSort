const Route = require('../models/routeModel');

// Create a new route
const createRoute = async (req, res) => {
  try {
    const { routeName, routes, assignedDriver, date , city} = req.body;

    const newRoute = new Route({
      routeName,
      routes,
      assignedDriver,
      date,
      city // assuming date is passed as a string in the format 'YYYY-MM-DD'
    });

    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    res.status(500).json({ error: 'Error creating the route' });
  }
};

// Get all routes
const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate('assignedDriver');
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving routes' });
  }
};

// Get a route by ID
const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate('assignedDriver');
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving the route' });
  }
};

// Update a route by ID
const updateRoute = async (req, res) => {
  try {
    const { routeName, routes, assignedDriver, date } = req.body;

    const updatedRoute = await Route.findByIdAndUpdate(
      req.params.id,
      {
        routeName,
        routes,
        assignedDriver,
        date, // assuming date is passed as a string in the format 'YYYY-MM-DD'
      },
      { new: true }
    ).populate('assignedDriver');

    if (!updatedRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.status(200).json(updatedRoute);
  } catch (error) {
    res.status(500).json({ error: 'Error updating the route' });
  }
};

// Delete a route by ID
const deleteRoute = async (req, res) => {
  try {
    const deletedRoute = await Route.findByIdAndDelete(req.params.id);
    if (!deletedRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the route' });
  }
};

module.exports = {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
};
