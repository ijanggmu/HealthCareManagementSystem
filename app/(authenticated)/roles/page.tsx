"use client"

import { useEffect, useState } from 'react'
import { getAllRoles, addRole, updateRole, deleteRole, Role } from "./roleService" // Import the Role service
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle } from 'lucide-react'
import { DataTable } from '@/components/data-table'
import { ColumnDef } from '@tanstack/react-table'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"


const columns: ColumnDef<Role>[] = [
    {
        accessorKey: "roleName",
        header: "Name",
    },
    {
        accessorKey: "roleDescription",
        header: "Description",
    },
    {
        accessorKey: "roleType",
        header: "Role Type",
    },
]

export default function rolesPage() {
    const [roles, setroles] = useState<Role[]>([])
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [currentRole, setCurrentRole] = useState<Role | null>(null)

    useEffect(() => {
        const fetchroles = async () => {
            const params = { pageNumber: 0, pageSize: 10, query: '', filters: '', sorts: '' };
            const rolesData = await getAllRoles(params);
            setroles(rolesData);
        };

        fetchroles();
    }, []);

    const handleAddRole = async (newRole: Omit<Role, 'id'>) => {
        const addedRole = await addRole(newRole);
        setroles((prev) => [...prev, addedRole]); // Update Role list
        setIsAddDialogOpen(false);
    };

    const handleEditRole = async (updatedRole: Role) => {
        await updateRole(updatedRole.id, updatedRole);
        setroles((prev) => prev.map(Role => (Role.id === updatedRole.id ? updatedRole : Role))); // Update Role list
        setIsEditDialogOpen(false);
    };

    const handleDeleteRole = async (RoleToDelete: Role) => {
        await deleteRole(RoleToDelete.id);
        setroles((prev) => prev.filter(Role => Role.id !== RoleToDelete.id)); // Update Role list
    };

    const RoleForm = ({ Role, onSubmit, onCancel }: { Role?: Role, onSubmit: (Role: any) => void, onCancel: () => void }) => (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(Role ? { ...Role, name: e.currentTarget.name, description: e.currentTarget.description.value, roleType: e.currentTarget.roleType.value } : { name: e.currentTarget.name, description: e.currentTarget.discription.value, phone: e.currentTarget.roleType.value }); }}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" defaultValue={Role?.name} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Input id="description" defaultValue={Role?.description} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="roleType" className="text-right">RoleType</Label>
                    <Input id="roleType" defaultValue={Role?.roleType} className="col-span-3" />
                </div>
            </div>
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save</Button>
            </div>
        </form>
    )

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Roles</h1>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Roles</DialogTitle>
                        </DialogHeader>
                        <RoleForm onSubmit={handleAddRole} onCancel={() => setIsAddDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
            <DataTable
                columns={columns}
                data={roles}
                onRowClick={(Role) => console.log('View Role', Role)}
                onEdit={(Role) => { setCurrentRole(Role); setIsEditDialogOpen(true); }}
                onDelete={handleDeleteRole}
            />
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Roles</DialogTitle>
                    </DialogHeader>
                    {currentRole && (
                        <RoleForm
                            Role={currentRole}
                            onSubmit={handleEditRole}
                            onCancel={() => setIsEditDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}