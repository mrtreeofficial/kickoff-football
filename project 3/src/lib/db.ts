import { openDB, DBSchema, IDBPDatabase } from 'idb';
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode('your-secret-key');
const JWT_ALG = 'HS256';

interface KickOffDB extends DBSchema {
  users: {
    key: string;
    value: {
      id: string;
      email: string;
      passwordHash: string;
      fullName: string;
      dateOfBirth: string;
      isAdmin: boolean;
      isPlayer?: boolean;
      teamId?: string;
      isCaptain?: boolean;
      emergencyContact: {
        name: string;
        relationship: string;
        phone: string;
        email?: string;
      };
    };
    indexes: { 
      'by-email': string;
      'by-team': string;
    };
  };
  teams: {
    key: string;
    value: {
      id: string;
      name: string;
      played: number;
      won: number;
      drawn: number;
      lost: number;
      goals_for: number;
      goals_against: number;
      goal_difference: number;
      points: number;
      division: 1 | 2;
      location: string;
      game_day: string;
      crest?: string;
      captainId?: string;
    };
    indexes: {
      'by-location-day': [string, string];
      'by-division': number;
      'by-captain': string;
    };
  };
  players: {
    key: string;
    value: {
      id: string;
      userId: string;
      teamId: string;
      goals: number;
      assists: number;
      gamesPlayed: number;
      yellowCards: number;
      redCards: number;
    };
    indexes: {
      'by-team': string;
      'by-user': string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<KickOffDB>>;
let dbInitialized = false;

const sampleTeams = [
  {
    id: crypto.randomUUID(),
    name: 'Red Dragons FC',
    played: 5,
    won: 4,
    drawn: 1,
    lost: 0,
    goals_for: 15,
    goals_against: 5,
    goal_difference: 10,
    points: 13,
    division: 1,
    location: 'Willen Lake, Kick Off Sports Centre',
    game_day: 'Monday',
    crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=dragon&backgroundColor=dc2626'
  },
  {
    id: crypto.randomUUID(),
    name: 'Blue Lightning',
    played: 5,
    won: 3,
    drawn: 1,
    lost: 1,
    goals_for: 12,
    goals_against: 7,
    goal_difference: 5,
    points: 10,
    division: 1,
    location: 'Willen Lake, Kick Off Sports Centre',
    game_day: 'Monday',
    crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=lightning&backgroundColor=2563eb'
  }
];

async function initDB() {
  if (!dbPromise) {
    dbPromise = openDB<KickOffDB>('kickoff-db', 1, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (oldVersion < 1) {
          // Users store
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('by-email', 'email', { unique: true });
          userStore.createIndex('by-team', 'teamId');

          // Teams store
          const teamStore = db.createObjectStore('teams', { keyPath: 'id' });
          teamStore.createIndex('by-location-day', ['location', 'game_day']);
          teamStore.createIndex('by-division', 'division');
          teamStore.createIndex('by-captain', 'captainId');

          // Players store
          const playerStore = db.createObjectStore('players', { keyPath: 'id' });
          playerStore.createIndex('by-team', 'teamId');
          playerStore.createIndex('by-user', 'userId');

          // Add admin user
          const adminId = crypto.randomUUID();
          transaction.objectStore('users').add({
            id: adminId,
            email: 'camerondk47@gmail.com',
            passwordHash: 'admin123',
            isAdmin: true
          });

          // Add sample teams
          const teamsStore = transaction.objectStore('teams');
          return Promise.all(sampleTeams.map(team => teamsStore.add(team)));
        }
      },
    });
    dbInitialized = true;
  }
  return dbPromise;
}

class Database {
  private async ensureInitialized() {
    if (!dbInitialized) {
      await initDB();
    }
    return dbPromise;
  }

