# Voke Roleplay Projekt-Guidelines

## Ordnerstruktur

```
📂 Voke Server
├── 📂 api            # Alle Anfragen vom Client oder HTTP (Commands, Events, HttpRequests)
├── 📂 core           # Zentrale Logik des Projekts (Services, Entities)
│   ├── 📂 TYPE       # Alle nicht-implementierten Typen (Interfaces)
│   ├── 📂 TYPE/impl  # Implementierungen (Klassen, Entities, etc.)
├── 📂 data           # Datenbankaktionen (Repositories, CRUDs) 
                      # (Nicht genutzt, da TypeORM verwendet wird)
```

## Namenskonventionen

### Get vs. Find
- `get` gibt einen **gecachten Wert** zurück.  
- `find` durchsucht die **Datenbank**.  

**Beispiel:**  
```ts
getUser(id: number): CachedUser  // Holt den Nutzer aus dem Cache  
findUser(id: number): DbUser     // Sucht den Nutzer in der Datenbank  
```
