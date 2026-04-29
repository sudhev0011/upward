import { Category } from "../../../domain/entities/category.entity";
import { CategoryDocument } from "../../persistence/mongodb/models/category.model";

export class CategoryMapper {
  static toEntity(doc: CategoryDocument): Category {
    return Category.create({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description ?? null,
      mode: doc.mode,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  static toDocument(entity: Partial<Category>): Partial<CategoryDocument> {
    const doc: Partial<CategoryDocument> = {};

    if (entity.name !== undefined) doc.name = entity.name;
    if (entity.description !== undefined) doc.description = entity.description;
    if (entity.mode !== undefined) doc.mode = entity.mode;
    if (entity.isActive !== undefined) doc.isActive = entity.isActive;

    return doc;
  }
}