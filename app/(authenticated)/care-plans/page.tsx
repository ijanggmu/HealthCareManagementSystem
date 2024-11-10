"use client"

import { useEffect, useState } from 'react'
import { getAllCarePlans, addCarePlan, updateCarePlan, deleteCarePlan } from './carePlanService' // Import the care plan service
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

interface CarePlan {
  id: number
  name: string
  client: string
  startDate: string
  endDate: string
}

const columns: ColumnDef<CarePlan>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "client",
    header: "Client",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
]

export default function CarePlansPage() {
  const [carePlans, setCarePlans] = useState<CarePlan[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentCarePlan, setCurrentCarePlan] = useState<CarePlan | null>(null)

  useEffect(() => {
    const fetchCarePlans = async () => {
      const params = { pageNumber: 0, pageSize: 10, query: '', filters: '', sorts: '' };
      const carePlansData = await getAllCarePlans(params);
      setCarePlans(carePlansData)
    }

    fetchCarePlans()
  }, [])

  const handleAddCarePlan = async (newCarePlan: Omit<CarePlan, 'id'>) => {
    const addedCarePlan = await addCarePlan(newCarePlan)
    setCarePlans((prev) => [...prev, addedCarePlan]) // Update care plan list
    setIsAddDialogOpen(false)
  }

  const handleEditCarePlan = async (updatedCarePlan: CarePlan) => {
    await updateCarePlan(updatedCarePlan.id, updatedCarePlan)
    setCarePlans((prev) => prev.map(cp => (cp.id === updatedCarePlan.id ? updatedCarePlan : cp))) // Update care plan list
    setIsEditDialogOpen(false)
  }

  const handleDeleteCarePlan = async (carePlanToDelete: CarePlan) => {
    await deleteCarePlan(carePlanToDelete.id)
    setCarePlans((prev) => prev.filter(cp => cp.id !== carePlanToDelete.id)) // Update care plan list
  }

  const CarePlanForm = ({ carePlan, onSubmit, onCancel }: { carePlan?: CarePlan, onSubmit: (carePlan: any) => void, onCancel: () => void }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(carePlan ? { ...carePlan, name: e.currentTarget.name, client: e.currentTarget.client.value, startDate: e.currentTarget.startDate.value, endDate: e.currentTarget.endDate.value } : { name: e.currentTarget.name, client: e.currentTarget.client.value, startDate: e.currentTarget.startDate.value, endDate: e.currentTarget.endDate.value }); }}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Name</Label>
          <Input id="name" defaultValue={carePlan?.name} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="client" className="text-right">Client</Label>
          <Input id="client" defaultValue={carePlan?.client} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startDate" className="text-right">Start Date</Label>
          <Input id="startDate" type="date" defaultValue={carePlan?.startDate} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="endDate" className="text-right">End Date</Label>
          <Input id="endDate" type="date" defaultValue={carePlan?.endDate} className="col-span-3" />
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
        <h1 className="text-3xl font-bold">Care Plans</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Care Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Care Plan</DialogTitle>
            </DialogHeader>
            <CarePlanForm onSubmit={handleAddCarePlan} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable 
        columns={columns} 
        data={carePlans} 
        onRowClick={(carePlan) => console.log('View care plan', carePlan)}
        onEdit={(carePlan) => { setCurrentCarePlan(carePlan); setIsEditDialogOpen(true); }}
        onDelete={handleDeleteCarePlan}
      />
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Care Plan</DialogTitle>
          </DialogHeader>
          {currentCarePlan && (
            <CarePlanForm 
              carePlan={currentCarePlan} 
              onSubmit={handleEditCarePlan} 
              onCancel={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}