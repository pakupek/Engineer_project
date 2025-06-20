'use client'
import React from 'react'

export default function HomePage() {
  return (
    <main style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: '#f5f7fa',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      color: '#333',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        background: 'white',
        padding: '2.5rem 3rem',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '90%',
        textAlign: 'center',
      }}>
        <h1 style={{
          color: '#2c3e50',
          marginBottom: '1rem',
          fontWeight: 700,
          fontSize: '2.5rem'
        }}>
          Witamy w Icar
        </h1>
        <p style={{
          fontSize: '1.125rem',
          marginBottom: '2rem',
          lineHeight: 1.5,
          color: '#555'
        }}>
          To jest aplikacja do przeglądania historii pojazdu.
        </p>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}>
          {["Sprawdź VIN", "Zobacz historię", "Zgłoś błędne dane"].map((feature, index) => (
            <li
              key={index}
              style={{
                background: '#3498db',
                color: 'white',
                margin: '0.5rem 0',
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
                boxShadow: '0 3px 6px rgba(52,152,219,0.4)',
                cursor: 'default',
                transition: 'background 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#2980b9'}
              onMouseLeave={e => e.currentTarget.style.background = '#3498db'}
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
