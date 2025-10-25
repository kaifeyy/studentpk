import { Request, Response } from 'express';
import { BoardsService } from '../services/boards.service';
import { ApiResponse } from '../utils/apiResponse';

export class BoardsController {
  static async getAllBoards(req: Request, res: Response) {
    try {
      const boards = await BoardsService.getAllBoards();
      return new ApiResponse(res, 200, { boards }).send();
    } catch (error) {
      return new ApiResponse(res, 500, {
        message: 'Failed to fetch education boards',
      }).send();
    }
  }

  static async getBoardsByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      
      if (!type || !['matric', 'o_level', 'both'].includes(type)) {
        return new ApiResponse(res, 400, {
          message: 'Invalid board type. Must be "matric", "o_level", or "both"',
        }).send();
      }

      const boards = await BoardsService.getBoardsByType(type as 'matric' | 'o_level' | 'both');
      return new ApiResponse(res, 200, { boards }).send();
    } catch (error) {
      return new ApiResponse(res, 500, {
        message: 'Failed to fetch education boards',
      }).send();
    }
  }

  static async getBoardsByProvince(req: Request, res: Response) {
    try {
      const { province } = req.params;
      
      if (!province) {
        return new ApiResponse(res, 400, {
          message: 'Province is required',
        }).send();
      }

      const boards = await BoardsService.getBoardsByProvince(province);
      return new ApiResponse(res, 200, { boards }).send();
    } catch (error) {
      return new ApiResponse(res, 500, {
        message: 'Failed to fetch education boards',
      }).send();
    }
  }

  static async getBoardById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return new ApiResponse(res, 400, {
          message: 'Board ID is required',
        }).send();
      }

      const board = await BoardsService.getBoardById(id);
      
      if (!board) {
        return new ApiResponse(res, 404, {
          message: 'Education board not found',
        }).send();
      }

      return new ApiResponse(res, 200, { board }).send();
    } catch (error) {
      return new ApiResponse(res, 500, {
        message: 'Failed to fetch education board',
      }).send();
    }
  }

  static async getSubjectGroups(req: Request, res: Response) {
    try {
      const { type } = req.params;
      
      if (!type || !['matric', 'o_level'].includes(type)) {
        return new ApiResponse(res, 400, {
          message: 'Invalid education type. Must be "matric" or "o_level"',
        }).send();
      }

      const subjectGroups = await BoardsService.getSubjectGroups(type as 'matric' | 'o_level');
      return new ApiResponse(res, 200, { subjectGroups }).send();
    } catch (error) {
      return new ApiResponse(res, 500, {
        message: 'Failed to fetch subject groups',
      }).send();
    }
  }

  static async getGradeLevels(req: Request, res: Response) {
    try {
      const { type } = req.params;
      
      if (!type || !['matric', 'o_level'].includes(type)) {
        return new ApiResponse(res, 400, {
          message: 'Invalid education type. Must be "matric" or "o_level"',
        }).send();
      }

      const gradeLevels = await BoardsService.getGradeLevels(type as 'matric' | 'o_level');
      return new ApiResponse(res, 200, { gradeLevels }).send();
    } catch (error) {
      return new ApiResponse(res, 500, {
        message: 'Failed to fetch grade levels',
      }).send();
    }
  }

  static async getAllSubjects(req: Request, res: Response) {
    try {
      const { type } = req.params;
      
      if (!type || !['matric', 'o_level'].includes(type)) {
        return new ApiResponse(res, 400, {
          message: 'Invalid education type. Must be "matric" or "o_level"',
        }).send();
      }

      const subjects = await BoardsService.getAllSubjects(type as 'matric' | 'o_level');
      return new ApiResponse(res, 200, { subjects }).send();
    } catch (error) {
      return new ApiResponse(res, 500, {
        message: 'Failed to fetch subjects',
      }).send();
    }
  }
}
