import { Planner } from '../models/index.js';

function createEmptyPlan() {
    return {
        year1: {
            fall: [],
            winter: [],
            spring: [],
            summer: [],
        },
        year2: {
            fall: [],
            winter: [],
            spring: [],
            summer: [],
        },
        year3: {
            fall: [],
            winter: [],
            spring: [],
            summer: [],
        },
        year4: {
            fall: [],
            winter: [],
            spring: [],
            summer: [],
        },
    };
}

function normalizePlanData(planData) {
    return planData && typeof planData === 'object' ? planData : createEmptyPlan();
}

export const listPlanners = async (req, res) => {
    try {
        const planners = await Planner.findAll({
            where: { userId: req.user.id },
            order: [
                ['position', 'ASC'],
                ['createdAt', 'ASC'],
            ],
        });

        res.status(200).json({
            status: 'Success',
            planners,
        });
    } catch (error) {
        console.error('List planners error:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Server error while loading planners',
        });
    }
};

export const getPlanner = async (req, res) => {
    try {
        const planner = await Planner.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });

        if (!planner) {
            return res.status(404).json({
                status: 'Error',
                message: 'Planner not found',
            });
        }

        res.status(200).json({
            status: 'Success',
            planner,
        });
    } catch (error) {
        console.error('Get planner error:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Server error while loading planner',
        });
    }
};

export const createPlanner = async (req, res) => {
    try {
        const { name, planData, position } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                status: 'Error',
                message: 'Planner name is required',
            });
        }

        const nextPosition =
            typeof position === 'number'
                ? position
                : await Planner.count({ where: { userId: req.user.id } });

        const planner = await Planner.create({
            userId: req.user.id,
            name: name.trim(),
            planData: normalizePlanData(planData),
            position: nextPosition,
        });

        res.status(201).json({
            status: 'Success',
            message: 'Planner created successfully',
            planner,
        });
    } catch (error) {
        console.error('Create planner error:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Server error while creating planner',
        });
    }
};

export const updatePlanner = async (req, res) => {
    try {
        const planner = await Planner.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });

        if (!planner) {
            return res.status(404).json({
                status: 'Error',
                message: 'Planner not found',
            });
        }

        const updates = {};
        const { name, planData, position } = req.body;

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    status: 'Error',
                    message: 'Planner name cannot be empty',
                });
            }
            updates.name = name.trim();
        }

        if (planData !== undefined) {
            updates.planData = normalizePlanData(planData);
        }

        if (position !== undefined) {
            if (!Number.isInteger(position) || position < 0) {
                return res.status(400).json({
                    status: 'Error',
                    message: 'Planner position must be a non-negative integer',
                });
            }
            updates.position = position;
        }

        await planner.update(updates);

        res.status(200).json({
            status: 'Success',
            message: 'Planner updated successfully',
            planner,
        });
    } catch (error) {
        console.error('Update planner error:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Server error while updating planner',
        });
    }
};

export const deletePlanner = async (req, res) => {
    try {
        const planner = await Planner.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });

        if (!planner) {
            return res.status(404).json({
                status: 'Error',
                message: 'Planner not found',
            });
        }

        await planner.destroy();

        res.status(200).json({
            status: 'Success',
            message: 'Planner deleted successfully',
        });
    } catch (error) {
        console.error('Delete planner error:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Server error while deleting planner',
        });
    }
};
