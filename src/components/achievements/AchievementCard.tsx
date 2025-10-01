'use client';

import { useState } from 'react';
import type { Achievement } from '@/types/achievements';

export default function AchievementCard({ achievement }: { achievement: Achievement }) {
  const [showModal, setShowModal] = useState(false);

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      legendary: '#F59E08',
      epic: '#8B5CF6',
      rare: '#3B82F6',
      common: '#6B7280'
    };
    return colors[rarity] || colors.common;
  };

  const rarityColor = getRarityColor(achievement.rarity);

  return (
    <>
      <div 
        className="card" 
        onClick={() => setShowModal(true)}
        style={{ 
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{achievement.icon}</div>
          <span style={{ 
            fontSize: '0.75rem', 
            padding: '0.25rem 0.5rem', 
            border: '1px solid var(--color-border)', 
            borderRadius: '4px', 
            color: 'var(--color-text-secondary)' 
          }}>
            {achievement.badge}
          </span>
          <h3 style={{ margin: '1rem 0 0.5rem' }}>{achievement.title}</h3>
          <p className="text-secondary" style={{ fontSize: '0.875rem', minHeight: '3rem' }}>
            {achievement.description}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
            <span style={{ 
              fontSize: '0.75rem', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '4px', 
              background: `${rarityColor}20`, 
              color: rarityColor 
            }}>
              {achievement.rarity}
            </span>
            <span style={{ 
              fontSize: '0.75rem', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '4px', 
              border: '1px solid var(--color-border)', 
              color: 'var(--color-text-secondary)' 
            }}>
              {achievement.type}
            </span>
          </div>
        </div>
      </div>

      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            className="paper"
            style={{
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{achievement.icon}</div>
              <h2 style={{ marginBottom: '1rem' }}>{achievement.title}</h2>
              <span style={{ 
                fontSize: '0.875rem', 
                padding: '0.5rem 1rem', 
                border: '1px solid var(--color-border)', 
                borderRadius: '4px', 
                color: 'var(--color-text-secondary)' 
              }}>
                {achievement.badge}
              </span>
              
              <p className="text-secondary" style={{ margin: '1.5rem 0', fontSize: '1rem' }}>
                {achievement.description}
              </p>
              
              <div style={{ 
                backgroundColor: 'var(--color-background)', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                marginBottom: '1.5rem' 
              }}>
                <h4 style={{ marginBottom: '0.75rem', color: 'var(--color-text-primary)' }}>
                  Requirements
                </h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  {achievement.requirements}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '4px', 
                  background: `${rarityColor}20`, 
                  color: rarityColor,
                  fontWeight: '600'
                }}>
                  {achievement.rarity}
                </span>
                <span style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '4px', 
                  border: '1px solid var(--color-border)', 
                  color: 'var(--color-text-secondary)' 
                }}>
                  {achievement.category}
                </span>
                <span style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '4px', 
                  border: '1px solid var(--color-border)', 
                  color: 'var(--color-text-secondary)' 
                }}>
                  {achievement.type}
                </span>
              </div>

              <button
                className="button"
                onClick={() => setShowModal(false)}
                style={{ marginTop: '1.5rem', width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

