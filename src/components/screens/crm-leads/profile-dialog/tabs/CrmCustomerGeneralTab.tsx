'use client'

import React from 'react'
import type { ParentItem, ChildItem } from '../../crmCustomerCreateTypes'
import { CrmCustomerParentSection } from '../../CrmCustomerParentSection'
import { CrmCustomerChildSection } from '../../CrmCustomerChildSection'

interface CrmCustomerGeneralTabProps {
  parents: ParentItem[]
  setParents: React.Dispatch<React.SetStateAction<ParentItem[]>>
  province: string
  setProvince: (v: string) => void
  district: string
  setDistrict: (v: string) => void
  ward: string
  setWard: (v: string) => void
  addressDetail: string
  setAddressDetail: (v: string) => void
  mapCoordinates: string
  setMapCoordinates: (v: string) => void
  childrenList: ChildItem[]
  setChildrenList: React.Dispatch<React.SetStateAction<ChildItem[]>>
  totalOrdersCount: number
  totalOrdersAmount: string
}

export function CrmCustomerGeneralTab({
  parents,
  setParents,
  province,
  setProvince,
  district,
  setDistrict,
  ward,
  setWard,
  addressDetail,
  setAddressDetail,
  mapCoordinates,
  setMapCoordinates,
  childrenList,
  setChildrenList,
  totalOrdersCount,
  totalOrdersAmount,
}: CrmCustomerGeneralTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
      {/* CỘT 1: PHỤ HUYNH & ĐỊA CHỈ MAP (5/12 CỘT) */}
      <div className="lg:col-span-5">
        <CrmCustomerParentSection
          parents={parents}
          setParents={setParents}
          province={province}
          setProvince={setProvince}
          district={district}
          setDistrict={setDistrict}
          ward={ward}
          setWard={setWard}
          addressDetail={addressDetail}
          setAddressDetail={setAddressDetail}
          mapCoordinates={mapCoordinates}
          setMapCoordinates={setMapCoordinates}
        />
      </div>

      {/* CỘT 2: HỌC VIÊN & ĐỊNH VỊ PHÂN BỔ (7/12 CỘT) */}
      <div className="lg:col-span-7">
        <CrmCustomerChildSection
          childList={childrenList}
          setChildren={setChildrenList}
          totalOrdersCount={totalOrdersCount}
          totalOrdersAmount={totalOrdersAmount}
        />
      </div>
    </div>
  )
}
