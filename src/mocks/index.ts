export * from "./users"
export * from "./students"
export * from "./classes"
export * from "./employees"
export * from "./orders"
export * from "./products"
export * from "./contacts"
export * from "./appointments"
export * from "./bookingTests"
export * from "./workRegistrations"
export * from "./trialClasses"
export * from "./leaveReserve"
export * from "./tickets"
export * from "./lmsRoadmaps"
export * from "./systemConfig"
export * from "./crmLeads"
export * from "./promotions"
export * from "./jobTitles"
export * from "./branches"
export * from "./orgStructure"
export * from "./monthlyReports"


export type { User as AuthUser } from "./users"
export type { Student as MockStudent } from "./students"
export type { Class as MockClass } from "./classes"
export type { Employee as MockEmployee } from "./employees"
export type { Order as MockOrder } from "./orders"
export type { Product as MockProduct } from "./products"
export type { PromotionItem as MockPromotion } from "./promotions"
export type { Contact as MockContact } from "./contacts"
export type { Appointment as MockAppointment } from "./appointments"
export type { BookingTest as MockBookingTest } from "./bookingTests"
export type { TrialClass as MockTrialClass } from "./trialClasses"
export type { ClassSession, EventSession } from "./calendarSchedule"
export { getMockClassSessions, getMockEventSessions } from "./calendarSchedule"

export const BRANCHES = [
  "RinoEdu Linh Đàm",
  "RinoEdu Nguyễn Tuân",
  "RinoEdu Smart City",
]

export const ROLES: Record<string, string> = {
  admin: "Quản trị viên",
  branch_manager: "Quản lý chi nhánh",
  sale: "Nhân viên tư vấn",
  csm: "Chăm sóc khách hàng",
  teacher: "Giáo viên",
}
