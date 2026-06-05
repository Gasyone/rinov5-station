'use client'

import {
  createFilterGroup,
  type FilterGroupConfig,
  type FilterGroupOptionSource,
} from './FilterGroupSheetPanel'
import { mockEmployees } from '@/mocks/employees'
import { mockTeachers } from '@/mocks/teacherRecords'
import { BRANCHES } from '@/mocks'

/**
 * 1. Bộ lọc TRƯỜNG / CHI NHÁNH dùng chung
 */
export function getSchoolFilterGroup(
  id: 'schools' | 'branches',
  selectedValues?: readonly string[] | ReadonlySet<string>,
  getOptionCount?: (val: string) => number,
  options?: readonly FilterGroupOptionSource[]
): FilterGroupConfig {
  return createFilterGroup({
    id,
    options: options ?? BRANCHES,
    selectedValues,
    getOptionCount,
  })
}

/**
 * 2. Bộ lọc GIÁO VIÊN dùng chung
 */
export function getTeacherFilterGroup(
  selectedValues?: readonly string[] | ReadonlySet<string>,
  getOptionCount?: (val: string) => number,
  options?: readonly FilterGroupOptionSource[]
): FilterGroupConfig {
  const defaultTeachers = Array.from(
    new Set([
      ...mockTeachers.filter((t) => t.status === 'active').map((t) => t.name),
      ...mockEmployees.filter((e) => e.status === 'active' && e.department === 'Teaching').map((e) => e.name),
    ])
  ).sort()

  return createFilterGroup({
    id: 'teachers',
    options: options ?? defaultTeachers,
    selectedValues,
    getOptionCount,
    searchable: true,
    scrollable: true,
  })
}

/**
 * 3. Bộ lọc NHÂN VIÊN SALE dùng chung
 */
export function getSaleFilterGroup(
  selectedValues?: readonly string[] | ReadonlySet<string>,
  getOptionCount?: (val: string) => number,
  options?: readonly FilterGroupOptionSource[]
): FilterGroupConfig {
  const defaultSales = mockEmployees
    .filter((e) => e.status === 'active' && (e.department === 'Sales' || e.position.toLowerCase().includes('sale')))
    .map((e) => e.name)
    .sort()

  return createFilterGroup({
    id: 'sales',
    options: options ?? defaultSales,
    selectedValues,
    getOptionCount,
    searchable: true,
    scrollable: true,
  })
}

/**
 * 4. Bộ lọc MÔN HỌC dùng chung
 */
export function getSubjectFilterGroup(
  selectedValues?: readonly string[] | ReadonlySet<string>,
  getOptionCount?: (val: string) => number,
  options?: readonly FilterGroupOptionSource[]
): FilterGroupConfig {
  const defaultSubjects = [
    { value: 'english', label: 'Tiếng Anh' },
    { value: 'math', label: 'Toán học' },
    { value: 'stem', label: 'STEM Robotics' },
  ]

  return createFilterGroup({
    id: 'subjects',
    options: options ?? defaultSubjects,
    selectedValues,
    getOptionCount,
  })
}

/**
 * 5. Bộ lọc CHƯƠNG TRÌNH HỌC dùng chung
 */
export function getProgramFilterGroup(
  selectedValues?: readonly string[] | ReadonlySet<string>,
  getOptionCount?: (val: string) => number,
  options?: readonly FilterGroupOptionSource[]
): FilterGroupConfig {
  const defaultPrograms = [
    'STEM Robotics',
    'Tiếng Anh',
    'Toán tư duy',
    'Station Program',
    'IELTS Foundation',
    'Toán Olympiad',
  ]

  return createFilterGroup({
    id: 'programs',
    options: options ?? defaultPrograms,
    selectedValues,
    getOptionCount,
  })
}

/**
 * 6. Bộ lọc TRÌNH ĐỘ dùng chung
 */
export function getLevelFilterGroup(
  selectedValues?: readonly string[] | ReadonlySet<string>,
  getOptionCount?: (val: string) => number,
  options?: readonly FilterGroupOptionSource[]
): FilterGroupConfig {
  return createFilterGroup({
    id: 'levels',
    options: options ?? [],
    selectedValues,
    getOptionCount,
  })
}

/**
 * 7. Bộ lọc PHÒNG HỌC dùng chung
 */
export function getRoomFilterGroup(
  selectedValues?: readonly string[] | ReadonlySet<string>,
  getOptionCount?: (val: string) => number,
  options?: readonly FilterGroupOptionSource[]
): FilterGroupConfig {
  return createFilterGroup({
    id: 'rooms',
    options: options ?? [],
    selectedValues,
    getOptionCount,
  })
}

/**
 * 8. Bộ lọc HÌNH THỨC LỚP HỌC dùng chung
 */
export function getClassTypeFilterGroup(
  selectedValues?: readonly string[] | ReadonlySet<string>,
  getOptionCount?: (val: string) => number,
  options?: readonly FilterGroupOptionSource[]
): FilterGroupConfig {
  const defaultTypes = [
    { value: 'offline', label: 'Lớp Offline' },
    { value: 'online_tutor', label: 'Lớp Online Tutor' },
  ]
  return createFilterGroup({
    id: 'classTypes',
    options: options ?? defaultTypes,
    selectedValues,
    getOptionCount,
  })
}

/**
 * 9. Bộ lọc LỚP HỌC dùng chung
 */
export function getClassFilterGroup(
  selectedValues?: readonly string[] | ReadonlySet<string>,
  getOptionCount?: (val: string) => number,
  options?: readonly FilterGroupOptionSource[]
): FilterGroupConfig {
  return createFilterGroup({
    id: 'classes',
    options: options ?? [],
    selectedValues,
    getOptionCount,
    searchable: true,
    scrollable: true,
  })
}

/**
 * 10. Bộ lọc SỐ BUỔI HỌC CÒN LẠI dùng chung
 */
export function getRemainingSessionsFilterGroup(
  selectedValues?: readonly string[] | ReadonlySet<string>,
  getOptionCount?: (val: string) => number,
  options?: readonly FilterGroupOptionSource[]
): FilterGroupConfig {
  const defaultRanges = [
    { value: 'empty', label: 'Đã hết buổi (0 buổi)' },
    { value: 'low', label: 'Sắp hết buổi (Dưới 5 buổi)' },
    { value: 'normal', label: 'Còn nhiều (Từ 5 buổi trở lên)' },
  ]
  return createFilterGroup({
    id: 'remainingSessionsRange',
    options: options ?? defaultRanges,
    selectedValues,
    getOptionCount,
  })
}

/**
 * 11. Bộ lọc GIỚI TÍNH dùng chung
 */
export function getGenderFilterGroup(
  selectedValues?: readonly string[] | ReadonlySet<string>,
  getOptionCount?: (val: string) => number,
  options?: readonly FilterGroupOptionSource[]
): FilterGroupConfig {
  const defaultGenders = [
    { value: 'Male', label: 'Nam' },
    { value: 'Female', label: 'Nữ' },
    { value: 'Other', label: 'Khác' },
  ]
  return createFilterGroup({
    id: 'genders',
    options: options ?? defaultGenders,
    selectedValues,
    getOptionCount,
  })
}


