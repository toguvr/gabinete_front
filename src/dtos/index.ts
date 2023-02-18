export interface StateProps {
  [key: string]: any;
}

export interface User {
  id: string;
  name: string;
  cellphone: string;
  logo_url: string;
  avatar: string;
  avatar_url: string;
  verified: boolean;
  role: string;
  email: string;
  cpf: string;
  rg: string;
  crm: string;
  sus: string;
  bank: string;
  agency: string;
  account: string;
  street: string;
  complemento: string;
  number: string;
  cep: string;
  bairro: string;
  cidade: string;
  expoToken: string;
  uf: string;
  notifyConfirmation: boolean;
  notifyOffer: boolean;
  notifyAlert: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TaskProps {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  deadline: Date;
  doneDate: Date;
  status: string;
  priority: string;
  responsible: string;
  creator: string;
  office: string;
  resources: boolean;
  files: string;
  voterId: string;
}
