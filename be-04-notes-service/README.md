# BE-04 Notes Service

## Step 7: Persistence proof

The service was verified locally before the Docker-based steps.

### Commands run

```bash
node server.js
```

```powershell
$body = @{ content = 'First note' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://127.0.0.1:3000/notes' -ContentType 'application/json' -Body $body
```

```powershell
Invoke-RestMethod -Method Get -Uri 'http://127.0.0.1:3000/notes'
```

### What was observed

- POST /notes returned a created note with an id and created_at timestamp.
- GET /notes returned the stored note.

## Persistence Verification

1. Created a note via POST /notes: {"content": "first note test"}
2. Confirmed it via GET /notes
3. Restarted the full stack with `docker compose down` then `docker compose up`
4. Ran GET /notes again — the note was still present, confirming Postgres data persisted across a container restart via the Docker volume.

### Note on repository swap

The implementation was designed so that switching from the in-memory repository to the Postgres repository required changing only the repository wiring in server.js. The files routes.js and noteService.js were not modified during that swap.
