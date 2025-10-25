import Navbar from '@/components/ownercomponents/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/ownercomponents/AppSideBar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const OwnerLayout = () => {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className='w-full '>
          <Navbar />
          <div className='px-3 py-2'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/seller">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}

export default OwnerLayout