import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common";
import { useUpdateUser } from "@/hooks";
import { UpdateUserRequest, UserResponse } from "@/types";

const updateUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .optional()
    .or(z.string().min(6, "Password must be at least 6 characters")),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  role: z.enum(["admin", "user"]),
});

interface EditUserDialogProps {
  user: UserResponse;
  open: boolean;
  onClose: () => void;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  user,
  open,
  onClose,
}) => {
  const updateUserMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateUserRequest & { password?: string }>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    if (user && open) {
      setValue("fullName", user.full_name);
      setValue("email", user.email);
      setValue("role", user.role);
      setValue("password", "");
    }
  }, [user, open, setValue]);

  const onSubmit = async (data: UpdateUserRequest & { password?: string }) => {
    try {
      const updateData = { ...data };
      if (!updateData.password || updateData.password.trim() === "") {
        delete updateData.password;
      }

      await updateUserMutation.mutateAsync({
        id: user.id,
        data: updateData,
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...register("fullName")}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">
                Password
                <span className="text-sm text-gray-500 ml-1">
                  (Leave empty to keep current password)
                </span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password..."
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                {...register("role")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Updating...
                  </div>
                ) : (
                  "Update User"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
