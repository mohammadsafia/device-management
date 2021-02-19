import express from 'express'
declare global {
  namespace Express {
    export interface Request {
      userData: {
        userId: string
      },
      userRole: {
        role: number | string
      }
    }
  }
}