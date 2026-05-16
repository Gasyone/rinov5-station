export * from "./users"
export * from "./students"
export * from "./classes"
export * from "./employees"
export * from "./orders"
export * from "./products"
export * from "./contacts"
export * from "./appointments"

export type { User as AuthUser } from "./users"
export type { Student as MockStudent } from "./students"
export type { Class as MockClass } from "./classes"
export type { Employee as MockEmployee } from "./employees"
export type { Order as MockOrder } from "./orders"
export type { Product as MockProduct } from "./products"
export type { Contact as MockContact } from "./contacts"
export type { Appointment as MockAppointment } from "./appointments"

export const BRANCHES = [
  "Chi nhánh Hà Nội",
  "Chi nhánh Hồ Chí Minh",
  "Chi nhánh Đà Nẵng",
  "Toàn hệ thống",
]

export const ROLES: Record<string, string> = {
  admin: "Quản trị viên",
  branch_manager: "Quản lý chi nhánh",
  sale: "Nhân viên tư vấn",
  csm: "Chăm sóc khách hàng",
  teacher: "Giáo viên",
}
