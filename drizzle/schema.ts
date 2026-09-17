import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  },
  table => ({ emailIdx: index("users_email_idx").on(table.email) })
);

export const shipments = mysqlTable(
  "shipments",
  {
    id: int("id").autoincrement().primaryKey(),
    trackingNumber: varchar("trackingNumber", { length: 32 }).notNull(),
    status: mysqlEnum("status", [
      "booked",
      "in_transit",
      "customs",
      "out_for_delivery",
      "delivered",
      "exception",
    ])
      .default("booked")
      .notNull(),
    origin: varchar("origin", { length: 160 }).notNull(),
    destination: varchar("destination", { length: 160 }).notNull(),
    currentLocation: varchar("currentLocation", { length: 160 }),
    estimatedDelivery: timestamp("estimatedDelivery"),
    shipmentType: mysqlEnum("shipmentType", [
      "air",
      "ocean",
      "road",
      "rail",
      "multimodal",
    ]).notNull(),
    serviceLevel: varchar("serviceLevel", { length: 80 }),
    weight: varchar("weight", { length: 80 }),
    customerEmail: varchar("customerEmail", { length: 320 }),
    lastUpdate: timestamp("lastUpdate").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    trackingIdx: uniqueIndex("shipments_tracking_idx").on(table.trackingNumber),
    statusIdx: index("shipments_status_idx").on(table.status),
  })
);

export const shipmentEvents = mysqlTable(
  "shipment_events",
  {
    id: int("id").autoincrement().primaryKey(),
    shipmentId: int("shipmentId").notNull(),
    status: varchar("status", { length: 80 }).notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    description: text("description"),
    location: varchar("location", { length: 160 }),
    eventTime: timestamp("eventTime").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    shipmentIdx: index("shipment_events_shipment_idx").on(table.shipmentId),
    eventTimeIdx: index("shipment_events_time_idx").on(table.eventTime),
  })
);

export const quotes = mysqlTable(
  "quotes",
  {
    id: int("id").autoincrement().primaryKey(),
    fullName: varchar("fullName", { length: 160 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 60 }),
    company: varchar("company", { length: 160 }),
    origin: varchar("origin", { length: 160 }).notNull(),
    destination: varchar("destination", { length: 160 }).notNull(),
    shipmentType: varchar("shipmentType", { length: 80 }).notNull(),
    cargoDescription: text("cargoDescription").notNull(),
    weight: varchar("weight", { length: 80 }),
    dimensions: varchar("dimensions", { length: 120 }),
    shippingMethod: varchar("shippingMethod", { length: 100 }),
    notes: text("notes"),
    status: mysqlEnum("status", ["new", "reviewing", "quoted", "closed"])
      .default("new")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    statusIdx: index("quotes_status_idx").on(table.status),
    emailIdx: index("quotes_email_idx").on(table.email),
  })
);

export const contacts = mysqlTable(
  "contacts",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 60 }),
    subject: varchar("subject", { length: 180 }),
    message: text("message").notNull(),
    status: mysqlEnum("status", ["new", "read", "replied", "closed"])
      .default("new")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({ statusIdx: index("contacts_status_idx").on(table.status) })
);

export const newsletterSubscribers = mysqlTable(
  "newsletter_subscribers",
  {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({ emailIdx: uniqueIndex("newsletter_email_idx").on(table.email) })
);

export const blogPosts = mysqlTable(
  "blog_posts",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull(),
    title: varchar("title", { length: 220 }).notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    category: varchar("category", { length: 80 }).notNull(),
    coverImage: varchar("coverImage", { length: 500 }),
    published: boolean("published").default(false).notNull(),
    publishedAt: timestamp("publishedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("blog_slug_idx").on(table.slug),
    publishedIdx: index("blog_published_idx").on(
      table.published,
      table.publishedAt
    ),
  })
);

export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  quote: text("quote").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  role: varchar("role", { length: 160 }),
  company: varchar("company", { length: 160 }),
  avatarUrl: varchar("avatarUrl", { length: 500 }),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const partners = mysqlTable("partners", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  logoUrl: varchar("logoUrl", { length: 500 }),
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Shipment = typeof shipments.$inferSelect;
export type Quote = typeof quotes.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
