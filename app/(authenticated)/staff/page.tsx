"use client"

import { useState } from 'react'
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
  id: number
  name: string
  email: string
  role: string
}

const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
]

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Nurse" },
    { id: 2, name: "Bob Williams", email: "bob@example.com", role: "Doctor" },
  ])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null)

  const addStaff = (newStaff: Omit<Staff, 'id'>) => {
    const staffWithId = { ...newStaff, id: staff.length + 1 }
    setStaff([...staff, staffWithId])
    setIsAddDialogOpen(false)
  }

  const editStaff = (updatedStaff: Staff) => {
    setStaff(staff.map(s => s.id === updatedStaff.id ? updatedStaff : s))
    setIsEditDialogOpen(false)
  }

  const deleteStaff = (staffToDelete: Staff) => {
    setStaff(staff.filter(s => s.id !== staffToDelete.id))
  }

  const StaffForm = ({ staffMember, onSubmit, onCancel }: { staffMember?: Staff, onSubmit: (staff: any) => void, onCancel: () => void }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(staffMember ? { ...staffMember, name: e.currentTarget.name, email: e.currentTarget.email.value, role: e.currentTarget.role } : { name: e.currentTarget.name, email: e.currentTarget.email.value, role: e.currentTarget.role }); }}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Name</Label>
          <Input id="name" defaultValue={staffMember?.name} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">Email</Label>
          <Input id="email" defaultValue={staffMember?.email} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="role" className="text-right">Role</Label>
          <Input id="role" defaultValue={staffMember?.role} className="col-span-3" />
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
            <StaffForm onSubmit={addStaff} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable 
        columns={columns} 
        data={staff} 
        onRowClick={(staffMember) => console.log('View staff', staffMember)}
        onEdit={(staffMember) => { setCurrentStaff(staffMember); setIsEditDialogOpen(true); }}
        onDelete={deleteStaff}
      />
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff</DialogTitle>
          </DialogHeader>
          {currentStaff && (
            <StaffForm 
              staffMember={currentStaff} 
              onSubmit={editStaff} 
              onCancel={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}