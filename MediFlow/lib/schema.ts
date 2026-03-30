import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  timestamp,
  pgEnum,
  serial,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ─── Enums ─── */
export const labStatusEnum = pgEnum("lab_status", [
  "pending",
  "completed",
  "cancelled",
]);

export const prescriptionStatusEnum = pgEnum("prescription_status", [
  "pending",
  "dispensed",
  "cancelled",
]);

/* ─── Users (Auth) ─── */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: varchar("display_name", { length: 200 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* ─── Patients ─── */
export const patients = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  opdNumber: varchar("opd_number", { length: 50 }),
  age: varchar("age", { length: 10 }),
  phone: varchar("phone", { length: 30 }),
  town: varchar("town", { length: 100 }),
  gender: varchar("gender", { length: 20 }),
  dob: varchar("dob", { length: 20 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* ─── Vitals ─── */
export const vitals = pgTable("vitals", {
  id: serial("id").primaryKey(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  time: timestamp("time", { withTimezone: true }).defaultNow().notNull(),
  sys: integer("sys"),
  dia: integer("dia"),
  pulse: integer("pulse"),
  temperature: real("temperature"),
  respiratoryRate: integer("respiratory_rate"),
  weight: real("weight"),
  notes: text("notes"),
});

/* ─── Consultations ─── */
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  time: timestamp("time", { withTimezone: true }).defaultNow().notNull(),
  doctorId: varchar("doctor_id", { length: 200 }).notNull(),
  symptoms: text("symptoms"),
  diagnosis: text("diagnosis"),
  notes: text("notes"),
});

/* ─── Lab Investigations ─── */
export const labInvestigations = pgTable("lab_investigations", {
  id: serial("id").primaryKey(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  timeRequested: timestamp("time_requested", { withTimezone: true })
    .defaultNow()
    .notNull(),
  timeCompleted: timestamp("time_completed", { withTimezone: true }),
  requestedBy: varchar("requested_by", { length: 200 }).notNull(),
  testName: varchar("test_name", { length: 200 }).notNull(),
  status: labStatusEnum("status").default("pending").notNull(),
  result: text("result"),
  notes: text("notes"),
});

/* ─── Prescriptions ─── */
export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  timePrescribed: timestamp("time_prescribed", { withTimezone: true })
    .defaultNow()
    .notNull(),
  timeDispensed: timestamp("time_dispensed", { withTimezone: true }),
  prescribedBy: varchar("prescribed_by", { length: 200 }).notNull(),
  medication: varchar("medication", { length: 300 }).notNull(),
  dosage: varchar("dosage", { length: 200 }).notNull(),
  instructions: text("instructions").notNull(),
  status: prescriptionStatusEnum("status").default("pending").notNull(),
});

/* ─── Relations ─── */
export const patientsRelations = relations(patients, ({ many }) => ({
  vitals: many(vitals),
  consultations: many(consultations),
  labInvestigations: many(labInvestigations),
  prescriptions: many(prescriptions),
}));

export const vitalsRelations = relations(vitals, ({ one }) => ({
  patient: one(patients, {
    fields: [vitals.patientId],
    references: [patients.id],
  }),
}));

export const consultationsRelations = relations(consultations, ({ one }) => ({
  patient: one(patients, {
    fields: [consultations.patientId],
    references: [patients.id],
  }),
}));

export const labInvestigationsRelations = relations(
  labInvestigations,
  ({ one }) => ({
    patient: one(patients, {
      fields: [labInvestigations.patientId],
      references: [patients.id],
    }),
  })
);

export const prescriptionsRelations = relations(
  prescriptions,
  ({ one }) => ({
    patient: one(patients, {
      fields: [prescriptions.patientId],
      references: [patients.id],
    }),
  })
);
