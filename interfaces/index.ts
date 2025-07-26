export interface IWithId {
  id: string;
}

export interface CreatedAndUpdatedAt {
  created_at: string;
  updated_at: string;
}

export type ComponentType =
  "tarif"
  | "changeLanguage"
  | "showTariff"
  | "editProfile"
  | "auth"
  | "cancel"
  | "notification"
  | "about"
  | "adminToyxonalar"
  | "allVenues"
  | "admins"
  | "discounts"
  | "superDiscounts"
  | "addLocation"
  | "selectLocation"
  | "addAdmins"
  | "addToyxona"
  | "createTariff"
  | "editToyxona"
  | "editTarif"

export type AuthType = "register" | "login" | "forgot_password";
export type Role = "user" | "admin" | "superadmin";

export interface IProfileAction extends IWithId {
  label: string;
  icon: string;
  component: ComponentType;
  roles: Role[];
}

export interface WeddingHallPicture extends IWithId, CreatedAndUpdatedAt {
  wedding_hall_id: string;
  image_url: string;
}

export interface ITariffType extends IWithId, CreatedAndUpdatedAt {
  tariff_id: string;
  person_count: string;
  price: string;
}

export interface ITarif extends IWithId, CreatedAndUpdatedAt {
  name: string;
  wedding_hall_id: string;
  tariff_types: ITariffType[];
}

export interface IToyxonalar extends IWithId, CreatedAndUpdatedAt {
  user_id: string;
  name: string;
  description: string;
  status: string;
  longitude: string | null;
  latitude: string | null;
  address: string | null;
  tariff_count: string | null;
  region_id: string | null;
  district_id: string | null;
  quarter_id: string | null;
  phone1: string | null; // 🔧 null tip qo‘shildi
  phone2: string | null; // 🔧 null tip qo‘shildi
  telegram: string | null; // 🔧 null tip qo‘shildi
  instagram: string | null; // 🔧 null tip qo‘shildi
  reject_reason: string | null;
  min_price: string | null;
  max_price: string | null;
  wedding_hall_pictures: WeddingHallPicture[];
  tariffs: ITarif[];
}

export interface Banner extends IWithId, CreatedAndUpdatedAt {
  notes: string;
  wedding_hall_id: string;
  image_url: string;
  is_active: string;
}

export interface Pivot {
  model_type: string;
  model_id: string;
  role_id: string;
}

export interface IRoleInfo extends IWithId, CreatedAndUpdatedAt {
  name: string;
  guard_name: string;
  pivot?: Pivot;
}

export interface IUser extends IWithId {
  name: string;
  phone: string;
  status: string;
  avatar?: string;
  role: Role;
  roles?: IRoleInfo[];
}

export interface IRegisterResponse {
  user: IUser;
  token: string;
  role: Role;
}

export interface ILoginResponse {
  user: IUser;
  token: string;
}

export interface AttachRoleFormData {
  phone: string;
  role: number;
}

export interface WeddingHallFormState {
  name: string;
  description: string;
  tariff_count: number | null;
  phone1: string;
  phone2: string;
  telegram: string;
  instagram: string;
  longitude: number | null;
  latitude: number | null;
  address: string;
  wedding_hall_pictures: { image_url: string }[];
}

export interface ToyxonaFormData {
  name: string;
  description: string;
  status: string;
  longitude: string;
  latitude: string;
  address: string;
  tariff_count: number;
  phone1: string;
  phone2: string;
  telegram: string;
  instagram: string;
  wedding_hall_pictures: { image_url: string }[];
}

export interface TariffProductFormData {
  tariff_id: number;
  type: string; // meals, salads, wedding_table, bonuses
  name: string;
  description: string;
  image_url: string;
  category_id: number | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  type: string;
  category_id?: string | number;
}

export interface FormState {
  name: string;
  description: string;
  image_url: string;
  imageUploading: boolean;
}

export interface Section {
  label: string;
  type: string;
  category_id?: number;
  form: FormState;
  items: Product[];
  isCreating?: boolean; // ✅ Qo‘shildi
}
