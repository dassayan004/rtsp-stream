export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
export enum ViceValue {
  YES = 'Yes',
  NO = 'No',
  SOMETIMES = 'Sometimes',
}
export enum SubscriptionPlan {
  BASIC = 'basic',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export enum ProfileStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PAUSED = 'paused',
}

export enum SexPreference {
  STRAIGHT = 'Straight',
  GAY = 'Gay',
  LESBIAN = 'Lesbian',
  BISEXUAL = 'Bisexual',
  ASEXUAL = 'Asexual',
  DEMISEXUAL = 'Demisexual',
  PANSEXUAL = 'Pansexual',
  QUEER = 'Queer',
  BICURIOUS = 'Bicurious',
  AROMANTIC = 'Aromantic',
}

export enum RegistrationStep {
  OwnerRegistration,
  PetRegistration,
  Interest,
  SexualOrientation,
  LookingFor,
  AddYourPicture,
  AddPetPicture,
  AddLocation,
  Completed,
}
