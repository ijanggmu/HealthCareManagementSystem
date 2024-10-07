"use client"

import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Username:</strong> {user?.username}</p>
          {/* Add more user information here */}
        </CardContent>
      </Card>
    </div>
  );
}