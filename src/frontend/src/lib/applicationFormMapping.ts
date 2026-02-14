import type { ApplicationForm } from '../backend';

interface FrontendFormData {
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

export function applicationFormToBackend(formData: FrontendFormData): ApplicationForm {
  // Map gender string to number
  const genderMap: Record<string, number> = {
    male: 0,
    female: 1,
    other: 2,
  };

  // Map nationality string to number
  const nationalityMap: Record<string, number> = {
    Indian: 0,
    indian: 0,
  };

  return {
    fullName: formData.fullName,
    dateOfBirth: formData.dateOfBirth,
    gender: genderMap[formData.gender.toLowerCase()] ?? 2,
    placeOfBirth: formData.placeOfBirth,
    nationality: nationalityMap[formData.nationality] ?? 1,
    maritalStatus: formData.maritalStatus || undefined,
    phoneNumber: formData.phoneNumber,
    email: formData.email || '',
    idNumber: formData.idNumber,
    address: formData.address,
    currentAddress: formData.currentAddress,
    startOfResidency: formData.startOfResidency,
    propertyOwner: formData.propertyOwner,
    relationToLandlord: formData.relationToLandlord,
    isHomeowner: formData.isHomeowner,
    profession: formData.profession,
    professionAddress: formData.professionAddress,
    professionPhone: formData.professionPhone,
    hasVehicle: formData.hasVehicle,
    isContractRenewal: formData.isContractRenewal,
    previousResidenceCertNumber: formData.previousResidenceCertNumber || undefined,
    previousApplications: parseInt(formData.previousApplications, 10) || 0,
  };
}
