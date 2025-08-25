import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DataTable, SearchInput } from "@/components/common";
import { useUsers, useDeleteUser } from "@/hooks";
import { UserResponse } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { DEFAULT_PAGINATION } from "@/lib/constants";
import { CreateUserDialog } from "./create-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";

export const UsersPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);

  const { data: usersData, isLoading } = useUsers({
    page,
    limit: DEFAULT_PAGINATION.limit,
  });

  const deleteUserMutation = useDeleteUser();

  const users = usersData?.users || [];
  const pagination = usersData?.pagination;

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserMutation.mutateAsync(userId);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const columns = [
    {
      key: "fullName" as keyof UserResponse,
      header: "Name",
      render: (value: string, user: UserResponse) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      ),
    },
    {
      key: "role" as keyof UserResponse,
      header: "Role",
      render: (value: string) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === "admin"
              ? "bg-purple-100 text-purple-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "created_at" as keyof UserResponse,
      header: "Created At",
      render: (value: Date) => formatDateTime(value),
    },
    {
      key: "id" as keyof UserResponse,
      header: "Actions",
      render: (_: any, user: UserResponse) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingUser(user)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteUser(user.id)}
            disabled={deleteUserMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage system users and permissions</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search users..."
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={users}
            columns={columns}
            loading={isLoading}
            pagination={
              pagination
                ? {
                    currentPage: pagination.page,
                    totalPages: pagination.totalPages,
                    onPageChange: setPage,
                  }
                : undefined
            }
            emptyMessage="No users found"
          />
        </CardContent>
      </Card>

      {/* Create User Dialog - You would implement this with a modal/dialog */}
      {showCreateDialog && (
        <CreateUserDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
        />
      )}

      {/* Edit User Dialog */}
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
};
