# Prisma Database Model Plan

This project currently uses Supabase Auth, Supabase tables, Row Level Security, and direct Supabase client queries. If Prisma is added later, it should model the public application tables while Supabase Auth remains the source of truth for authentication.

## Recommendation

Do not replace Supabase Auth with Prisma. Use Prisma only for server-side database operations if needed.

Recommended split:

- Supabase Auth: login, register, email confirmation, sessions.
- Supabase client: browser-safe reads/writes that rely on RLS.
- Prisma: optional server-only admin/reporting workflows.

If Prisma is used, never expose Prisma queries directly to the browser.

## Tables

### profiles

Stores app-level user data. Each profile maps to one Supabase Auth user.

Columns:

| Column | Type | Required | Default | Notes |
|---|---:|---:|---|---|
| id | UUID | yes | none | Primary key. References `auth.users.id` in Supabase. |
| email | TEXT | yes | none | User email. |
| full_name | TEXT | no | null | Display name. |
| phone | TEXT | no | null | Phone number. |
| user_type | TEXT | yes | none | `passenger` or `driver`. |
| created_at | TIMESTAMPTZ | yes | `now()` | Created timestamp. |
| updated_at | TIMESTAMPTZ | yes | `now()` | Updated timestamp. |
| is_subscribed | BOOLEAN | no | `false` | Driver subscription state. |
| subscription_ends_at | TIMESTAMPTZ | no | null | Subscription expiry. |
| role | TEXT | no | `user` | `user` or `admin`. |
| is_approved | BOOLEAN | no | `false` | Driver/admin approval status. |

Relationships:

- One profile can create many trips as passenger.
- One profile can accept many trips as driver.
- One profile can create many driver confirmations as driver.
- Profile ID is tied to Supabase Auth user ID.

### governorates

Stores Tunisian governorates.

Columns:

| Column | Type | Required | Default | Notes |
|---|---:|---:|---|---|
| id | SERIAL | yes | autoincrement | Primary key. |
| name_en | TEXT | yes | none | English name. |
| name_ar | TEXT | yes | none | Arabic name. |
| name_fr | TEXT | yes | none | French name. |
| created_at | TIMESTAMPTZ | yes | `now()` | Created timestamp. |

Relationships:

- One governorate has many cities.

### cities

Stores cities and links each city to a governorate.

Columns:

| Column | Type | Required | Default | Notes |
|---|---:|---:|---|---|
| id | SERIAL | yes | autoincrement | Primary key. |
| governorate_id | INTEGER | no | null | References `governorates.id`. |
| name_en | TEXT | yes | none | English name. |
| name_ar | TEXT | yes | none | Arabic name. |
| name_fr | TEXT | yes | none | French name. |
| created_at | TIMESTAMPTZ | yes | `now()` | Created timestamp. |

Relationships:

- Many cities belong to one governorate.
- One city can be used as the `from_city` on many trips.
- One city can be used as the `to_city` on many trips.

### trips

Stores passenger trip requests and driver acceptance state.

Columns:

| Column | Type | Required | Default | Notes |
|---|---:|---:|---|---|
| id | UUID | yes | `gen_random_uuid()` | Primary key. |
| passenger_id | UUID | yes | none | References `profiles.id`. |
| from_city_id | INTEGER | yes | none | References `cities.id`. |
| to_city_id | INTEGER | yes | none | References `cities.id`. |
| departure_date | DATE | yes | none | Trip date. |
| departure_time | TIME | no | null | Trip time. |
| fare_offered | DECIMAL(10,2) | yes | none | Offered fare in TND. |
| passenger_count | INTEGER | no | `1` | Number of passengers. |
| notes | TEXT | no | null | Passenger notes. |
| status | TEXT | no | `pending` | `pending`, `accepted`, `completed`, or `cancelled`. |
| driver_id | UUID | no | null | References `profiles.id`. |
| created_at | TIMESTAMPTZ | yes | `now()` | Created timestamp. |
| updated_at | TIMESTAMPTZ | yes | `now()` | Updated timestamp. |
| payment_status | TEXT | no | `unpaid` | `unpaid`, `paid`, or `refunded`. |

Relationships:

