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
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210" },
  ])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentClient, setCurrentClient] = useState<Client | null>(null)

  const addClient = (newClient: Omit<Client, 'id'>) => {
    const clientWithId = { ...newClient, id: clients.length + 1 }
    setClients([...clients, clientWithId])
    setIsAddDialogOpen(false)
  }

  const editClient = (updatedClient: Client) => {
    setClients(clients.map(client => client.id === updatedClient.id ? updatedClient : client))
    setIsEditDialogOpen(false)
  }

  const deleteClient = (clientToDelete: Client) => {
    setClients(clients.filter(client => client.id !== clientToDelete.id))
  }

  const ClientForm = ({ client, onSubmit, onCancel }: { client?: Client, onSubmit: (client: any) => void, onCancel: () => void }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(client ? { ...client, name: e.currentTarget.name.value, email: e.currentTarget.email.value, phone: e.currentTarget.phone.value } : { name: e.currentTarget.name.value, email: e.currentTarget.email.value, phone: e.currentTarget.phone.value }); }}>
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
            <ClientForm onSubmit={addClient} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable 
        columns={columns} 
        data={clients} 
        onRowClick={(client) => console.log('View client', client)}
        onEdit={(client) => { setCurrentClient(client); setIsEditDialogOpen(true); }}
        onDelete={deleteClient}
      />
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          {currentClient && (
            <ClientForm 
              client={currentClient} 
              onSubmit={editClient} 
              onCancel={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}