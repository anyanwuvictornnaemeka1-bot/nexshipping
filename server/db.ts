import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  blogPosts,
  contacts,
  InsertUser,
  newsletterSubscribers,
  quotes,
  shipmentEvents,
  shipments,
  testimonials,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  } else {
    values.lastSignedIn = new Date();
    updateSet.lastSignedIn = new Date();
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  await db
    .insert(users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result[0];
}

export async function findShipmentByTrackingNumber(trackingNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(shipments)
    .where(eq(shipments.trackingNumber, trackingNumber))
    .limit(1);
  if (!result[0]) return undefined;
  const events = await db
    .select()
    .from(shipmentEvents)
    .where(eq(shipmentEvents.shipmentId, result[0].id))
    .orderBy(desc(shipmentEvents.eventTime));
  return { shipment: result[0], events };
}

export async function createQuote(input: typeof quotes.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  const result = await db.insert(quotes).values(input);
  return result[0].insertId;
}

export async function createContact(input: typeof contacts.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  const result = await db.insert(contacts).values(input);
  return result[0].insertId;
}

export async function subscribeToNewsletter(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db
    .insert(newsletterSubscribers)
    .values({ email })
    .onDuplicateKeyUpdate({ set: { isActive: true } });
}

export async function getPublishedContent() {
  const db = await getDb();
  if (!db) return { posts: [], testimonials: [] };
  const [posts, publishedTestimonials] = await Promise.all([
    db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(3),
    db
      .select()
      .from(testimonials)
      .where(eq(testimonials.published, true))
      .orderBy(desc(testimonials.createdAt))
      .limit(6),
  ]);
  return { posts, testimonials: publishedTestimonials };
}

export async function getAdminOverview() {
  const db = await getDb();
  if (!db) return { shipments: [], quotes: [], contacts: [], subscribers: 0 };
  const [shipmentRows, quoteRows, contactRows, subscriberRows] =
    await Promise.all([
      db.select().from(shipments).orderBy(desc(shipments.updatedAt)).limit(25),
      db.select().from(quotes).orderBy(desc(quotes.createdAt)).limit(25),
      db.select().from(contacts).orderBy(desc(contacts.createdAt)).limit(25),
      db
        .select({ count: sql<number>`count(*)` })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.isActive, true)),
    ]);
  return {
    shipments: shipmentRows,
    quotes: quoteRows,
    contacts: contactRows,
    subscribers: Number(subscriberRows[0]?.count ?? 0),
  };
}

export async function updateQuoteStatus(
  id: number,
  status: "new" | "reviewing" | "quoted" | "closed"
) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.update(quotes).set({ status }).where(eq(quotes.id, id));
}

export async function updateContactStatus(
  id: number,
  status: "new" | "read" | "replied" | "closed"
) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.update(contacts).set({ status }).where(eq(contacts.id, id));
}

export async function createShipment(input: typeof shipments.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  const result = await db.insert(shipments).values(input);
  return result[0].insertId;
}

export async function addShipmentEvent(
  input: typeof shipmentEvents.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  const result = await db.insert(shipmentEvents).values(input);
  await db
    .update(shipments)
    .set({
      lastUpdate: input.eventTime,
      currentLocation: input.location,
      status: input.status as any,
    })
    .where(eq(shipments.id, input.shipmentId));
  return result[0].insertId;
}

export async function getShipmentCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(shipments);
  return Number(result[0]?.count ?? 0);
}
