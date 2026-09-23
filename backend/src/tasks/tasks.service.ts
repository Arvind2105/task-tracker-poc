import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async findAll(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async create(
    userId: string,
    createDto: { title: string; description?: string },
  ): Promise<Task> {
    const newTask = new this.taskModel({
      ...createDto,
      userId: new Types.ObjectId(userId),
    });
    return newTask.save();
  }

  async update(
    userId: string,
    taskId: string,
    updateDto: { title?: string; description?: string; completed?: boolean },
  ): Promise<Task> {
    const task = await this.taskModel.findOneAndUpdate(
      { _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(userId) },
      updateDto,
      { new: true },
    );
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async remove(userId: string, taskId: string): Promise<void> {
    const result = await this.taskModel.deleteOne({
      _id: new Types.ObjectId(taskId),
      userId: new Types.ObjectId(userId),
    });
    if (result.deletedCount === 0)
      throw new NotFoundException('Task not found');
  }
}
