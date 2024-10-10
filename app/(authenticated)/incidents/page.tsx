"use client"

import { useEffect, useState } from 'react'
import { getAllIncidents, addIncident, updateIncident, deleteIncident } from '@/api/service/incidentService'; // Import the incident service
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

interface Incident {
  id: number
  description: string
  client: string
  date: string
  status: string
}

const columns: ColumnDef<Incident>[] = [
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "client",
    header: "Client",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentIncident, setCurrentIncident] = useState<Incident | null>(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      const params = { pageNumber: 0, pageSize: 10, query: '', filters: '', sorts: '' };
      const incidentsData = await getAllIncidents(params);
      setIncidents(incidentsData);
    };

    fetchIncidents();
  }, []);

  const handleAddIncident = async (newIncident: Omit<Incident, 'id'>) => {
    const addedIncident = await addIncident(newIncident);
    setIncidents((prev) => [...prev, addedIncident]); // Update incident list
    setIsAddDialogOpen(false);
  };

  const handleEditIncident = async (updatedIncident: Incident) => {
    await updateIncident(updatedIncident.id, updatedIncident);
    setIncidents((prev) => prev.map(i => (i.id === updatedIncident.id ? updatedIncident : i))); // Update incident list
    setIsEditDialogOpen(false);
  };

  const handleDeleteIncident = async (incidentToDelete: Incident) => {
    await deleteIncident(incidentToDelete.id);
    setIncidents((prev) => prev.filter(i => i.id !== incidentToDelete.id)); // Update incident list
  };

  const IncidentForm = ({ incident, onSubmit, onCancel }: { incident?: Incident, onSubmit: (incident: Omit<Incident, 'id'>) => void, onCancel: () => void }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(incident ? { ...incident, description: e.currentTarget.description.value, client: e.currentTarget.client.value, date: e.currentTarget.date.value, status: e.currentTarget.status.value } : { description: e.currentTarget.description.value, client: e.currentTarget.client.value, date: e.currentTarget.date.value, status: e.currentTarget.status.value }); }}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">Description</Label>
          <Input id="description" defaultValue={incident?.description} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="client" className="text-right">Client</Label>
          <Input id="client" defaultValue={incident?.client} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">Date</Label>
          <Input id="date" type="date" defaultValue={incident?.date} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">Status</Label>
          <Input id="status" defaultValue={incident?.status} className="col-span-3" />
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Incidents</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Report Incident
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Incident</DialogTitle>
            </DialogHeader>
            <IncidentForm onSubmit={handleAddIncident} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable 
        columns={columns} 
        data={incidents} 
        onRowClick={(incident) => console.log('View incident', incident)}
        onEdit={(incident) => { setCurrentIncident(incident); setIsEditDialogOpen(true); }}
        onDelete={handleDeleteIncident}
      />
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Incident</DialogTitle>
          </DialogHeader>
          {currentIncident && (
            <IncidentForm 
              incident={currentIncident} 
              onSubmit={(updatedIncident) => handleEditIncident({ ...updatedIncident, id: currentIncident.id })} 
              onCancel={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}