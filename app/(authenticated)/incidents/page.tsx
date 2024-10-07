"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle } from 'lucide-react'
import { DataTable } from '@/components/data-table'
import { ColumnDef } from '@tanstack/react-table'

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
  {
    id: "actions",
    cell: ({ row }) => {
      const incident = row.original
      return (
        <Button variant="outline" size="sm" onClick={() => console.log('View incident', incident)}>
          View
        </Button>
      )
    },
  },
]

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([
    { id: 1, description: "Fall in bathroom", client: "John Doe", date: "2023-05-15", status: "Open" },
    { id: 2, description: "Medication error", client: "Jane Smith", date: "2023-06-02", status: "Closed" },
  ])

  const addIncident = () => {
    const newIncident: Incident = {
      id: incidents.length + 1,
      description: `New Incident ${incidents.length + 1}`,
      client: "New Client",
      date: new Date().toISOString().split('T')[0],
      status: "Open",
    }
    setIncidents([...incidents, newIncident])
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Incidents</h1>
        <Button onClick={addIncident}>
          <PlusCircle className="mr-2 h-4 w-4" /> Report Incident
        </Button>
      </div>
      <DataTable columns={columns} data={incidents} />
    </div>
  )
}