  async execute<T = any>(query: { sql: string; args?: any[] }): Promise<{ rows: T[] }> {
    const db = await this.ensureInitialized();
    const [action, ...parts] = query.sql.trim().toLowerCase().split(/\s+/);
    const store = parts[1]?.toLowerCase();

    try {
      switch (action) {
        case 'select': {
          const tx = db.transaction([store], 'readonly');
          const objectStore = tx.objectStore(store);

          if (query.sql.includes('where')) {
            if (query.sql.includes('team_id')) {
              const [teamId] = query.args || [];
              const index = objectStore.index('by-team');
              const items = await index.getAll(teamId);
              return { rows: items as T[] };
            }

            const [id] = query.args || [];
            const item = await objectStore.get(id);
            return { rows: item ? [item] as T[] : [] };
          }

          const items = await objectStore.getAll();
          return { rows: items as T[] };
        }

        case 'update': {
          const tx = db.transaction([store], 'readwrite');
          const objectStore = tx.objectStore(store);
          
          const id = query.args![query.args!.length - 1];
          const item = await objectStore.get(id);
          if (!item) throw new Error('Item not found');

          const updates = {};
          const fields = query.sql.match(/(\w+)\s*=\s*\?/g)?.map(match => match.split('=')[0].trim());
          fields?.forEach((field, index) => {
            updates[field] = query.args![index];
          });

          await objectStore.put({ ...item, ...updates });
          return { rows: [] };
        }

        case 'insert': {
          const tx = db.transaction([store], 'readwrite');
          const objectStore = tx.objectStore(store);
          
          const item = {};
          const fields = query.sql.match(/\((.*?)\)/)?.[1].split(',').map(f => f.trim());
          fields?.forEach((field, index) => {
            item[field] = query.args![index];
          });

          await objectStore.add(item);
          return { rows: [] };
        }

        case 'delete': {
          const tx = db.transaction([store], 'readwrite');
          const objectStore = tx.objectStore(store);
          
          await objectStore.delete(query.args![0]);
          return { rows: [] };
        }

        default:
          throw new Error(`Unsupported operation: ${action}`);
      }
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async getUserTeam(userId: string): Promise<any> {
    const db = await this.ensureInitialized();
    const tx = db.transaction(['users', 'teams'], 'readonly');
    
    const user = await tx.objectStore('users').get(userId);
    if (!user?.teamId) return null;
    
    return await tx.objectStore('teams').get(user.teamId);
  }

  async getTeamPlayers(teamId: string): Promise<any[]> {
    const db = await this.ensureInitialized();
    const tx = db.transaction(['players', 'users'], 'readonly');
    
    const players = await tx.objectStore('players').index('by-team').getAll(teamId);
    const userStore = tx.objectStore('users');
    
    const playersWithDetails = await Promise.all(
      players.map(async player => {
        const user = await userStore.get(player.userId);
        return {
          ...player,
          name: user.fullName
        };
      })
    );

    return playersWithDetails;
  }
}

export const db = new Database();

export async function createUser(
  email: string, 
  password: string, 
  fullName: string,
  dateOfBirth: string,
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  }
): Promise<string> {
  const db = await initDB();
  const id = crypto.randomUUID();

  // Check if user already exists
  const tx = db.transaction('users', 'readwrite');
  const userStore = tx.objectStore('users');
  const existingUser = await userStore.index('by-email').get(email);

  if (existingUser) {
    throw new Error('User already exists');
  }

  // Create new user with additional fields
  await userStore.add({
    id,
    email,
    passwordHash: password, // In production, this should be properly hashed
    fullName,
    dateOfBirth,
    emergencyContact,
    isAdmin: false,
    isPlayer: true
  });

  // Generate JWT token
  return await new jose.SignJWT({ id, email, isAdmin: false, isPlayer: true })
    .setProtectedHeader({ alg: JWT_ALG })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function loginUser(email: string, password: string): Promise<string> {
  const db = await initDB();
  const tx = db.transaction('users', 'readonly');
  const userStore = tx.objectStore('users');
  const user = await userStore.index('by-email').get(email);

  if (!user || user.passwordHash !== password) {
    throw new Error('Invalid credentials');
  }

  return await new jose.SignJWT({ 
    id: user.id, 
    email: user.email, 
    isAdmin: user.isAdmin,
    isPlayer: user.isPlayer 
  })
    .setProtectedHeader({ alg: JWT_ALG })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as {
      id: string;
      email: string;
      isAdmin: boolean;
      isPlayer?: boolean;
    };
  } catch {
    return null;
  }
}

export { initDB };