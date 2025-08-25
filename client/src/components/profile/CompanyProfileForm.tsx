"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CompanyProfileFormProps {
  companyData: any;
  onSave: (data: any) => Promise<void>;
  loading: boolean;
}

export function CompanyProfileForm({ companyData, onSave, loading }: CompanyProfileFormProps) {
  const [formData, setFormData] = useState(companyData);

  useEffect(() => {
    setFormData(companyData);
  }, [companyData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input id="name" name="name" value={formData?.name || ''} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData?.description || ''} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Company Email</Label>
              <Input id="email" name="email" type="email" value={formData?.email || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Company Phone</Label>
              <Input id="phone" name="phone" value={formData?.phone || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" value={formData?.website || ''} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locations">Locations (comma-separated)</Label>
            <Input id="locations" name="locations" value={Array.isArray(formData?.locations) ? formData.locations.join(', ') : ''} onChange={(e) => setFormData((prev: any) => ({ ...prev, locations: e.target.value.split(',').map(s => s.trim()) }))} />
          </div>
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
