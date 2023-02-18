export interface StateProps {
  [key: string]: any;
}

export interface User {
  avatar: string;
  avatar_url: string;
  cellphone: string;
  email: string;
  gender: string;
  id: string;
  name: string;
  need_update_password: boolean;
}

export interface Office {
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

export interface Role {
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

export interface PermissionById {
  id: string;
  active: boolean;
  office: Office;
  office_id: string;
  role: Role;
  role_id: string;
  user: User;
  user_id: string;
}
