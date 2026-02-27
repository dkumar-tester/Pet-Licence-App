CREATE TABLE IF NOT EXISTS "PetApplications" (
    "Id" uuid NOT NULL,
    "ApplicantFirstName" character varying(100) NOT NULL,
    "ApplicantLastName" character varying(100) NOT NULL,
    "Email" character varying(200) NOT NULL,
    "Phone" character varying(30) NOT NULL,
    "PrimaryAddress" character varying(500) NOT NULL,
    "SecondaryAddress" character varying(500),
    "PetName" character varying(100) NOT NULL,
    "PetType" character varying(50) NOT NULL,
    "Breed" character varying(100) NOT NULL,
    "Age" integer NOT NULL,
    "Color" character varying(50) NOT NULL,
    "Sex" character varying(20) NOT NULL,
    "HairLength" character varying(20) NOT NULL,
    "SpayedNeutered" boolean NOT NULL,
    "ClinicName" character varying(200) NOT NULL,
    "VetName" character varying(200) NOT NULL,
    "Status" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "ProvisionalLicenceNumber" character varying(50),
    "StripePaymentIntentId" character varying(200),
    CONSTRAINT "PK_PetApplications" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS "AuditLogs" (
    "Id" uuid NOT NULL,
    "PetApplicationId" uuid NOT NULL,
    "OccurredAt" timestamp with time zone NOT NULL,
    "Actor" character varying(200) NOT NULL,
    "Action" character varying(200) NOT NULL,
    "OldValue" text,
    "NewValue" text,
    CONSTRAINT "PK_AuditLogs" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_AuditLogs_PetApplications_PetApplicationId"
        FOREIGN KEY ("PetApplicationId") REFERENCES "PetApplications" ("Id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "IX_AuditLogs_PetApplicationId" ON "AuditLogs" ("PetApplicationId");

-- Remove the falsely-recorded migration so EF can detect state properly
DELETE FROM "__EFMigrationsHistory";
