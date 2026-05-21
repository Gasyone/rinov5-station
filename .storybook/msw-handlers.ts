import { http, HttpResponse } from 'msw'

export const mswHandlers = {
  auth: [
    http.post('/api/auth/login', () =>
      HttpResponse.json({
        ok: true,
      })
    ),
    http.post('/api/auth/logout', () =>
      HttpResponse.json({
        ok: true,
      })
    ),
  ],
}
