# Frontend Gaps Analysis

Based on `APPOINTMENT_MODULE_DOCUMENTATION.md`, here's what the frontend may be missing or needs to implement.

---

## Currently Implemented (Confirmed)

- [x] Appointment booking with slot selection
- [x] Payment flow with Stripe
- [x] Appointment listing (AppointmentRoom)
- [x] Cancellation with reason
- [x] Attach/remove reports to appointments
- [x] Join meeting link
- [x] Status badges (Confirmed, Cancelled, Completed, Pending, No-Show)
- [x] Payment status badges
- [x] **Rescheduling Feature** - Full implementation with penalty warnings
- [x] **Refund Information Display** - Shows refund amount after cancellation
- [x] **Doctor Notes** - Doctors can add/edit notes on appointments
- [x] **NO_SHOW Status** - Badge styling added (orange)

---

## Recently Implemented (February 2026)

### 1. Rescheduling Feature - COMPLETED
**Implementation in:** `wrappers/AppointmentRoom.jsx`

**Features:**
- "Reschedule" button on confirmed appointments
- Fetches available slots from the same doctor
- Date picker showing next 14 available days
- Time slot selection grid
- Penalty warning display based on timing:
  - 24+ hours: Green "Free Rescheduling" message
  - 4-24 hours: Amber "50% Penalty Fee" warning with estimated cost
  - < 4 hours: Red "Cannot Reschedule" message
- Reason input field
- API integration with `PUT /api/appointments/{id}/reschedule`

### 2. Refund Information Display - COMPLETED
**Implementation in:** `wrappers/AppointmentRoom.jsx`

**Features:**
- After cancellation, modal shows refund details
- Displays refund amount and percentage
- Shows 7-14 business days processing timeline
- Displays Stripe refund ID when available

### 3. Doctor Notes Editing - COMPLETED
**Implementation in:** `wrappers/AppointmentRoom.jsx`

**Features:**
- Edit/Add Notes button for doctors on appointments
- Inline textarea editing
- Save/Cancel buttons
- API integration with `PATCH /api/appointments/{id}/doctor-notes`

### 4. NO_SHOW Status Badge - COMPLETED
**Implementation in:** `wrappers/AppointmentRoom.jsx`

**Badge styling:** Orange background (`bg-orange-100 text-orange-800 border-orange-200`)

---

## Still Missing / Future Implementation

### 1. Booking Limits Display (MEDIUM PRIORITY)

```
┌─────────────────────────────────────────────────────────────────┐
│ PUT  /api/appointments/{appointmentId}/reschedule               │
└─────────────────────────────────────────────────────────────────┘

Path Parameters:
  - appointmentId* (integer, required) - The appointment to reschedule

Request Body (application/json):
{
  "appointmentId": 456,      // integer (required) - same as path param
  "newSlotId": 789,          // integer (required) - new doctor slot ID
  "reason": "string"         // string (required) - reason for rescheduling
}

Example Request:
PUT /api/appointments/456/reschedule
{
  "appointmentId": 456,
  "newSlotId": 789,
  "reason": "Work schedule changed - need earlier time"
}

Response (Free Reschedule - 24+ hours):
{
  "appointment": {
    "id": 456,
    "appointmentDate": "2026-01-26",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "Confirmed"
  },
  "penaltyPayment": {
    "required": false,
    "amount": 0.00,
    "percentage": 0,
    "message": "No penalty fee - rescheduled 24+ hours in advance"
  }
}

Response (With Penalty - 4-24 hours):
{
  "appointment": {...},
  "penaltyPayment": {
    "required": true,
    "amount": 75.00,
    "percentage": 50,
    "currency": "AED",
    "paymentIntentId": "pi_xxx",
    "clientSecret": "pi_xxx_secret",
    "message": "50% penalty fee applies"
  }
}
```

**Backend enforces:**
- Max 3 active appointments at any time
- Max 5 appointments per calendar week
- Max 30 days in advance
- Min 1 hour before appointment time

**Frontend should:**
- Show remaining booking capacity before booking
- Display helpful error messages when limits reached
- Consider pre-checking limits via API before showing booking form

---

### 2. Payment Failure Handling (LOW PRIORITY)
**Backend sends:** Payment failed email notification

**Frontend should:**
- Handle payment failure gracefully
- Show retry option
- Display appropriate error messages

---

### 3. Penalty Payment Flow (LOW PRIORITY)
When rescheduling within 4-24 hours, backend returns `penaltyPayment.required: true` with Stripe payment intent.

**Frontend should:**
- Integrate Stripe payment form for penalty fees
- Complete reschedule only after successful penalty payment

---

## API Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/appointments` | POST | Book new appointment |
| `/appointments/{id}/payment` | POST | Create payment intent |
| `/appointments/{id}/confirm` | POST | Confirm after payment |
| `/appointments/{id}/cancel` | PUT | Cancel appointment |
| `/appointments/{id}/reschedule` | PUT | Reschedule appointment |
| `/appointments/{id}/doctor-notes` | PATCH | Update doctor/patient notes |
| `/appointments/{id}/reports` | PATCH | Attach reports |
| `/appointments` | GET | List patient appointments |
| `/appointments/doctor` | GET | List doctor appointments |

---

## Refund Policy Reference

| Cancellation Time | Patient Refund | Doctor Cancel |
|-------------------|----------------|---------------|
| 48+ hours before | 100% | 100% |
| 24-48 hours before | 50% | 100% |
| < 24 hours before | 0% | 100% |

---

## Rescheduling Policy Reference

| Reschedule Time | Patient Fee | Doctor Reschedule |
|-----------------|-------------|-------------------|
| 24+ hours before | FREE | FREE |
| 4-24 hours before | 50% penalty | FREE |
| < 4 hours before | NOT ALLOWED | FREE |

---

## Priority Implementation Order

### Completed
1. ~~**Rescheduling Feature**~~ - DONE
2. ~~**Refund Information Display**~~ - DONE
3. ~~**Doctor Notes**~~ - DONE
4. ~~**NO_SHOW handling**~~ - DONE

### Remaining
5. **Booking Limits Display** - Better UX
6. **Payment Failure Handling** - Edge case
7. **Penalty Payment Flow** - Edge case (requires Stripe integration)

---

*Last Updated: February 13, 2026*
*Based on: APPOINTMENT_MODULE_DOCUMENTATION.md v1.0*
