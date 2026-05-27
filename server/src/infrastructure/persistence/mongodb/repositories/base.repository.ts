import {
  Model,
  Document as MongooseDocument,
  QueryFilter,
  Types,
} from "mongoose";

import { CreateInput } from "../../../../domain/types/common.types";

import { ITransactionContext } from "../../../../domain/interfaces/database/transaction-context.interface";
import { MongoSessionUtil } from "../helper/mongo-session.utils";

export abstract class RepositoryBase<T, TDocument extends MongooseDocument> {
  constructor(protected model: Model<TDocument>) {}

  async create(
    data: CreateInput<T>,
    transaction?: ITransactionContext,
  ): Promise<T> {
    const session = MongoSessionUtil.getSession(transaction);

    const documentData = this.mapToDocument(data as Partial<T>);

    const document = new this.model({
      ...documentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedDocument = await document.save({
      session,
    });

    return this.mapToEntity(savedDocument);
  }

  async findById(
    id: string,
    transaction?: ITransactionContext,
  ): Promise<T | null> {
    const session = MongoSessionUtil.getSession(transaction);

    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const document = await this.model.findById(id).session(session || null);

    return document ? this.mapToEntity(document) : null;
  }

  async update(
    id: string,
    data: Partial<T>,
    transaction?: ITransactionContext,
  ): Promise<T | null> {
    const session = MongoSessionUtil.getSession(transaction);

    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const documentData = this.mapToDocument(data);

    const document = await this.model.findByIdAndUpdate(
      id,
      {
        ...documentData,
        updatedAt: new Date(),
      },
      {
        new: true,
        session,
      },
    );

    return document ? this.mapToEntity(document) : null;
  }

  async delete(
    id: string,
    transaction?: ITransactionContext,
  ): Promise<boolean> {
    const session = MongoSessionUtil.getSession(transaction);

    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await this.model.findByIdAndDelete(id, {
      session,
    });

    return result !== null;
  }

  async findOne(
    filter: QueryFilter<TDocument> | Record<string, unknown>,

    transaction?: ITransactionContext,
  ): Promise<T | null> {
    const session = MongoSessionUtil.getSession(transaction);

    const document = await this.model
      .findOne(filter as QueryFilter<TDocument>)
      .session(session || null);

    return document ? this.mapToEntity(document) : null;
  }

  async findMany(
    filter: QueryFilter<TDocument> | Record<string, unknown>,

    transaction?: ITransactionContext,
  ): Promise<T[]> {
    const session = MongoSessionUtil.getSession(transaction);

    const documents = await this.model
      .find(filter as QueryFilter<TDocument>)
      .session(session || null);

    return documents.map((doc) => this.mapToEntity(doc));
  }

  async countDocuments(
    filter: QueryFilter<TDocument> | Record<string, unknown>,

    transaction?: ITransactionContext,
  ): Promise<number> {
    const session = MongoSessionUtil.getSession(transaction);

    return await this.model
      .countDocuments(filter as QueryFilter<TDocument>)
      .session(session || null);
  }

  async paginate(
    filter: QueryFilter<TDocument> | Record<string, unknown> = {},

    options: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},

    transaction?: ITransactionContext,
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const session = MongoSessionUtil.getSession(transaction);

    const page = options.page || 1;

    const limit = options.limit || 10;

    const sortBy = options.sortBy || "createdAt";

    const sortOrder = options.sortOrder === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const documents = await this.model
      .find(filter as QueryFilter<TDocument>)
      .session(session || null)
      .collation({
        locale: "en",
        strength: 2,
      })
      .sort({
        [sortBy]: sortOrder,
      })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.model
      .countDocuments(filter as QueryFilter<TDocument>)
      .session(session || null);

    const data = documents.map((doc) => this.mapToEntity(doc));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  protected abstract mapToEntity(document: TDocument): T;

  protected abstract mapToDocument(entity: Partial<T>): Partial<TDocument>;
}
