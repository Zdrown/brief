'use client';

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { supabase } from '../../../../utils/supabaseClient'
import { useRouter } from 'next/navigation'

// Container
const Container = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`

// Title
const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.darkBlue};
`

// Label
const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkBlue};
`

// Input
const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.darkBlue};
`

// Button
const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #0070f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  &:hover {
    background: ${({ theme }) => theme.colors.darkBlue};
  }
`

// InfoParagraph (styled p)
const InfoParagraph = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.darkBlue};
`

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false)
  const router = useRouter()

  // 1. Check if user came from the reset link (Supabase sets a temporary session)
  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // If there's an active session, it means the user clicked the reset link
      // and is logged in with a temporary token. Show the "new password" form.
      if (session) {
        setShowNewPasswordForm(true)
      }
    }
    checkSession()
  }, [])

  // 2. Request reset link for the given email
  async function handleSendResetLink() {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      })
      if (error) throw error
      alert('Password reset link sent! Check your email.')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 3. Set the new password after user clicks the email link
  async function handleUpdatePassword() {
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      alert('Password updated successfully!')
      router.push('/login') // or wherever you want to redirect after reset
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Title>Reset Password</Title>

      {!showNewPasswordForm ? (
        // Step 1: Request a reset link by email
        <>
          <Label>Enter Your Email</Label>
          <Input
            type="email"
            placeholder="Your account email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleSendResetLink} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <InfoParagraph>
            A link to reset your password will be sent to your email address.
          </InfoParagraph>
        </>
      ) : (
        // Step 2: Update password (once user is verified / session active)
        <>
          <Label>New Password</Label>
          <Input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button onClick={handleUpdatePassword} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </>
      )}
    </Container>
  )
}
