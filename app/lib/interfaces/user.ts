interface IRoleData {
    age: number | null;
    height: number | null;
    weight: number | null;
    handedness: 'left' | 'right' | null; // Example of a string union type
    anonymous: boolean | null;
}

interface ICredit {
    purchased: number,
    used: number,
    remaining: number
}
export interface IUser {
    _id: string,
    name: string,
    email: string,
    password: string,
    city: string | null,
    country: string | null,
    avatarUrl: string | null,
    bio: string | null,
    credits: ICredit,
    emailVerified: boolean,
    stripeCustomerId: string | null,
    creationDate: Date,
    role: string,
    roleData: IRoleData,
    isDeleted: boolean
}