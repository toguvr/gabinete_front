export enum TaskPriority {
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  BAIXA = 'BAIXA',
}

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface StateProps {
  [key: string]: any;
}

export interface UserDTO {
  avatar?: string;
  avatar_url?: string;
  cellphone: string;
  email: string;
  gender: string;
  id?: string;
  name: string;
  need_update_password?: boolean;
  old_password?: string;
  new_password?: string;
  created_at?: Date;
  updated_at?: Date;
  birthdate?: Date;
}

export interface OfficeDTO {
  active: string;
  city: string;
  id: string;
  logo: string;
  logo_url: string;
  name: string;
  owner_id: string;
  owner_position: string;
  primary_color: string;
  secondary_color: string;
  state: string;
}

export interface RoleDTO {
  cargo_page: number;
  demandas_page: number;
  eleitor_page: number;
  equipe_page: number;
  home_page: number;
  id: string;
  name: string;
  office_id: string;
  tarefas_page: number;
}

export interface PermissionByIdDTO {
  id: string;
  active: boolean;
  office: OfficeDTO;
  office_id: string;
  role: RoleDTO;
  role_id: string;
  user: UserDTO;
  user_id: string;
}

export interface TaskPropsDTO {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  deadline: string;
  doneDate: Date;
  date: Date;
  status: string;
  priority: string;
  responsible: UserDTO;
  responsible_id: string;
  creator: UserDTO;
  office: string;
  resources: boolean;
  files: string;
  voterId: string;
  voter: VoterDTO;
}

export interface VoterDTO {
  address_number: string;
  birthdate: string;
  cellphone: string;
  city: string;
  complement: string;
  document: string;
  email: string;
  gender: string;
  creator: UserDTO;
  id: string;
  name: string;
  neighborhood: string;
  office_id: string;
  reference: string;
  state: string;
  street: string;
  zip: string;
  tasks?: TaskPropsDTO[];
}
