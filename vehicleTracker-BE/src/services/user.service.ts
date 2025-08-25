import { UserRepository } from "../repositories/user.repository";
import { PasswordUtil } from "../utils/password.util";
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from "../types/user.types";
import { PaginationQuery, PaginationMeta } from "../types/common.types";
import { AppError } from "../middlewares/error.middleware";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    const hashedPassword = await PasswordUtil.hash(userData.password);
    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return newUser;
  }

  async getUserById(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async getUsers(pagination: PaginationQuery): Promise<{
    users: UserResponse[];
    pagination: PaginationMeta;
  }> {
    const { page = 1, limit = 10 } = pagination;
    const { users, total } = await this.userRepository.findAll({ page, limit });

    const paginationMeta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return { users, pagination: paginationMeta };
  }

  async updateUser(
    id: number,
    userData: UpdateUserRequest
  ): Promise<UserResponse> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new AppError("User not found", 404);
    }

    if (userData.email) {
      const userWithEmail = await this.userRepository.findByEmail(
        userData.email
      );
      if (userWithEmail && userWithEmail.id !== id) {
        throw new AppError("Email is already taken by another user", 409);
      }
    }

    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) {
      throw new AppError("Failed to update user", 500);
    }

    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new AppError("User not found", 404);
    }
  }
}
