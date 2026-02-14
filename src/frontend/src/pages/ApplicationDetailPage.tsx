import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetApplicationById } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatTimestamp, formatApplicationNumber } from '../lib/formatters';

export default function ApplicationDetailPage() {
  const navigate = useNavigate();
  const { applicationNumber } = useParams({ from: '/application/$applicationNumber' });
  const applicationNumberInt = parseInt(applicationNumber, 10);

  const { data: application, isLoading, error } = useGetApplicationById(applicationNumberInt);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate({ to: '/my-applications' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Button>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate({ to: '/my-applications' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error ? 'Failed to load application details.' : 'Application not found.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const genderMap: Record<number, string> = {
    0: 'Male',
    1: 'Female',
    2: 'Other',
  };

  const nationalityMap: Record<number, string> = {
    0: 'Indian',
    1: 'Other',
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate({ to: '/my-applications' })} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Applications
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{formatApplicationNumber(application.applicationNumber)}</CardTitle>
              <CardDescription>Submitted on {formatTimestamp(application.created)}</CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3" />
              Submitted
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="font-medium">{application.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date of Birth</p>
                <p className="font-medium">{application.dateOfBirth}</p>
              </div>
            </div>
            <Separator />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gender</p>
                <p className="font-medium">{genderMap[application.gender] || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Place of Birth</p>
                <p className="font-medium">{application.placeOfBirth}</p>
              </div>
            </div>
            <Separator />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nationality</p>
                <p className="font-medium">{nationalityMap[application.nationality] || 'Not specified'}</p>
              </div>
              {application.maritalStatus && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Marital Status</p>
                  <p className="font-medium capitalize">{application.maritalStatus}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mobile Number</p>
                <p className="font-medium">{application.phoneNumber}</p>
              </div>
              {application.email && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                  <p className="font-medium">{application.email}</p>
                </div>
              )}
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">ID Number</p>
              <p className="font-medium">{application.idNumber}</p>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Permanent Address</p>
              <p className="font-medium">{application.address}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Residential Address</p>
              <p className="font-medium">{application.currentAddress}</p>
            </div>
            <Separator />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Start of Residency</p>
                <p className="font-medium">{application.startOfResidency}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Property Owner</p>
                <p className="font-medium">{application.propertyOwner}</p>
              </div>
            </div>
            <Separator />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Relation to Landlord</p>
                <p className="font-medium">{application.relationToLandlord}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Homeowner Status</p>
                <p className="font-medium">{application.isHomeowner ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Profession/Occupation</p>
              <p className="font-medium">{application.profession}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Workplace Address</p>
              <p className="font-medium">{application.professionAddress}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Workplace Phone</p>
              <p className="font-medium">{application.professionPhone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Vehicle Ownership</p>
                <p className="font-medium">{application.hasVehicle ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Contract Renewal</p>
                <p className="font-medium">{application.isContractRenewal ? 'Yes' : 'No'}</p>
              </div>
            </div>
            {application.previousResidenceCertNumber && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Previous Certificate Number</p>
                  <p className="font-medium">{application.previousResidenceCertNumber}</p>
                </div>
              </>
            )}
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Number of Previous Applications</p>
              <p className="font-medium">{application.previousApplications}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
