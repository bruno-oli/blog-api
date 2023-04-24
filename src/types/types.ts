export interface IUser {
  name: string;
  nickname: string;
  email: string;
  password: string;
  admin: boolean;
  avatar: string;
  posts: {
    _id: string;
    title: string;
    description: string;
    category: categoryType;
    image: string;
  }[];
}

export type categoryType =
  | "negócios"
  | "entreterimento"
  | "geral"
  | "saúde"
  | "ciência"
  | "esportes"
  | "tecnologia"
  | "jogos";

export interface IPost {
  title: string;
  description: string;
  category: categoryType;
  image: string;
  body: string;
  createdBy: {
    userId: string;
    name: string;
    avatar: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
