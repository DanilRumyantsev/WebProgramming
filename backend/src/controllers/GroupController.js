import {GroupRepository} from "../repositories/GroupRepository.js";
import {GroupService} from "../services/GroupService.js";

export class GroupController {
    /**
     * Get all product groups.
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    static async getAll(req, res) {
        try {
            const groups = await GroupRepository.findAll();
            return res.json({
                groups: groups.map(g => ({
                    id: g.id,
                    name: g.name,
                    created_at: g.createdAt ? g.createdAt.toISOString() : null,
                    updated_at: g.updatedAt ? g.updatedAt.toISOString() : null,
                })),
            });
        } catch (err) {
            console.error('[GROUP LIST ERROR]', err);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    /**
     * Create product group.
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    static async create(req, res) {
        try {
            const errors = {};

            if (!req.body.name || typeof req.body.name !== 'string') {
                errors.name = 'The name field is required.';
            } else {
                const name = req.body.name.trim();
                if (name === '') {
                    errors.name = 'The name must be a non-empty string.';
                } else if (name.length > 100) {
                    errors.name = 'The name must not be greater than 100 characters.';
                } else {
                    req.body.name = name;
                }
            }

            if (Object.keys(errors).length > 0) {
                const error = new Error('Validation failed');
                error.status = 422;
                error.errors = errors;
                throw error;
            }

            const group = await GroupService.createGroup(req.body);

            return res.status(201).json({
                id: group.id,
                name: group.name,
                created_at: group.createdAt.toISOString(),
                updated_at: group.updatedAt.toISOString(),
            });
        } catch (err) {
            if (err.status === 422) {
                return res.status(422).json({
                    message: 'The given data was invalid.',
                    errors: err.errors,
                });
            }

            if (err.name === 'SequelizeUniqueConstraintError' ||
                (err.parent && err.parent.code === 'ER_DUP_ENTRY')) {
                return res.status(409).json({
                    message: 'The group name has already been taken.',
                    errors: {name: ['The group name has already been taken.']},
                });
            }

            console.error('[GROUP CREATE ERROR]', err);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    /**
     * Update product group.
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    static async update(req, res) {
        try {
            const {id} = req.params;
            const groupId = Number(id);
            if (isNaN(groupId) || groupId <= 0) {
                return res.status(400).json({message: 'Invalid group ID'});
            }

            const errors = {};
            if (req.body.name != null) {
                if (typeof req.body.name !== 'string') {
                    errors.name = 'The name must be a string.';
                } else {
                    const name = req.body.name.trim();
                    if (name === '') {
                        errors.name = 'The name must be a non-empty string.';
                    } else if (name.length > 100) {
                        errors.name = 'The name must not be greater than 100 characters.';
                    } else {
                        req.body.name = name;
                    }
                }
            }

            if (Object.keys(errors).length > 0) {
                const error = new Error('Validation failed');
                error.status = 422;
                error.errors = errors;
                throw error;
            }

            const group = await GroupService.updateGroup(groupId, req.body);
            if (!group) {
                return res.status(404).json({message: 'Group not found'});
            }

            return res.json({
                id: group.id,
                name: group.name,
                created_at: group.createdAt.toISOString(),
                updated_at: group.updatedAt.toISOString(),
            });
        } catch (err) {
            if (err.status === 422) {
                return res.status(422).json({
                    message: 'The given data was invalid.',
                    errors: err.errors,
                });
            }

            if (err.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({
                    message: 'The group name has already been taken.',
                    errors: {name: ['The group name has already been taken.']},
                });
            }

            console.error('[GROUP UPDATE ERROR]', err);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    /**
     * Delete product group.
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    static async delete(req, res) {
        try {
            const {id} = req.params;
            const groupId = Number(id);
            if (isNaN(groupId) || groupId <= 0) {
                return res.status(400).json({message: 'Invalid group ID'});
            }

            const deleted = await GroupService.deleteGroup(groupId);
            if (!deleted) {
                return res.status(404).json({message: 'Group not found'});
            }

            return res.status(204).send();
        } catch (err) {
            console.error('[GROUP DELETE ERROR]', err);
            return res.status(500).json({message: 'Internal server error'});
        }
    }
}