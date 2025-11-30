"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/LoginForm"
import { SignUpForm } from "@/components/auth/SignupForm"

export function AuthTabs() {
  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2 rounded-full">
        <TabsTrigger value="login" className="rounded-full">
          Login
        </TabsTrigger>
        <TabsTrigger value="signup" className="rounded-full">
          Sign Up
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="mt-4">
        <LoginForm />
      </TabsContent>

      <TabsContent value="signup" className="mt-4">
        <SignUpForm />
      </TabsContent>
    </Tabs>
  )
}
