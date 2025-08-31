'use client'

import React, { useEffect, useRef } from 'react'

type Etape1Components = {
  RetourPageAccueil: () => void
  dureeVieDefault: number
  dureeVieChoisie: (value: number) => void
  generationCle: () => void
}


export default function Etape1Parametrage({
  RetourPageAccueil,
  dureeVieDefault,
  dureeVieChoisie,
  generationCle,
}: Etape1Components) {
  
  return (
    <div className="nata-sans-regular" 
      style={{
        height: '100vh',
        width: '100%',
        backgroundColor: '#f9f9f9',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
        paddingTop: '5rem',
        maxWidth: '60rem',
        margin: 'auto'
      }}
    >
      <button
        onClick={RetourPageAccueil}
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
        }}
      >
        ←
      </button>

      <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '1rem' }}>
        Paramétrez votre conversation
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
        <label style={{ fontWeight: 'bold', display: 'block'}}>
          Durée de vie
        </label>
        <div>
          <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '1rem',
                  verticalAlign: 'middle',
                }}
                aria-label="Information"
              >
                info
          </span>
          <span style={{ fontSize: '.75rem', marginLeft: '0.5rem', margin:'auto' }}>
            Nombres de jours avant que la conversation expire. La durée minimale est de 1 jour.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
          <input
            type="number"
            min={1}
            max={100}
            placeholder="Durée de vie"
            value={dureeVieDefault}
            onChange={(e) => {
              let jours = parseInt(e.target.value || '1', 10)
              if (jours < 1) jours = 1
              if (jours > 1000) jours = 1000
              dureeVieChoisie(jours)
            }}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              width: '100px',
            }}
          />

          <span style={{ fontSize: '1rem' }}>jours</span>
        </div>
      </div>

      <button
        onClick={generationCle}
        style={{
          marginTop: '2rem',
          padding: '0.75rem',
          fontSize: '1.1rem',
          backgroundColor: 'rgb(55 107 85)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          width: 'fit-content',
          alignSelf: 'center',
          paddingLeft: '2rem',
          paddingRight: '2rem',
        }}
      >
        Générer la clé 
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '1.5rem',
            verticalAlign: 'middle',
            marginLeft: '1.25rem',
          }}
          aria-label="Créer"
        >
          send
        </span>
      </button>
    </div>
  )
}
