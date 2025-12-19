import {GroupRepository} from "../repositories/GroupRepository.js";

export class GroupService {
    /**
     * Get all product groups.
     *
     * @returns {Promise<Model<any, TModelAttributes>[]>}
     */
    static async getAllGroups() {
        return GroupRepository.findAll();
    }

    /**
     * Create product group.
     *
     * @param data
     * @returns {Promise<CreateOptions<Attributes<Model>> extends ({returning: false} | {ignoreDuplicates: true}) ? void : Model<any, TModelAttributes>>}
     */
    static async createGroup(data) {
        return GroupRepository.create(data);
    }

    /**
     * Update product group.
     *
     * @param id
     * @param data
     * @returns {Promise<*|null>}
     */
    static async updateGroup(id, data) {
        const existing = await GroupRepository.findById(id);
        if (!existing) {
            return null;
        }
        return GroupRepository.update(id, data);
    }

    /**
     * Delete product group.
     *
     * @param id
     * @returns {Promise<boolean>}
     */
    static async deleteGroup(id) {
        return GroupRepository.delete(id);
    }
}