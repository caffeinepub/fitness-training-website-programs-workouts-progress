import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetOwnApplications } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertCircle, ChevronRight } from 'lucide-react';
import { formatTimestamp, formatApplicationNumber } from '../lib/formatters';
import RequireLoginNotice from '../components/RequireLoginNotice';

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: applications, isLoading, error } = useGetOwnApplications();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
          <p className="text-muted-foreground">View and track your submitted applications</p>
        </div>
        <RequireLoginNotice />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
          <p className="text-muted-foreground">View and track your submitted applications</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
          <p className="text-muted-foreground">View and track your submitted applications</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load applications. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const sortedApplications = applications
    ? [...applications].sort((a, b) => Number(b.created - a.created))
    : [];

  if (!applications || applications.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
          <p className="text-muted-foreground">View and track your submitted applications</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Applications Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              You haven't submitted any applications yet. Start by applying for a residential certificate.
            </p>
            <Button onClick={() => navigate({ to: '/' })}>Apply for Certificate</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
        <p className="text-muted-foreground">
          You have {applications.length} {applications.length === 1 ? 'application' : 'applications'}
        </p>
      </div>

      <div className="space-y-4">
        {sortedApplications.map((application) => (
          <Card
            key={application.applicationNumber}
            className="hover:border-primary transition-colors cursor-pointer"
            onClick={() =>
              navigate({
                to: '/application/$applicationNumber',
                params: { applicationNumber: application.applicationNumber.toString() },
              })
            }
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {formatApplicationNumber(application.applicationNumber)}
                    </h3>
                    <Badge variant="outline">Submitted</Badge>
                  </div>
                  <p className="text-foreground font-medium">{application.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    Submitted on {formatTimestamp(application.created)}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
