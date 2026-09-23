import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@UseGuards(AuthenticatedGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() req) {
    return this.tasksService.findAll(req.user._id.toString());
  }

  @Post()
  create(@Req() req, @Body() body: { title: string; description?: string }) {
    return this.tasksService.create(req.user._id.toString(), body);
  }

  @Put(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; completed?: boolean },
  ) {
    return this.tasksService.update(req.user._id.toString(), id, body);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.tasksService.remove(req.user._id.toString(), id);
  }
}
