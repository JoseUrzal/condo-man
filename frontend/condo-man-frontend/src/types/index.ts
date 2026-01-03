// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ACCOUNTANT = 'ACCOUNTANT',
}

export enum PaymentMethod {
  MBWAY = 'MBWAY',
  TRANSFER = 'TRANSFER',
  CASH = 'CASH',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum ExpenseType {
  MAINTENANCE = 'MAINTENANCE',
  UTILITIES = 'UTILITIES',
  INSURANCE = 'INSURANCE',
}

// Entities
export interface Company {
  id: string;
  name: string;
  vatNumber: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  companyId: string;
  company?: Company;
}

export interface Condominium {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  totalUnits: number;
  companyId: string;
  company?: Company;
}

export interface Unit {
  id: string;
  doorNumber: string;
  floor: string;
  typology: string;
  permillage: number;
  condominiumId: string;
  condominium?: Condominium;
  owners?: Owner[];
}

export interface Owner {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  taxNumber?: string;
  units?: Unit[];
}

export interface Ownership {
  id: string;
  ownerId: string;
  unitId: string;
  ownershipPercentage: number;
  startDate: string;
  endDate?: string;
  owner?: Owner;
  unit?: Unit;
}

export interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  type: ExpenseType;
  condominiumId: string;
  condominium?: Condominium;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  status: PaymentStatus;
  unitId: string;
  expenseId?: string;
  unit?: Unit;
  expense?: Expense;
}

export interface Document {
  id: string;
  title: string;
  filePath: string;
  mimeType: string;
  condominiumId: string;
  expenseId?: string;
}

// DTOs
export interface CreateCompanyDto {
  name: string;
  vatNumber: string;
  email: string;
  phone: string;
  address: string;
  isActive?: boolean;
}

export interface UpdateCompanyDto extends Partial<CreateCompanyDto> {}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive?: boolean;
  companyId: string;
}

export interface UpdateUserDto extends Partial<Omit<CreateUserDto, 'password'>> {}

export interface CreateCondominiumDto {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  totalUnits: number;
  companyId: string;
}

export interface UpdateCondominiumDto extends Partial<CreateCondominiumDto> {}

export interface CreateUnitDto {
  doorNumber: string;
  floor: string;
  typology: string;
  permillage: number;
  condominiumId: string;
}

export interface UpdateUnitDto extends Partial<CreateUnitDto> {}

export interface CreateOwnerDto {
  name: string;
  email?: string;
  phone?: string;
  taxNumber?: string;
}

export interface UpdateOwnerDto extends Partial<CreateOwnerDto> {}

export interface CreateExpenseDto {
  title: string;
  description: string;
  amount: number;
  date: string;
  type: ExpenseType;
  condominiumId: string;
}

export interface UpdateExpenseDto extends Partial<CreateExpenseDto> {}

export interface CreatePaymentDto {
  amount: number;
  date: string;
  method: PaymentMethod;
  status?: PaymentStatus;
  unitId: string;
  expenseId?: string;
}

export interface UpdatePaymentDto extends Partial<CreatePaymentDto> {}
