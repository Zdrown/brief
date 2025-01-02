'use client'; //authentication/page.js

import React, { useState } from 'react'
import styled from 'styled-components'
import { supabase } from '../../../utils/supabaseClient'
import { useRouter } from 'next/navigation'

// Container styling
const Container = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 3rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`
const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 15vh; /* or min-height: 400px; */
  overflow: hidden;
`;

const VideoBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;

  video {
    width: 110%;
    height: 100%;
    object-fit: cover;
  }
`;


// Title (Login / Sign Up)
const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.darkBlue};
`

// Form label text
const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkBlue};
`

// Input fields
const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.darkBlue};
`

// Main action button (Login/Sign Up)
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

// Toggle button for switching between Login and Sign Up
const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.darkBlue};
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  &:hover {
    text-decoration: underline;
  }
`

// Link text (e.g., Forgot Password?)
const LinkText = styled.a`
  color: ${({ theme }) => theme.colors.darkBlue};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

// New: A styled paragraph to display "Don't have an account?" text in dark blue
const InfoParagraph = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.darkBlue};
`

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false) // toggle mode

  async function handleAuth() {
    setLoading(true)
    try {
      if (isSignUp) {
        // Sign Up
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Sign-up successful! Check your email for confirmation.')
      } else {
        // Login
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        alert('Logged in successfully!')
        router.push('/dashboard')
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <HeroSection>
      <VideoBackground>
        <video autoPlay muted loop>
          <source src="/BriefVideo2.mp4" type="video/mp4" />
        </video>
      </VideoBackground>
      {/* Title or other elements can be layered above if you like */}
    </HeroSection>


    <Container>
      <Title>{isSignUp ? 'Sign Up' : 'Login'}</Title>
      
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div>
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <Button onClick={handleAuth} disabled={loading}>
        {loading
          ? (isSignUp ? 'Signing Up...' : 'Logging In...')
          : (isSignUp ? 'Sign Up' : 'Login')}
      </Button>

      {!isSignUp && (
        <InfoParagraph>
          <LinkText onClick={() => router.push('/authentication/reset-password')}>
            Forgot Password?
          </LinkText>
        </InfoParagraph>
      )}

      <InfoParagraph>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <ToggleButton onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Login' : 'Sign Up'}
        </ToggleButton>
      </InfoParagraph>
    </Container>

    </>
  )
}
