export interface UserLogin {
  username: string;
  password: string;
  expiresInMins: number;
}

export interface IUser {
  id?: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age?: number;
  gender?: string;
  email: string;
  phone: string;
  username: string;
  password?: string;
  birthDate?: string;
  image?: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  hair?: {
    color: string;
    type: string;
  };
  domain?: string;
  ip?: string;
  address?: {
    address?: string;
    city?: string;
    state?: string;
    stateCode?: string;
    postalCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    country?: string;
  };
  company?: {
    department: string;
    name: string;
    title: string;
    address: {
      address: string;
      city: string;
      state: string;
      postalCode: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
  };
  bank?: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  university?: string;
  ein?: string;
  ssn?: string;
  userAgent?: string;
}

export interface UpdateUserPayload {
  id?: number;
  data: Partial<IUser>;
}
