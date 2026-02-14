import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ApplicationForm {
    placeOfBirth: string;
    professionPhone: string;
    previousResidenceCertNumber?: string;
    relationToLandlord: string;
    dateOfBirth: string;
    hasVehicle: boolean;
    profession: string;
    fullName: string;
    isContractRenewal: boolean;
    nationality: number;
    professionAddress: string;
    email: string;
    propertyOwner: string;
    idNumber: string;
    address: string;
    gender: number;
    startOfResidency: string;
    currentAddress: string;
    isHomeowner: boolean;
    phoneNumber: string;
    previousApplications: number;
    maritalStatus?: string;
}
export interface Application {
    placeOfBirth: string;
    status: Status;
    created: Time;
    principal: Principal;
    applicationNumber: number;
    professionPhone: string;
    previousResidenceCertNumber?: string;
    relationToLandlord: string;
    dateOfBirth: string;
    hasVehicle: boolean;
    lastUpdated: Time;
    profession: string;
    fullName: string;
    isContractRenewal: boolean;
    nationality: number;
    professionAddress: string;
    email: string;
    propertyOwner: string;
    idNumber: string;
    address: string;
    gender: number;
    startOfResidency: string;
    currentAddress: string;
    isHomeowner: boolean;
    phoneNumber: string;
    previousApplications: number;
    maritalStatus?: string;
}
export type Time = bigint;
export enum Status {
    pending = "pending"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createApplication(application: ApplicationForm): Promise<number>;
    getAllApplications(): Promise<Array<Application>>;
    getApplicationById(applicationNumber: number): Promise<Application>;
    getCallerUserRole(): Promise<UserRole>;
    getOwnApplications(): Promise<Array<Application>>;
    isCallerAdmin(): Promise<boolean>;
}
