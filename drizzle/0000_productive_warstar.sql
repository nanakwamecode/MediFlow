CREATE TYPE "public"."lab_status" AS ENUM('pending', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."otp_code_type" AS ENUM('register', 'reset');--> statement-breakpoint
CREATE TYPE "public"."prescription_status" AS ENUM('pending', 'dispensed', 'cancelled');--> statement-breakpoint
CREATE TABLE "consultations" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" uuid NOT NULL,
	"time" timestamp with time zone DEFAULT now() NOT NULL,
	"doctor_id" varchar(200) NOT NULL,
	"symptoms" text,
	"diagnosis" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "lab_investigations" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" uuid NOT NULL,
	"time_requested" timestamp with time zone DEFAULT now() NOT NULL,
	"time_completed" timestamp with time zone,
	"requested_by" varchar(200) NOT NULL,
	"test_name" varchar(200) NOT NULL,
	"status" "lab_status" DEFAULT 'pending' NOT NULL,
	"result" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "otp_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" varchar(30) NOT NULL,
	"code" varchar(6) NOT NULL,
	"type" "otp_code_type" NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"opd_number" varchar(50),
	"age" varchar(10),
	"phone" varchar(30),
	"town" varchar(100),
	"gender" varchar(20),
	"dob" varchar(20),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prescriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" uuid NOT NULL,
	"time_prescribed" timestamp with time zone DEFAULT now() NOT NULL,
	"time_dispensed" timestamp with time zone,
	"prescribed_by" varchar(200) NOT NULL,
	"medication" varchar(300) NOT NULL,
	"dosage" varchar(200) NOT NULL,
	"instructions" text NOT NULL,
	"status" "prescription_status" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(100) NOT NULL,
	"password_hash" text NOT NULL,
	"display_name" varchar(200) NOT NULL,
	"phone" varchar(30),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "vitals" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" uuid NOT NULL,
	"time" timestamp with time zone DEFAULT now() NOT NULL,
	"sys" integer,
	"dia" integer,
	"pulse" integer,
	"temperature" real,
	"respiratory_rate" integer,
	"weight" real,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_investigations" ADD CONSTRAINT "lab_investigations_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vitals" ADD CONSTRAINT "vitals_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;