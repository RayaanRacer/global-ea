import { decimal, text, timestamp } from "drizzle-orm/mysql-core";
import {
  mysqlTable,
  int,
  varchar,
  mysqlEnum,
  boolean,
  index,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable(
  "users",
  {
    id: int("id").primaryKey().autoincrement(),

    uuid: varchar("uuid", {
      length: 191,
    })
      .notNull()
      .unique(),

    firstName: varchar("first_name", {
      length: 100,
    }),

    lastName: varchar("last_name", {
      length: 100,
    }),

    email: varchar("email", {
      length: 191,
    })
      .notNull()
      .unique(),

    phone: varchar("phone", {
      length: 20,
    }).unique(),

    role: varchar("role", {
      length: 50,
    })
      .default("ADMIN")
      .notNull(),

    status: varchar("status", {
      length: 50,
    })
      .default("ACTIVE")
      .notNull(),

    isEmailVerified: boolean("is_email_verified").default(false).notNull(),

    isPhoneVerified: boolean("is_phone_verified").default(false).notNull(),

    is2FAEnabled: boolean("is_2fa_enabled").default(false).notNull(),

    profileImage: varchar("profile_image", {
      length: 500,
    }),

    lastLoginAt: timestamp("last_login_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),

    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    emailIndex: index("users_email_idx").on(table.email),

    phoneIndex: index("users_phone_idx").on(table.phone),

    roleIndex: index("users_role_idx").on(table.role),
  }),
);

export const userLogin = mysqlTable("user_login", {
  id: int("id").primaryKey().autoincrement(),

  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  email: varchar("email", {
    length: 191,
  }).notNull(),
  password: varchar("password", {
    length: 191,
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const rides = mysqlTable(
  "rides",
  {
    id: int("id").primaryKey().autoincrement(),

    riderId: int("rider_id").notNull(),

    pickupAddress: text("pickup_address").notNull(),

    dropAddress: text("drop_address").notNull(),

    pickupLatitude: decimal("pickup_latitude", {
      precision: 10,
      scale: 7,
    }).notNull(),

    pickupLongitude: decimal("pickup_longitude", {
      precision: 10,
      scale: 7,
    }).notNull(),

    dropLatitude: decimal("drop_latitude", {
      precision: 10,
      scale: 7,
    }).notNull(),

    dropLongitude: decimal("drop_longitude", {
      precision: 10,
      scale: 7,
    }).notNull(),

    distanceKm: decimal("distance_km", {
      precision: 10,
      scale: 2,
    }),

    estimatedFare: decimal("estimated_fare", {
      precision: 10,
      scale: 2,
    }),

    finalFare: decimal("final_fare", {
      precision: 10,
      scale: 2,
    }),

    rideType: varchar("ride_type", {
      length: 50,
    })
      .default("STANDARD")
      .notNull(),

    paymentMethod: varchar("payment_method", {
      length: 50,
    }).default("CASH"),

    paymentStatus: varchar("payment_status", {
      length: 50,
    })
      .default("PENDING")
      .notNull(),

    status: varchar("status", {
      length: 50,
    })
      .default("REQUESTED")
      .notNull(),

    cancelReason: text("cancel_reason"),

    requestedAt: timestamp("requested_at").defaultNow().notNull(),

    acceptedAt: timestamp("accepted_at"),

    startedAt: timestamp("started_at"),

    completedAt: timestamp("completed_at"),

    cancelledAt: timestamp("cancelled_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    riderIndex: index("rides_rider_idx").on(table.riderId),

    statusIndex: index("rides_status_idx").on(table.status),
  }),
);

export const rideLocationLogs = mysqlTable(
  "ride_location_logs",
  {
    id: int("id").primaryKey().autoincrement(),

    rideId: int("ride_id").notNull(),

    latitude: decimal("latitude", {
      precision: 10,
      scale: 7,
    }).notNull(),

    longitude: decimal("longitude", {
      precision: 10,
      scale: 7,
    }).notNull(),

    speed: decimal("speed", {
      precision: 6,
      scale: 2,
    }),

    heading: decimal("heading", {
      precision: 6,
      scale: 2,
    }),

    recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  },
  (table) => ({
    rideIndex: index("ride_location_logs_ride_idx").on(table.rideId),

    recordedAtIndex: index("ride_location_logs_recorded_at_idx").on(
      table.recordedAt,
    ),
  }),
);
