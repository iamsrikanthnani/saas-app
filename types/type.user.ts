export type TYPE_USER_INFO = {
  lastSignInAt: number | null;
  createdAt: number;
  updatedAt: number;
};

export type TYPE_CREATE_USER = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
};

export type TYPE_UPDATE_USER = {
  firstName: string;
  lastName: string;
  photo: string;
};
