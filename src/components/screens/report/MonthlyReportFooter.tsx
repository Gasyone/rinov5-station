'use client'

import React from 'react'
import Image from 'next/image'

export function MonthlyReportFooter() {
  return (
    <footer className="footer-report bg-[#F2F7FF] border-t-4 border-[#EA2F2F] mt-12 w-full print:hidden">
      <div className="footer-container">
        {/* Desktop Footer (sm and up) */}
        <div className="hidden sm:flex flex-row gap-[30px] items-stretch">
          {/* Cột 1: Logo Trapezoid Badge & Slogan */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="logo-wrapper">
              <span className="footer-logo-demo">
                <Image
                  src="/rinoedu-landing-logo.png"
                  alt="RinoEdu.ai"
                  width={150}
                  height={36}
                  className="footer-logo-demo__img"
                  priority
                />
              </span>
            </div>
            <div className="tagline">
              <p className="font-sans font-medium text-base leading-[1.25] text-[#333] text-justify">
                Học Toán và Tiếng Anh
                <br />
                theo cách của tương lai
              </p>
            </div>
          </div>

          {/* Cột 2: Thông tin liên hệ */}
          <div className="flex flex-col gap-6 pt-6 flex-1">
            <div>
              <h3 className="font-sans font-semibold text-lg leading-[1.11] text-[#222]">
                Liên hệ
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full">
                  <span className="text-[#FF9E08] text-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                </div>
                <a
                  href="tel:0862663466"
                  className="font-sans font-medium text-base leading-[1.5] text-[#333] hover:text-[#EA2F2F] transition-colors"
                >
                  0862.663.466
                </a>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full">
                  <span className="text-[#FF9E08] text-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                </div>
                <a
                  href="mailto:Contact@rinoedu.ai"
                  className="font-sans font-medium text-base leading-[1.5] text-[#333] hover:text-[#EA2F2F] transition-colors"
                >
                  Contact@rinoedu.ai
                </a>
              </div>
            </div>
          </div>

          {/* Cột 3: Địa chỉ trụ sở */}
          <div className="flex flex-col gap-6 pt-6 flex-1">
            <div>
              <h3 className="font-sans font-semibold text-lg leading-[1.11] text-[#222]">
                Địa chỉ
              </h3>
            </div>
            <div className="flex gap-2">
              <div className="flex items-start justify-center w-8 h-8 rounded-full shrink-0 pt-1">
                <span className="text-[#FF9E08] text-xl">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.75 3.75C11.7292 2.97917 11.4583 2.33333 10.9375 1.8125C10.4167 1.29167 9.77083 1.02083 9 1C8.22917 1.02083 7.58333 1.29167 7.0625 1.8125C6.54167 2.33333 6.27083 2.97917 6.25 3.75C6.25 3.97917 6.34375 4.34375 6.53125 4.84375C6.73958 5.32292 7.02083 5.84375 7.375 6.40625C7.9375 7.30208 8.47917 8.07292 9 8.71875C9.52083 8.07292 10.0625 7.30208 10.625 6.40625C10.9792 5.84375 11.2604 5.32292 11.4688 4.84375C11.6562 4.34375 11.75 3.97917 11.75 3.75ZM12.75 3.75C12.7292 4.33333 12.5208 5.01042 12.125 5.78125C11.7292 6.55208 11.2708 7.30208 10.75 8.03125C10.25 8.73958 9.82292 9.3125 9.46875 9.75C9.34375 9.89583 9.1875 9.96875 9 9.96875C8.8125 9.96875 8.65625 9.89583 8.53125 9.75C8.17708 9.3125 7.75 8.73958 7.25 8.03125C6.72917 7.30208 6.27083 6.55208 5.875 5.78125C5.47917 5.01042 5.27083 4.33333 5.25 3.75C5.27083 2.6875 5.63542 1.80208 6.34375 1.09375C7.05208 0.385417 7.9375 0.0208333 9 0C10.0625 0.0208333 10.9479 0.385417 11.6562 1.09375C12.3646 1.80208 12.7292 2.6875 12.75 3.75ZM12.5938 7C12.8646 6.54167 13.0938 6.09375 13.2812 5.65625L16.9688 4.1875C17.2396 4.08333 17.4688 4.10417 17.6562 4.25C17.8646 4.39583 17.9792 4.60417 18 4.875V13.3438C17.9792 13.6562 17.8229 13.8854 17.5312 14.0312L12.6875 15.9688C12.5833 16.0104 12.4792 16.0104 12.375 15.9688L5.53125 14.0312L1.03125 15.8438C0.760417 15.9271 0.53125 15.8958 0.34375 15.75C0.135417 15.6042 0.0208333 15.3958 0 15.125V6.65625C0.0208333 6.34375 0.177083 6.11458 0.46875 5.96875L4.3125 4.4375C4.375 4.77083 4.47917 5.09375 4.625 5.40625L1 6.84375V14.75L5 13.1562V9.5C5.02083 9.1875 5.1875 9.02083 5.5 9C5.8125 9.02083 5.97917 9.1875 6 9.5V13.125L12 14.8438V9.5C12.0208 9.1875 12.1875 9.02083 12.5 9C12.8125 9.02083 12.9792 9.1875 13 9.5V14.75L17 13.1562V5.25L12.6875 6.96875C12.6667 6.96875 12.6354 6.97917 12.5938 7Z"
                      fill="#FF9E08"
                    />
                  </svg>
                </span>
              </div>
              <p className="font-sans font-medium text-base leading-[1.5] text-[#333] text-left flex-1">
                Tầng 2, Toà FS, Toà nhà hỗn hợp Gold Season, số 47 Nguyễn Tuân, Thanh Xuân, Hà Nội
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Footer (below sm) */}
        <div className="flex sm:hidden flex-col gap-4">
          <div className="logo-wrapper">
            <span className="footer-logo-demo">
              <Image
                src="/rinoedu-landing-logo.png"
                alt="RinoEdu.ai"
                width={130}
                height={30}
                className="footer-logo-demo__img"
                priority
              />
            </span>
          </div>

          <div className="flex flex-col gap-6 items-center w-full max-w-full mx-auto">
            <div className="w-full">
              <p className="font-sans font-medium text-base leading-[1.25] text-[#333] text-left">
                Học Toán và Tiếng Anh theo cách của tương lai
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-6">
                {/* Liên hệ Mobile */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-sans font-semibold text-base leading-[1.25] text-[#222]">
                    Liên hệ
                  </h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0">
                        <span className="text-[#FF9E08] text-base">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </span>
                      </div>
                      <a
                        href="tel:0862663466"
                        className="font-sans font-medium text-sm leading-[1.5] text-[#333]"
                      >
                        0862.663.466
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0">
                        <span className="text-[#FF9E08] text-base">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                        </span>
                      </div>
                      <a
                        href="mailto:Contact@rinoedu.ai"
                        className="font-sans font-medium text-sm leading-[1.5] text-[#333]"
                      >
                        Contact@rinoedu.ai
                      </a>
                    </div>
                  </div>
                </div>

                {/* Địa chỉ Mobile */}
                <div className="flex flex-col gap-2 w-full max-w-full">
                  <h3 className="font-sans font-semibold text-base leading-[1.25] text-[#222]">
                    Địa chỉ
                  </h3>
                  <div className="flex gap-2">
                    <div className="flex items-start justify-center w-8 h-8 rounded-full shrink-0 pt-0.5">
                      <span className="text-[#FF9E08] text-base">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.75 3.75C11.7292 2.97917 11.4583 2.33333 10.9375 1.8125C10.4167 1.29167 9.77083 1.02083 9 1C8.22917 1.02083 7.58333 1.29167 7.0625 1.8125C6.54167 2.33333 6.27083 2.97917 6.25 3.75C6.25 3.97917 6.34375 4.34375 6.53125 4.84375C6.73958 5.32292 7.02083 5.84375 7.375 6.40625C7.9375 7.30208 8.47917 8.07292 9 8.71875C9.52083 8.07292 10.0625 7.30208 10.625 6.40625C10.9792 5.84375 11.2604 5.32292 11.4688 4.84375C11.6562 4.34375 11.75 3.97917 11.75 3.75ZM12.75 3.75C12.7292 4.33333 12.5208 5.01042 12.125 5.78125C11.7292 6.55208 11.2708 7.30208 10.75 8.03125C10.25 8.73958 9.82292 9.3125 9.46875 9.75C9.34375 9.89583 9.1875 9.96875 9 9.96875C8.8125 9.96875 8.65625 9.89583 8.53125 9.75C8.17708 9.3125 7.75 8.73958 7.25 8.03125C6.72917 7.30208 6.27083 6.55208 5.875 5.78125C5.47917 5.01042 5.27083 4.33333 5.25 3.75C5.27083 2.6875 5.63542 1.80208 6.34375 1.09375C7.05208 0.385417 7.9375 0.0208333 9 0C10.0625 0.0208333 10.9479 0.385417 11.6562 1.09375C12.3646 1.80208 12.7292 2.6875 12.75 3.75ZM12.5938 7C12.8646 6.54167 13.0938 6.09375 13.2812 5.65625L16.9688 4.1875C17.2396 4.08333 17.4688 4.10417 17.6562 4.25C17.8646 4.39583 17.9792 4.60417 18 4.875V13.3438C17.9792 13.6562 17.8229 13.8854 17.5312 14.0312L12.6875 15.9688C12.5833 16.0104 12.4792 16.0104 12.375 15.9688L5.53125 14.0312L1.03125 15.8438C0.760417 15.9271 0.53125 15.8958 0.34375 15.75C0.135417 15.6042 0.0208333 15.3958 0 15.125V6.65625C0.0208333 6.34375 0.177083 6.11458 0.46875 5.96875L4.3125 4.4375C4.375 4.77083 4.47917 5.09375 4.625 5.40625L1 6.84375V14.75L5 13.1562V9.5C5.02083 9.1875 5.1875 9.02083 5.5 9C5.8125 9.02083 5.97917 9.1875 6 9.5V13.125L12 14.8438V9.5C12.0208 9.1875 12.1875 9.02083 12.5 9C12.8125 9.02083 12.9792 9.1875 13 9.5V14.75L17 13.1562V5.25L12.6875 6.96875C12.6667 6.96875 12.6354 6.97917 12.5938 7Z"
                            fill="#FF9E08"
                          />
                        </svg>
                      </span>
                    </div>
                    <p className="font-sans font-medium text-sm leading-[1.5] text-[#333] text-left flex-1">
                      Tầng 2, Toà FS, Toà nhà hỗn hợp Gold Season, số 47 Nguyễn Tuân, Thanh Xuân, Hà Nội
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
