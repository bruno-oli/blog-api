import * as z from "zod";

export interface IUser {
  name: string;
  nickname: string;
  email: string;
  password: string;
  admin: boolean;
  avatar: string;
  banner: string;
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

export const RegisterUserSchema = z.object({
  name: z
    .string()
    .nonempty("O nome deve ser preenchido")
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(30, "O nome deve ter no máximo 30 caracteres"),
  nickname: z
    .string()
    .nonempty("O nickname deve ser preenchido")
    .min(3, "O nickname deve ter pelo menos 3 caracteres")
    .max(20, "O nickname deve ter no máximo 20 caracteres"),
  email: z
    .string()
    .email("Insira um email valido!")
    .nonempty("O e-mail deve ser preenchido"),
  password: z
    .string()
    .nonempty("A senha deve ser preenchida")
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const LoginUserSchema = z.object({
  email: z
    .string()
    .email("Insira um email valido!")
    .nonempty("O e-mail deve ser preenchido"),
  password: z.string().nonempty("A senha deve ser preenchida"),
});