- Many trips belong to one passenger profile.
- Many trips can belong to one driver profile.
- Many trips start from one city.
- Many trips end at one city.
- One trip can have driver confirmations.

### driver_confirmations

Stores driver-provided confirmation details after accepting a trip.

Columns:

| Column | Type | Required | Default | Notes |
|---|---:|---:|---|---|
| id | UUID | yes | `gen_random_uuid()` | Primary key. |
| trip_id | UUID | yes | none | References `trips.id`. |
| driver_id | UUID | yes | none | References `profiles.id`. |
| pickup_time | TIME | yes | none | Confirmed pickup time. |
| driver_phone | TEXT | yes | none | Driver phone number. |
| whatsapp_number | TEXT | no | null | Optional WhatsApp number. |
| vehicle_make | TEXT | yes | none | Vehicle make. |
| vehicle_model | TEXT | yes | none | Vehicle model. |
| vehicle_color | TEXT | yes | none | Vehicle color. |
| license_plate | TEXT | yes | none | Vehicle license plate. |
| message | TEXT | no | null | Message to passenger. |
| terms_accepted | BOOLEAN | no | `false` | Driver accepted terms. |
| created_at | TIMESTAMPTZ | yes | `now()` | Created timestamp. |

Relationships:

- Many confirmations belong to one trip.
- Many confirmations belong to one driver profile.

### platform_settings

Stores admin-controlled app settings.

Columns:

| Column | Type | Required | Default | Notes |
|---|---:|---:|---|---|
| key | TEXT | yes | none | Primary key. |
| value | TEXT | yes | none | Setting value as text. |
| description | TEXT | no | null | Human-readable description. |
| created_at | TIMESTAMPTZ | yes | `now()` | Created timestamp. |
| updated_at | TIMESTAMPTZ | yes | `now()` | Updated timestamp. |

Seed values:

- `default_driver_approval`
- `min_fare_tnd`
- `max_passengers_per_trip`
- `contact_email`

## Relationship Summary

```text
auth.users
  1 -> 1 profiles

profiles
  1 -> many trips as passenger
  1 -> many trips as driver
  1 -> many driver_confirmations as driver

governorates
  1 -> many cities

cities
  1 -> many trips as from_city
  1 -> many trips as to_city

trips
  many -> 1 passenger profile
  many -> 1 optional driver profile
  many -> 1 from city
  many -> 1 to city
  1 -> many driver_confirmations

platform_settings
  standalone key/value admin table
```

## Enums To Use In Prisma

```prisma
enum UserType {
  passenger
  driver
}

enum UserRole {
  user
  admin
}

enum TripStatus {
  pending
  accepted
  completed
  cancelled
}

enum PaymentStatus {
  unpaid
  paid
  refunded
}
```

## Starter Prisma Schema

This is a starting point. It assumes Prisma maps to the existing Supabase public schema tables. The `auth.users` relationship is intentionally not modeled directly, because Supabase Auth lives outside the public app schema.

