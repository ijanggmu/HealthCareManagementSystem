"use client"

import { useEffect, useState } from 'react'
import { getAllClients, addClient, updateClient, deleteClient } from '@/api/service/clientService'; // Import the client service
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

interface Client {
  id: number
  name: string
  email: string
  phone: string
}

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
]

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentClient, setCurrentClient] = useState<Client | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
            const params = { pageNumber: 0, pageSize: 10, query: '', filters: '', sorts: '' };
      const clientsData = await getAllClients(params);
      setClients(clientsData);
    };

    fetchClients();
  }, []);

  const handleAddClient = async (newClient: Omit<Client, 'id'>) => {
    const addedClient = await addClient(newClient);
    setClients((prev) => [...prev, addedClient]); // Update client list
    setIsAddDialogOpen(false);
  };

  const handleEditClient = async (updatedClient: Client) => {
    await updateClient(updatedClient.id, updatedClient);
    setClients((prev) => prev.map(client => (client.id === updatedClient.id ? updatedClient : client))); // Update client list
    setIsEditDialogOpen(false);
  };

  const handleDeleteClient = async (clientToDelete: Client) => {
    await deleteClient(clientToDelete.id);
    setClients((prev) => prev.filter(client => client.id !== clientToDelete.id)); // Update client list
  };

  const ClientForm = ({ client, onSubmit, onCancel }: { client?: Client, onSubmit: (client: any) => void, onCancel: () => void }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(client ? { ...client, name: e.currentTarget.name, email: e.currentTarget.email.value, phone: e.currentTarget.phone.value } : { name: e.currentTarget.name, email: e.currentTarget.email.value, phone: e.currentTarget.phone.value }); }}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Name</Label>
          <Input id="name" defaultValue={client?.name} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">Email</Label>
          <Input id="email" defaultValue={client?.email} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phone" className="text-right">Phone</Label>
          <Input id="phone" defaultValue={client?.phone} className="col-span-3" />
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
        <h1 className="text-3xl font-bold">Clients</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <ClientForm onSubmit={handleAddClient} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable 
        columns={columns} 
        data={clients} 
        onRowClick={(client) => console.log('View client', client)}
        onEdit={(client) => { setCurrentClient(client); setIsEditDialogOpen(true); }}
        onDelete={handleDeleteClient}
      />
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          {currentClient && (
            <ClientForm 
              client={currentClient} 
              onSubmit={handleEditClient} 
              onCancel={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}