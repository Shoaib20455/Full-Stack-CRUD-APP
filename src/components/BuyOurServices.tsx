"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import { useUser } from '@clerk/nextjs'
const BuyOurServices = () => {
const { isSignedIn, user, isLoaded } = useUser()

  // Handle loading state
  if (!isLoaded) return <div>Loading...</div>

  // Protect the page from unauthenticated users
  if (!isSignedIn) return <div>Sign in to view this page</div>

  
  return (
    <div>Now you can buy out Services {user.firstName}!

<div className="p-4"> 
     
      <Button>Buy</Button>
    </div> 
    </div>
  )
}

export default BuyOurServices