```prisma
model Profile {
  id                 String    @id @db.Uuid
  email              String
  fullName           String?   @map("full_name")
  phone              String?
  userType           UserType  @map("user_type")
  createdAt          DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt          DateTime  @default(now()) @map("updated_at") @db.Timestamptz
  isSubscribed       Boolean?  @default(false) @map("is_subscribed")
  subscriptionEndsAt DateTime? @map("subscription_ends_at") @db.Timestamptz
  role               UserRole? @default(user)
  isApproved         Boolean?  @default(false) @map("is_approved")

  passengerTrips     Trip[]    @relation("PassengerTrips")
  driverTrips        Trip[]    @relation("DriverTrips")
  confirmations      DriverConfirmation[]

  @@map("profiles")
}

model Governorate {
  id        Int      @id @default(autoincrement())
  nameEn    String   @map("name_en")
  nameAr    String   @map("name_ar")
  nameFr    String   @map("name_fr")
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz

  cities    City[]

  @@map("governorates")
}

model City {
  id            Int          @id @default(autoincrement())
  governorateId Int?        @map("governorate_id")
  nameEn        String      @map("name_en")
  nameAr        String      @map("name_ar")
  nameFr        String      @map("name_fr")
  createdAt     DateTime    @default(now()) @map("created_at") @db.Timestamptz

  governorate   Governorate? @relation(fields: [governorateId], references: [id])
  tripsFrom     Trip[]       @relation("FromCity")
  tripsTo       Trip[]       @relation("ToCity")

  @@map("cities")
}

model Trip {
  id             String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  passengerId    String        @map("passenger_id") @db.Uuid
  fromCityId     Int           @map("from_city_id")
  toCityId       Int           @map("to_city_id")
  departureDate  DateTime      @map("departure_date") @db.Date
  departureTime  DateTime?     @map("departure_time") @db.Time
  fareOffered    Decimal       @map("fare_offered") @db.Decimal(10, 2)
  passengerCount Int?          @default(1) @map("passenger_count")
  notes          String?
  status         TripStatus?   @default(pending)
  driverId       String?       @map("driver_id") @db.Uuid
  createdAt      DateTime      @default(now()) @map("created_at") @db.Timestamptz
  updatedAt      DateTime      @default(now()) @map("updated_at") @db.Timestamptz
  paymentStatus  PaymentStatus? @default(unpaid) @map("payment_status")

  passenger      Profile       @relation("PassengerTrips", fields: [passengerId], references: [id])
  driver         Profile?      @relation("DriverTrips", fields: [driverId], references: [id])
  fromCity       City          @relation("FromCity", fields: [fromCityId], references: [id])
  toCity         City          @relation("ToCity", fields: [toCityId], references: [id])
  confirmations  DriverConfirmation[]

  @@map("trips")
}

model DriverConfirmation {
  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  tripId        String   @map("trip_id") @db.Uuid
  driverId      String   @map("driver_id") @db.Uuid
  pickupTime    DateTime @map("pickup_time") @db.Time
  driverPhone   String   @map("driver_phone")
  whatsappNumber String? @map("whatsapp_number")
  vehicleMake   String   @map("vehicle_make")
  vehicleModel  String   @map("vehicle_model")
  vehicleColor  String   @map("vehicle_color")
  licensePlate  String   @map("license_plate")
  message       String?
  termsAccepted Boolean? @default(false) @map("terms_accepted")
  createdAt     DateTime @default(now()) @map("created_at") @db.Timestamptz

  trip          Trip     @relation(fields: [tripId], references: [id])
  driver        Profile  @relation(fields: [driverId], references: [id])

  @@map("driver_confirmations")
}

model PlatformSetting {
  key         String   @id
  value       String
  description String?
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime @default(now()) @map("updated_at") @db.Timestamptz

  @@map("platform_settings")
}
```

## Important Supabase Notes

- `profiles.id` should always match `auth.users.id`.
- Prisma will not automatically enforce Supabase RLS in the same way browser Supabase queries do.
- If Prisma connects with the Supabase secret/service role database credentials, it can bypass app-level RLS expectations.
- Keep admin-only Prisma logic on the server.
- Keep auth/session checks through Supabase.

## Tables Missing But Recommended For Admin Control

If the admin panel becomes more powerful, add these later:

### admin_audit_logs

Tracks every admin action.

Suggested fields:

- `id UUID PRIMARY KEY`
- `admin_id UUID REFERENCES profiles(id)`
- `action TEXT`
- `target_type TEXT`
- `target_id TEXT`
- `old_value JSONB`
- `new_value JSONB`
- `created_at TIMESTAMPTZ`

### user_suspensions

Tracks bans/suspensions.

Suggested fields:

- `id UUID PRIMARY KEY`
- `user_id UUID REFERENCES profiles(id)`
- `reason TEXT`
- `starts_at TIMESTAMPTZ`
- `ends_at TIMESTAMPTZ`
- `created_by UUID REFERENCES profiles(id)`
- `created_at TIMESTAMPTZ`

### reports

Tracks user/trip reports.

Suggested fields:

- `id UUID PRIMARY KEY`
- `reporter_id UUID REFERENCES profiles(id)`
- `reported_user_id UUID REFERENCES profiles(id)`
- `trip_id UUID REFERENCES trips(id)`
- `reason TEXT`
- `status TEXT`
- `created_at TIMESTAMPTZ`

