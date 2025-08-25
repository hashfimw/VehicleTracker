import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { ResponseUtil } from "../utils/response.util";
import { CreateUserRequest, UpdateUserRequest } from "../types/user.types";
import { PaginationQuery } from "../types/common.types";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserRequest = req.body;
      const user = await this.userService.createUser(userData);

      ResponseUtil.success(res, user, "User created successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pagination: PaginationQuery = req.query;
      const result = await this.userService.getUsers(pagination);

      ResponseUtil.successWithPagination(
        res,
        result.users,
        result.pagination,
        "Users retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id ?? "");
      const user = await this.userService.getUserById(id);

      ResponseUtil.success(res, user, "User retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id ?? "");
      const userData: UpdateUserRequest = req.body;
      const user = await this.userService.updateUser(id, userData);

      ResponseUtil.success(res, user, "User updated successfully");
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id ?? "");
      await this.userService.deleteUser(id);

      ResponseUtil.success(res, null, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
