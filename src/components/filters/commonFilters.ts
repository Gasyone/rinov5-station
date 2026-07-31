'use client'

import {
  createFilterGroup,
  type FilterGroupConfig,
  type FilterGroupOptionSource,
} from './FilterGroupSheetPanel'
import { mockEmployees } from '@/mocks/employees'
import { mockTeachers } from '@/mocks/teacherRecords'
import { BRANCHES } from '@/mocks'
import { mockClassRecords } from '@/mocks/classRecords'
import { mockStudents } from '@/mocks/students'

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
    { value: 'offline', label: 'Lớp Station' },
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

/**
 * 12. Bộ lọc LỘ TRÌNH dùng chung
 */
export function getLearningPathFilterGroup(
  selectedValues?: readonly string[] | ReadonlySet<string>,
  getOptionCount?: (val: string) => number,
  options?: readonly FilterGroupOptionSource[]
): FilterGroupConfig {
  const defaultPaths = Array.from(
    new Set(
      mockClassRecords
        .map((c) => c.learningPath)
        .filter(Boolean)
        .map((p) => p!.split('→')[0].trim())
    )
  ).sort()

  return createFilterGroup({
    id: 'learningPaths',
    title: 'Lộ trình',
    options: options ?? defaultPaths,
    selectedValues,
    getOptionCount,
    searchable: true,
  })
}

/**
 * 13. Bộ lọc CHƯƠNG TRÌNH dùng chung
 */
export function getSyllabusFilterGroup(
  selectedValues?: readonly string[] | ReadonlySet<string>,
  getOptionCount?: (val: string) => number,
  options?: readonly FilterGroupOptionSource[]
): FilterGroupConfig {
  const defaultSyllabuses = Array.from(
    new Set(
      mockClassRecords
        .map((c) => c.syllabus)
        .filter((s) => s && s !== '—')
    )
  ).sort() as string[]

  return createFilterGroup({
    id: 'syllabuses',
    title: 'Chương trình',
    options: options ?? defaultSyllabuses,
    selectedValues,
    getOptionCount,
    searchable: true,
  })
}

/**
 * 14. Bộ lọc GÓI SẢN PHẨM (GÓI ĐĂNG KÝ) dùng chung
 */
export function getPackageFilterGroup(
  selectedValues?: readonly string[] | ReadonlySet<string>,
  getOptionCount?: (val: string) => number,
  options?: readonly FilterGroupOptionSource[]
): FilterGroupConfig {
  const defaultPackages = Array.from(
    new Set(
      mockStudents
        .map((s) => s.packageName)
        .filter(Boolean)
    )
  ).sort() as string[]

  return createFilterGroup({
    id: 'packages',
    title: 'Gói đăng ký',
    options: options ?? defaultPackages,
    selectedValues,
    getOptionCount,
    searchable: true,
    scrollable: true,
  })
}



