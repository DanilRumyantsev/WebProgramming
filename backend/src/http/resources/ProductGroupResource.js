export class ProductGroupResource {
    constructor(group) {
        this.group = group;
    }

    toArray() {
        return {
            id: this.group.id,
            name: this.group.name,
            created_at: this.group.createdAt ? this.group.createdAt.toISOString() : null,
            updated_at: this.group.updatedAt ? this.group.updatedAt.toISOString() : null,
        };
    }
}