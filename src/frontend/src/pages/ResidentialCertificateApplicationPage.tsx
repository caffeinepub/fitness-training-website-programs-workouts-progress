import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { applicationFormToBackend } from '../lib/applicationFormMapping';
import RequireLoginNotice from '../components/RequireLoginNotice';

interface FormData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  placeOfBirth: string;
  nationality: string;
  maritalStatus: string;
  phoneNumber: string;
  email: string;
  idNumber: string;
  address: string;
  currentAddress: string;
  startOfResidency: string;
  propertyOwner: string;
  relationToLandlord: string;
  isHomeowner: boolean;
  profession: string;
  professionAddress: string;
  professionPhone: string;
  hasVehicle: boolean;
  isContractRenewal: boolean;
  previousResidenceCertNumber: string;
  previousApplications: string;
}

export default function ResidentialCertificateApplicationPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const isAuthenticated = !!identity;

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    placeOfBirth: '',
    nationality: 'Indian',
    maritalStatus: '',
    phoneNumber: '',
    email: '',
    idNumber: '',
    address: '',
    currentAddress: '',
    startOfResidency: '',
    propertyOwner: '',
    relationToLandlord: '',
    isHomeowner: false,
    profession: '',
    professionAddress: '',
    professionPhone: '',
    hasVehicle: false,
    isContractRenewal: false,
    previousResidenceCertNumber: '',
    previousApplications: '0',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ applicationNumber: number } | null>(null);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.placeOfBirth.trim()) newErrors.placeOfBirth = 'Place of birth is required';
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.currentAddress.trim()) newErrors.currentAddress = 'Current address is required';
    if (!formData.startOfResidency) newErrors.startOfResidency = 'Start of residency is required';
    if (!formData.propertyOwner.trim()) newErrors.propertyOwner = 'Property owner name is required';
    if (!formData.relationToLandlord.trim()) newErrors.relationToLandlord = 'Relation to landlord is required';
    if (!formData.profession.trim()) newErrors.profession = 'Profession is required';
    if (!formData.professionAddress.trim()) newErrors.professionAddress = 'Profession address is required';
    if (!formData.professionPhone.trim()) newErrors.professionPhone = 'Profession phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setSubmitError('Please sign in to submit an application');
      return;
    }

    if (!validateForm()) {
      setSubmitError('Please fix the errors in the form');
      return;
    }

    if (!actor) {
      setSubmitError('System not ready. Please try again.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const backendForm = applicationFormToBackend(formData);
      const applicationNumber = await actor.createApplication(backendForm);
      setSuccessData({ applicationNumber });
    } catch (error: any) {
      console.error('Submission error:', error);
      setSubmitError(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="border-2 border-primary">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Application Submitted Successfully</CardTitle>
            <CardDescription>Your residential certificate application has been received</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-6 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Application Reference Number</p>
              <p className="text-3xl font-bold text-foreground">{successData.applicationNumber}</p>
            </div>
            <Alert>
              <AlertDescription>
                Please save this reference number for tracking your application. You can view the status in "My
                Applications" section.
              </AlertDescription>
            </Alert>
            <div className="flex gap-3">
              <Button onClick={() => navigate({ to: '/my-applications' })} className="flex-1">
                View My Applications
              </Button>
              <Button
                onClick={() => {
                  setSuccessData(null);
                  setFormData({
                    fullName: '',
                    dateOfBirth: '',
                    gender: '',
                    placeOfBirth: '',
                    nationality: 'Indian',
                    maritalStatus: '',
                    phoneNumber: '',
                    email: '',
                    idNumber: '',
                    address: '',
                    currentAddress: '',
                    startOfResidency: '',
                    propertyOwner: '',
                    relationToLandlord: '',
                    isHomeowner: false,
                    profession: '',
                    professionAddress: '',
                    professionPhone: '',
                    hasVehicle: false,
                    isContractRenewal: false,
                    previousResidenceCertNumber: '',
                    previousApplications: '0',
                  });
                }}
                variant="outline"
                className="flex-1"
              >
                Submit Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Residential Certificate Application</h1>
        <p className="text-muted-foreground">
          Please fill out all required fields to apply for a residential certificate
        </p>
      </div>

      {!isAuthenticated && (
        <div className="mb-6">
          <RequireLoginNotice />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic details about the applicant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  className={errors.dateOfBirth ? 'border-destructive' : ''}
                />
                {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                  <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeOfBirth">
                  Place of Birth <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={(e) => handleChange('placeOfBirth', e.target.value)}
                  placeholder="City, State"
                  className={errors.placeOfBirth ? 'border-destructive' : ''}
                />
                {errors.placeOfBirth && <p className="text-sm text-destructive">{errors.placeOfBirth}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  placeholder="Indian"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Select value={formData.maritalStatus} onValueChange={(value) => handleChange('maritalStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How we can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  placeholder="10-digit mobile number"
                  className={errors.phoneNumber ? 'border-destructive' : ''}
                />
                {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">
                ID Number (Aadhaar/Passport/Voter ID) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => handleChange('idNumber', e.target.value)}
                placeholder="Enter your ID number"
                className={errors.idNumber ? 'border-destructive' : ''}
              />
              {errors.idNumber && <p className="text-sm text-destructive">{errors.idNumber}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
            <CardDescription>Permanent and current residential details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">
                Permanent Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="House/Flat No., Street, Locality, City, State, Pincode"
                rows={3}
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentAddress">
                Current Residential Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="currentAddress"
                value={formData.currentAddress}
                onChange={(e) => handleChange('currentAddress', e.target.value)}
                placeholder="House/Flat No., Street, Locality, City, State, Pincode"
                rows={3}
                className={errors.currentAddress ? 'border-destructive' : ''}
              />
              {errors.currentAddress && <p className="text-sm text-destructive">{errors.currentAddress}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startOfResidency">
                  Start of Residency <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startOfResidency"
                  type="date"
                  value={formData.startOfResidency}
                  onChange={(e) => handleChange('startOfResidency', e.target.value)}
                  className={errors.startOfResidency ? 'border-destructive' : ''}
                />
                {errors.startOfResidency && <p className="text-sm text-destructive">{errors.startOfResidency}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyOwner">
                  Property Owner Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="propertyOwner"
                  value={formData.propertyOwner}
                  onChange={(e) => handleChange('propertyOwner', e.target.value)}
                  placeholder="Owner's full name"
                  className={errors.propertyOwner ? 'border-destructive' : ''}
                />
                {errors.propertyOwner && <p className="text-sm text-destructive">{errors.propertyOwner}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationToLandlord">
                Relation to Landlord <span className="text-destructive">*</span>
              </Label>
              <Input
                id="relationToLandlord"
                value={formData.relationToLandlord}
                onChange={(e) => handleChange('relationToLandlord', e.target.value)}
                placeholder="e.g., Tenant, Family Member, Self"
                className={errors.relationToLandlord ? 'border-destructive' : ''}
              />
              {errors.relationToLandlord && <p className="text-sm text-destructive">{errors.relationToLandlord}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isHomeowner"
                checked={formData.isHomeowner}
                onCheckedChange={(checked) => handleChange('isHomeowner', checked as boolean)}
              />
              <Label htmlFor="isHomeowner" className="font-normal cursor-pointer">
                I am the homeowner
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>Employment and occupation details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profession">
                Profession/Occupation <span className="text-destructive">*</span>
              </Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => handleChange('profession', e.target.value)}
                placeholder="Your profession or occupation"
                className={errors.profession ? 'border-destructive' : ''}
              />
              {errors.profession && <p className="text-sm text-destructive">{errors.profession}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionAddress">
                Workplace Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="professionAddress"
                value={formData.professionAddress}
                onChange={(e) => handleChange('professionAddress', e.target.value)}
                placeholder="Company/Office address"
                rows={2}
                className={errors.professionAddress ? 'border-destructive' : ''}
              />
              {errors.professionAddress && <p className="text-sm text-destructive">{errors.professionAddress}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionPhone">
                Workplace Phone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="professionPhone"
                type="tel"
                value={formData.professionPhone}
                onChange={(e) => handleChange('professionPhone', e.target.value)}
                placeholder="Office contact number"
                className={errors.professionPhone ? 'border-destructive' : ''}
              />
              {errors.professionPhone && <p className="text-sm text-destructive">{errors.professionPhone}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Other relevant details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasVehicle"
                checked={formData.hasVehicle}
                onCheckedChange={(checked) => handleChange('hasVehicle', checked as boolean)}
              />
              <Label htmlFor="hasVehicle" className="font-normal cursor-pointer">
                I own a vehicle
              </Label>
            </div>

            <Separator />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isContractRenewal"
                checked={formData.isContractRenewal}
                onCheckedChange={(checked) => handleChange('isContractRenewal', checked as boolean)}
              />
              <Label htmlFor="isContractRenewal" className="font-normal cursor-pointer">
                This is a contract renewal
              </Label>
            </div>

            {formData.isContractRenewal && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="previousResidenceCertNumber">Previous Certificate Number</Label>
                <Input
                  id="previousResidenceCertNumber"
                  value={formData.previousResidenceCertNumber}
                  onChange={(e) => handleChange('previousResidenceCertNumber', e.target.value)}
                  placeholder="Enter previous certificate number"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="previousApplications">Number of Previous Applications</Label>
              <Input
                id="previousApplications"
                type="number"
                min="0"
                value={formData.previousApplications}
                onChange={(e) => handleChange('previousApplications', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting || !isAuthenticated} className="flex-1" size="lg">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
