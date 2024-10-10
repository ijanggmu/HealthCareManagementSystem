"use client"

import { useEffect, useState } from 'react'
import { getAllStaff, addStaff, updateStaff, deleteStaff } from '@/api/service/staffService'; // Import the service functions
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

interface Staff {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  phoneNumber: string
  password: string
  confirmPassword: string
  username: string
}

const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "contactInf",
    header: "Email",
  },
]

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null)

  useEffect(() => {
    // Fetch staff with default parameters
    const fetchStaff = async () => {
      const params = { pageNumber: 0, pageSize: 10, query: '', filters: '', sorts: '' };
      const staff = await getAllStaff(params);
      setStaffList(staff);
    };

    fetchStaff();
  }, []);

  const handleAddStaff = async (newStaff: Omit<Staff, 'id'>) => {
    const staffToAdd = { ...newStaff, userName: newStaff.username };
    const addedStaff = await addStaff(staffToAdd);
    setStaffList((prev) => [...prev, { ...addedStaff, userName: staffToAdd.userName }]);
    setIsAddDialogOpen(false);
  };

  const handleEditStaff = async (updatedStaff: Staff) => {
    await updateStaff(updatedStaff.id, updatedStaff);
    setStaffList((prev) => prev.map(s => (s.id === updatedStaff.id ? updatedStaff : s))); // Update staff list
    setIsEditDialogOpen(false);
  };

  const handleDeleteStaff = async (staffToDelete: Staff) => {
    await deleteStaff(staffToDelete.id);
    setStaffList((prev) => prev.filter(s => s.id !== staffToDelete.id)); // Update staff list
  };

  const StaffForm = ({ staffMember, onSubmit, onCancel }: { staffMember?: Staff, onSubmit: (staff: any) => void, onCancel: () => void }) => (
    <form onSubmit={(e) => { e.preventDefault(); 
    onSubmit({ ...staffMember, firstName: e.currentTarget.firstName.value, lastName: e.currentTarget.lastName.value, email: e.currentTarget.email.value, username: e.currentTarget.username.value, phoneNumber: e.currentTarget.phoneNumber.value, password: e.currentTarget.password.value, confirmPassword: e.currentTarget.confirmPassword.value }); }}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="firstName" className="text-right">First Name</Label>
          <Input id="firstName" defaultValue={staffMember?.firstName} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="lastName" className="text-right">Last Name</Label>
          <Input id="lastName" defaultValue={staffMember?.lastName} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">Email</Label>
          <Input id="email" defaultValue={staffMember?.email} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">Username</Label>
          <Input id="username" defaultValue={staffMember?.username} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phoneNumber" className="text-right">Phone Number</Label>
          <Input id="phoneNumber" defaultValue={staffMember?.phoneNumber} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">Password</Label>
          <Input id="password" type="password" defaultValue={staffMember?.password} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="confirmPassword" className="text-right">Confirm Password</Label>
          <Input id="confirmPassword" type = "password"defaultValue={staffMember?.confirmPassword} className="col-span-3" />
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
        <h1 className="text-3xl font-bold">Staff</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff</DialogTitle>
            </DialogHeader>
            <StaffForm onSubmit={handleAddStaff} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable 
        columns={columns} 
        data={staffList} 
        onRowClick={(staffMember) => console.log('View staff', staffMember)}
        onEdit={(staffMember) => { setCurrentStaff(staffMember); setIsEditDialogOpen(true); }}
        onDelete={handleDeleteStaff}
      />
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff</DialogTitle>
          </DialogHeader>
          {currentStaff && (
            <StaffForm 
              staffMember={currentStaff} 
              onSubmit={handleEditStaff} 
              onCancel={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}