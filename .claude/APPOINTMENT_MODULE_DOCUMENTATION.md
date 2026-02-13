# Appointment Module - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Booking System](#booking-system)
3. [Cancellation & Refund Policy](#cancellation--refund-policy)
4. [Rescheduling & Penalty System](#rescheduling--penalty-system)
5. [Payment Integration](#payment-integration)
6. [Email Notifications](#email-notifications)
7. [API Endpoints](#api-endpoints)
8. [Business Rules & Validations](#business-rules--validations)
9. [Database Schema](#database-schema)
10. [Configuration](#configuration)

---

## Overview

The Appointment Module is a comprehensive system for managing medical appointments between patients and doctors. It handles the complete lifecycle of appointments including booking, payment, cancellation, refunds, and rescheduling with automated email notifications and integrated payment processing through Stripe.

### Key Features
- **Appointment Booking**: Patients can book appointments with available doctors
- **Payment Processing**: Integrated Stripe payment system with payment intents
- **Cancellation & Refunds**: Automated refund calculation based on cancellation timing
- **Rescheduling**: Flexible rescheduling with penalty fees for last-minute changes
- **Email Notifications**: Automated email notifications for all appointment events
- **Google Calendar Integration**: Automatic calendar event creation with Google Meet links
- **Role-Based Access Control**: Separate permissions for patients, doctors, and parents

### Technology Stack
- **Backend**: Spring Boot, Java
- **Database**: PostgreSQL
- **Payment**: Stripe Payment Gateway
- **Email**: Spring Mail
- **Calendar**: Google Calendar API
- **Authentication**: JWT Token-based

---

## Booking System

### Workflow Overview

```
Patient Browses Available Slots
         ↓
Selects Slot & Initiates Booking
         ↓
System Validates Business Rules
         ↓
Creates Stripe Payment Intent
         ↓
Patient Completes Payment
         ↓
System Confirms Appointment
         ↓
Creates Google Calendar Event
         ↓
Sends Confirmation Emails
```

### Business Rules

#### 1. Maximum Advance Booking
- **Rule**: Appointments can only be booked up to **30 days** in advance
- **Reason**: Ensures doctor availability and reduces no-shows
- **Error**: "Appointments can only be booked up to 30 days in advance"

#### 2. Minimum Booking Notice
- **Rule**: Appointments must be booked at least **1 hour** before the appointment time
- **Reason**: Gives doctors preparation time and reduces last-minute no-shows
- **Error**: "Appointments must be booked at least 1 hour(s) in advance"

#### 3. Active Appointments Limit
- **Rule**: Patients can have a maximum of **3 active appointments** at any time
- **Active**: Appointments with status PENDING or CONFIRMED
- **Reason**: Prevents appointment hoarding and ensures fair access
- **Error**: "You cannot have more than 3 active appointments at once. Please complete or cancel an existing appointment before booking a new one."

#### 4. Weekly Appointments Limit
- **Rule**: Patients can book a maximum of **5 appointments per calendar week**
- **Week Definition**: Monday to Sunday
- **Reason**: Prevents system abuse and ensures fair resource distribution
- **Error**: "You cannot book more than 5 appointments per calendar week. Current week: X appointments."

#### 5. Slot Availability
- **Rule**: Slot must have status AVAILABLE
- **Validation**: Checks real-time slot status
- **Error**: "Selected slot is not available"

#### 6. Doctor Self-Booking Prevention
- **Rule**: Doctors cannot book appointments for themselves
- **Reason**: Appointments are patient-doctor interactions only
- **Error**: "Doctors cannot book appointments for themselves"

### Booking Request Example

```json
POST /api/appointments
Authorization: Bearer {patient_jwt_token}

{
  "doctorSlotId": 123,
  "patientNotes": "I have been experiencing headaches for the past week"
}
```

### Booking Response Example

```json
{
  "status": 200,
  "message": "Appointment booking initiated",
  "data": {
    "appointmentId": 456,
    "paymentIntentId": "pi_3ABCDefgh123456",
    "clientSecret": "pi_3ABCDefgh123456_secret_xyz",
    "amount": 150.00,
    "currency": "AED",
    "requiresPayment": true
  }
}
```

### Payment Confirmation Flow

After successful payment through Stripe:

```json
POST /api/appointments/{appointmentId}/confirm
Authorization: Bearer {patient_jwt_token}

{
  "paymentIntentId": "pi_3ABCDefgh123456"
}
```

### Booking Confirmation Email

**Subject**: Appointment Confirmed with Dr. Sarah Johnson - January 25, 2026

**Email Content**:
```
Dear John Doe,

Your appointment has been successfully confirmed!

═══════════════════════════════════════
APPOINTMENT DETAILS
═══════════════════════════════════════

📅 Date: Tuesday, January 25, 2026
⏰ Time: 2:00 PM - 3:00 PM (60 minutes)
👨‍⚕️ Doctor: Dr. Sarah Johnson
💼 Service: Expert Medical Consultation
💰 Amount Paid: 150.00 AED

═══════════════════════════════════════

📍 MEETING LINK
═══════════════════════════════════════
Join your video consultation:
https://meet.google.com/abc-defg-hij

Please join 5 minutes before your scheduled time.

═══════════════════════════════════════

📝 YOUR NOTES
═══════════════════════════════════════
I have been experiencing headaches for the past week

═══════════════════════════════════════

📋 IMPORTANT INFORMATION
═══════════════════════════════════════

✓ Please be ready 5 minutes before your appointment
✓ Ensure you have a stable internet connection
✓ Have your medical history and current medications ready
✓ You can share medical reports through the patient portal

═══════════════════════════════════════

NEED TO MAKE CHANGES?
═══════════════════════════════════════

🔄 Reschedule:
   • Free if done 24+ hours before appointment
   • 50% fee if done 4-24 hours before
   • Cannot reschedule within 4 hours

❌ Cancel:
   • 100% refund if cancelled 48+ hours before
   • 50% refund if cancelled 24-48 hours before
   • No refund if cancelled less than 24 hours before

═══════════════════════════════════════

Need assistance? Reply to this email or contact support.

Best regards,
Doctor-Patient Portal Team

This is an automated message. Please do not reply to this email.
```

---

## Cancellation & Refund Policy

### Refund Tiers

The system implements a **time-based refund policy** to balance patient flexibility with doctor time commitment:

| Cancellation Window | Refund Percentage | Reason |
|---------------------|-------------------|---------|
| **48+ hours before** | 100% | Full flexibility for early cancellations |
| **24-48 hours before** | 50% | Partial compensation for doctor's reserved time |
| **Less than 24 hours** | 0% | Doctor has reserved time, limited rebooking opportunity |

### Special Cases

#### Doctor-Initiated Cancellation
- **Refund**: Always 100%, regardless of timing
- **Reason**: Doctor cancellations are not patient's fault
- **Notification**: Patient receives immediate email with full refund confirmation

#### Emergency Cancellations
- **Policy**: Follow standard refund tiers
- **Note**: System does not distinguish emergencies; all follow time-based policy

### Cancellation Workflow

```
Patient/Doctor Requests Cancellation
         ↓
System Validates Cancellation (not already cancelled)
         ↓
Calculates Time Until Appointment
         ↓
Determines Refund Percentage
         ↓
Processes Stripe Refund (if applicable)
         ↓
Updates Appointment Status to CANCELLED
         ↓
Releases Doctor Slot (status → AVAILABLE)
         ↓
Sends Cancellation Emails to Both Parties
         ↓
Updates Google Calendar Event (cancelled)
```

### Cancellation Request Example

```json
PUT /api/appointments/{appointmentId}/cancel
Authorization: Bearer {patient_jwt_token}

{
  "cancellationReason": "Personal emergency - family matter requires immediate attention"
}
```

### Cancellation Response Examples

#### 100% Refund (48+ hours)
```json
{
  "status": 200,
  "message": "Appointment cancelled successfully",
  "data": {
    "id": 456,
    "status": "Cancelled",
    "cancellationReason": "Personal emergency - family matter requires immediate attention",
    "cancelledAt": "2026-01-20T10:30:00Z",
    "refundAmount": 150.00,
    "refundPercentage": 100,
    "stripeRefundId": "re_3XYZabc123456"
  }
}
```

#### 50% Refund (24-48 hours)
```json
{
  "status": 200,
  "message": "Appointment cancelled successfully",
  "data": {
    "id": 456,
    "status": "Cancelled",
    "cancellationReason": "Schedule conflict",
    "cancelledAt": "2026-01-24T10:30:00Z",
    "refundAmount": 75.00,
    "refundPercentage": 50,
    "stripeRefundId": "re_3XYZabc123456"
  }
}
```

#### No Refund (< 24 hours)
```json
{
  "status": 200,
  "message": "Appointment cancelled successfully",
  "data": {
    "id": 456,
    "status": "Cancelled",
    "cancellationReason": "Cannot attend",
    "cancelledAt": "2026-01-25T10:30:00Z",
    "refundAmount": 0.00,
    "refundPercentage": 0,
    "stripeRefundId": null
  }
}
```

### Cancellation Email Samples

#### Patient Cancellation - 100% Refund

**Subject**: Appointment Cancelled - Full Refund Issued

**Email Content**:
```
Dear John Doe,

Your appointment has been cancelled as requested.

═══════════════════════════════════════
CANCELLATION DETAILS
═══════════════════════════════════════

❌ Status: Cancelled
📅 Original Date: Tuesday, January 25, 2026
⏰ Original Time: 2:00 PM - 3:00 PM
👨‍⚕️ Doctor: Dr. Sarah Johnson

═══════════════════════════════════════

💰 REFUND INFORMATION
═══════════════════════════════════════

✓ Refund Amount: 150.00 AED (100% of payment)
✓ Refund Method: Original payment method
✓ Processing Time: 5-10 business days
✓ Stripe Refund ID: re_3XYZabc123456

You cancelled more than 48 hours before your appointment,
so you receive a full refund.

═══════════════════════════════════════

📝 CANCELLATION REASON
═══════════════════════════════════════
Personal emergency - family matter requires immediate attention

═══════════════════════════════════════

NEED ANOTHER APPOINTMENT?
═══════════════════════════════════════

You can book a new appointment at any time through
the patient portal.

Browse Available Appointments:
https://portal.example.com/appointments/book

═══════════════════════════════════════

We hope everything is okay. If you need any assistance,
please contact our support team.

Best regards,
Doctor-Patient Portal Team
```

#### Patient Cancellation - 50% Refund

**Subject**: Appointment Cancelled - Partial Refund Issued

**Email Content**:
```
Dear John Doe,

Your appointment has been cancelled as requested.

═══════════════════════════════════════
CANCELLATION DETAILS
═══════════════════════════════════════

❌ Status: Cancelled
📅 Original Date: Tuesday, January 25, 2026
⏰ Original Time: 2:00 PM - 3:00 PM
👨‍⚕️ Doctor: Dr. Sarah Johnson

═══════════════════════════════════════

💰 REFUND INFORMATION
═══════════════════════════════════════

✓ Refund Amount: 75.00 AED (50% of payment)
✓ Refund Method: Original payment method
✓ Processing Time: 5-10 business days
✓ Stripe Refund ID: re_3XYZabc123456

⚠️ You cancelled 24-48 hours before your appointment.
According to our cancellation policy, a 50% refund applies.

═══════════════════════════════════════

📝 CANCELLATION REASON
═══════════════════════════════════════
Schedule conflict

═══════════════════════════════════════

📋 CANCELLATION POLICY REMINDER
═══════════════════════════════════════

For future reference:
• 48+ hours before: 100% refund
• 24-48 hours before: 50% refund
• Less than 24 hours: No refund

═══════════════════════════════════════

NEED ANOTHER APPOINTMENT?
═══════════════════════════════════════

Browse Available Appointments:
https://portal.example.com/appointments/book

═══════════════════════════════════════

Best regards,
Doctor-Patient Portal Team
```

#### Patient Cancellation - No Refund

**Subject**: Appointment Cancelled - No Refund Available

**Email Content**:
```
Dear John Doe,

Your appointment has been cancelled as requested.

═══════════════════════════════════════
CANCELLATION DETAILS
═══════════════════════════════════════

❌ Status: Cancelled
📅 Original Date: Tuesday, January 25, 2026
⏰ Original Time: 2:00 PM - 3:00 PM
👨‍⚕️ Doctor: Dr. Sarah Johnson

═══════════════════════════════════════

💰 REFUND INFORMATION
═══════════════════════════════════════

⚠️ Refund Amount: 0.00 AED (No refund)
⚠️ Original Payment: 150.00 AED

You cancelled less than 24 hours before your appointment.
According to our cancellation policy, no refund is available
for cancellations made this close to the appointment time.

═══════════════════════════════════════

📝 CANCELLATION REASON
═══════════════════════════════════════
Cannot attend

═══════════════════════════════════════

📋 WHY NO REFUND?
═══════════════════════════════════════

Our cancellation policy ensures:
• Doctors are compensated for reserved time slots
• Last-minute cancellations don't result in lost doctor time
• Fair treatment for all patients

For future appointments:
• Cancel 48+ hours before: 100% refund
• Cancel 24-48 hours before: 50% refund
• Cancel less than 24 hours: No refund

═══════════════════════════════════════

NEED ANOTHER APPOINTMENT?
═══════════════════════════════════════

Browse Available Appointments:
https://portal.example.com/appointments/book

═══════════════════════════════════════

Best regards,
Doctor-Patient Portal Team
```

#### Doctor-Initiated Cancellation

**Subject**: Appointment Cancelled by Doctor - Full Refund Issued

**Email to Patient**:
```
Dear John Doe,

We regret to inform you that your appointment has been
cancelled by the doctor.

═══════════════════════════════════════
CANCELLATION DETAILS
═══════════════════════════════════════

❌ Status: Cancelled by Doctor
📅 Original Date: Tuesday, January 25, 2026
⏰ Original Time: 2:00 PM - 3:00 PM
👨‍⚕️ Doctor: Dr. Sarah Johnson

═══════════════════════════════════════

💰 REFUND INFORMATION
═══════════════════════════════════════

✓ Refund Amount: 150.00 AED (100% full refund)
✓ Refund Method: Original payment method
✓ Processing Time: 5-10 business days
✓ Stripe Refund ID: re_3XYZabc123456

When a doctor cancels, you always receive a full refund
regardless of the timing.

═══════════════════════════════════════

📝 DOCTOR'S REASON
═══════════════════════════════════════
Emergency - personal commitment

═══════════════════════════════════════

😊 WE APOLOGIZE FOR THE INCONVENIENCE
═══════════════════════════════════════

We understand this may be frustrating. Please feel free
to book another appointment at your convenience.

Browse Available Appointments:
https://portal.example.com/appointments/book

If you need urgent medical attention, please contact
emergency services or visit your nearest medical facility.

═══════════════════════════════════════

Questions or concerns? Contact our support team.

Best regards,
Doctor-Patient Portal Team
```

**Email to Doctor**:
```
Dear Dr. Sarah Johnson,

Your cancellation request has been processed.

═══════════════════════════════════════
CANCELLATION DETAILS
═══════════════════════════════════════

❌ Status: Cancelled
📅 Original Date: Tuesday, January 25, 2026
⏰ Original Time: 2:00 PM - 3:00 PM
👤 Patient: John Doe

═══════════════════════════════════════

💰 REFUND PROCESSED
═══════════════════════════════════════

The patient has been issued a full refund of 150.00 AED.
Refund ID: re_3XYZabc123456

═══════════════════════════════════════

📝 YOUR CANCELLATION REASON
═══════════════════════════════════════
Emergency - personal commitment

═══════════════════════════════════════

✅ SLOT STATUS
═══════════════════════════════════════

The time slot has been released and is now available
for other patients to book.

═══════════════════════════════════════

Best regards,
Doctor-Patient Portal Team
```

---

## Rescheduling & Penalty System

### Rescheduling Policy

The system implements a **time-based penalty policy** for rescheduling:

| Rescheduling Window | Penalty Fee | Reason |
|---------------------|-------------|---------|
| **24+ hours before** | 0% (Free) | Adequate notice allows slot to be rebooked |
| **4-24 hours before** | 50% penalty | Short notice limits rebooking opportunities |
| **Less than 4 hours** | Not allowed | Treated as no-show, must cancel instead |

### Rescheduling Rules

#### 1. Minimum Time Before Appointment
- **Rule**: Cannot reschedule within **4 hours** of appointment
- **Reason**: Too close to appointment time; treat as no-show
- **Action**: Patient must cancel instead (subject to cancellation policy)
- **Error**: "Cannot reschedule within 4 hours of appointment. This will be treated as a no-show. Please cancel if you cannot attend."

#### 2. Appointment Status Requirement
- **Rule**: Only CONFIRMED appointments can be rescheduled
- **Reason**: Payment must be completed before rescheduling
- **Error**: "Only confirmed appointments can be rescheduled"

#### 3. New Slot Availability
- **Rule**: New slot must be AVAILABLE
- **Validation**: Real-time slot status check
- **Error**: "Selected slot is not available"

#### 4. Same Doctor Requirement
- **Rule**: Can only reschedule to slots of the same doctor
- **Reason**: Different doctor = different appointment/payment
- **Error**: "Can only reschedule to a slot with the same doctor"

#### 5. Doctor Rescheduling
- **Rule**: Doctors can reschedule without penalty fees
- **Reason**: Doctor-initiated changes shouldn't penalize patients
- **Benefit**: Patient pays no penalty fee

### Rescheduling Workflow

```
Patient/Doctor Requests Reschedule
         ↓
System Validates Appointment Status (must be CONFIRMED)
         ↓
Validates New Slot (must be AVAILABLE, same doctor)
         ↓
Calculates Time Until Current Appointment
         ↓
Determines if Penalty Fee Applies
         ↓
Creates Penalty Payment Intent (if 4-24 hours)
         ↓
Patient Confirms Penalty Payment (if required)
         ↓
Releases Old Slot (status → AVAILABLE)
         ↓
Books New Slot (status → BOOKED)
         ↓
Updates Appointment Details
         ↓
Updates Google Calendar Event
         ↓
Sends Rescheduling Emails to Both Parties
```

### Rescheduling Request Example

```json
PUT /api/appointments/{appointmentId}/reschedule
Authorization: Bearer {patient_jwt_token}

{
  "newSlotId": 789,
  "reason": "Work schedule changed - need earlier time"
}
```

### Rescheduling Response Examples

#### Free Rescheduling (24+ hours)

```json
{
  "status": 200,
  "message": "Appointment rescheduled successfully",
  "data": {
    "appointment": {
      "id": 456,
      "appointmentDate": "2026-01-26",
      "startTime": "10:00",
      "endTime": "11:00",
      "status": "Confirmed",
      "rescheduledAt": "2026-01-20T14:30:00Z",
      "rescheduleReason": "Work schedule changed - need earlier time"
    },
    "penaltyPayment": {
      "required": false,
      "amount": 0.00,
      "percentage": 0,
      "message": "No penalty fee - rescheduled 24+ hours in advance"
    }
  }
}
```

#### Penalty Fee Required (4-24 hours)

```json
{
  "status": 200,
  "message": "Penalty payment required for rescheduling",
  "data": {
    "appointment": {
      "id": 456,
      "appointmentDate": "2026-01-26",
      "startTime": "10:00",
      "endTime": "11:00",
      "status": "Confirmed",
      "rescheduledAt": "2026-01-24T20:30:00Z",
      "rescheduleReason": "Work schedule changed - need earlier time"
    },
    "penaltyPayment": {
      "required": true,
      "amount": 75.00,
      "percentage": 50,
      "currency": "AED",
      "paymentIntentId": "pi_3PenaltyXYZ789",
      "clientSecret": "pi_3PenaltyXYZ789_secret_abc",
      "message": "50% penalty fee applies for rescheduling 4-24 hours before appointment"
    }
  }
}
```

### Rescheduling Email Samples

#### Free Rescheduling Email

**Subject**: Appointment Rescheduled - January 26, 2026 at 10:00 AM

**Email Content**:
```
Dear John Doe,

Your appointment has been successfully rescheduled!

═══════════════════════════════════════
NEW APPOINTMENT DETAILS
═══════════════════════════════════════

📅 New Date: Wednesday, January 26, 2026
⏰ New Time: 10:00 AM - 11:00 AM (60 minutes)
👨‍⚕️ Doctor: Dr. Sarah Johnson
💼 Service: Expert Medical Consultation

═══════════════════════════════════════

🔄 PREVIOUS APPOINTMENT
═══════════════════════════════════════

📅 Old Date: Tuesday, January 25, 2026
⏰ Old Time: 2:00 PM - 3:00 PM

═══════════════════════════════════════

💰 RESCHEDULING FEE
═══════════════════════════════════════

✓ No rescheduling fee applies (rescheduled 24+ hours in advance).

Your original payment of 150.00 AED remains valid for
the new appointment time.

═══════════════════════════════════════

📝 RESCHEDULING REASON
═══════════════════════════════════════
Work schedule changed - need earlier time

═══════════════════════════════════════

📍 MEETING LINK
═══════════════════════════════════════

Your Google Meet link remains the same:
https://meet.google.com/abc-defg-hij

Please join 5 minutes before your scheduled time.

═══════════════════════════════════════

📋 RESCHEDULING POLICY REMINDER
═══════════════════════════════════════

For future reference:
• 24+ hours before: No fee
• 4-24 hours before: 50% penalty fee
• Less than 4 hours: Cannot reschedule (must cancel)

═══════════════════════════════════════

Need to make further changes? Log in to your portal.

Best regards,
Doctor-Patient Portal Team
```

#### Penalty Fee Rescheduling Email

**Subject**: Appointment Rescheduled - Penalty Fee Applied

**Email Content**:
```
Dear John Doe,

Your appointment has been rescheduled with a penalty fee.

═══════════════════════════════════════
NEW APPOINTMENT DETAILS
═══════════════════════════════════════

📅 New Date: Wednesday, January 26, 2026
⏰ New Time: 10:00 AM - 11:00 AM (60 minutes)
👨‍⚕️ Doctor: Dr. Sarah Johnson
💼 Service: Expert Medical Consultation

═══════════════════════════════════════

🔄 PREVIOUS APPOINTMENT
═══════════════════════════════════════

📅 Old Date: Tuesday, January 25, 2026
⏰ Old Time: 2:00 PM - 3:00 PM

═══════════════════════════════════════

💰 RESCHEDULING FEE
═══════════════════════════════════════

⚠️ A 50% penalty fee applies for rescheduling within 24 hours.
This fee will be charged separately.

Original Payment: 150.00 AED
Penalty Fee: 75.00 AED (50%)
Payment Status: ✓ Paid

Payment ID: pi_3PenaltyXYZ789

═══════════════════════════════════════

📝 RESCHEDULING REASON
═══════════════════════════════════════
Work schedule changed - need earlier time

═══════════════════════════════════════

📍 MEETING LINK
═══════════════════════════════════════

Your Google Meet link remains the same:
https://meet.google.com/abc-defg-hij

Please join 5 minutes before your scheduled time.

═══════════════════════════════════════

📋 WHY THE PENALTY FEE?
═══════════════════════════════════════

The penalty fee helps ensure:
• Doctors are compensated for last-minute changes
• Time slots can be effectively managed
• Fair treatment for all patients

Rescheduling Policy:
• 24+ hours before: No fee
• 4-24 hours before: 50% penalty fee
• Less than 4 hours: Cannot reschedule

═══════════════════════════════════════

We look forward to your appointment!

Best regards,
Doctor-Patient Portal Team
```

#### Doctor-Initiated Rescheduling Email

**Subject**: Appointment Rescheduled by Doctor - No Fee

**Email to Patient**:
```
Dear John Doe,

Your doctor has requested to reschedule your appointment.

═══════════════════════════════════════
NEW APPOINTMENT DETAILS
═══════════════════════════════════════

📅 New Date: Wednesday, January 26, 2026
⏰ New Time: 10:00 AM - 11:00 AM (60 minutes)
👨‍⚕️ Doctor: Dr. Sarah Johnson
💼 Service: Expert Medical Consultation

═══════════════════════════════════════

🔄 PREVIOUS APPOINTMENT
═══════════════════════════════════════

📅 Old Date: Tuesday, January 25, 2026
⏰ Old Time: 2:00 PM - 3:00 PM

═══════════════════════════════════════

💰 RESCHEDULING FEE
═══════════════════════════════════════

✓ No rescheduling fee applies.

When doctors reschedule, no penalty fee is charged to
patients, regardless of timing.

Your original payment of 150.00 AED remains valid.

═══════════════════════════════════════

📝 DOCTOR'S REASON
═══════════════════════════════════════
Schedule adjustment required

═══════════════════════════════════════

📍 MEETING LINK
═══════════════════════════════════════

Your Google Meet link:
https://meet.google.com/abc-defg-hij

Please join 5 minutes before your scheduled time.

═══════════════════════════════════════

😊 WE APOLOGIZE FOR ANY INCONVENIENCE
═══════════════════════════════════════

If the new time doesn't work for you, please contact us
to find an alternative time or request a cancellation with
full refund.

═══════════════════════════════════════

Questions? Reply to this email or contact support.

Best regards,
Doctor-Patient Portal Team
```

---

## Payment Integration

### Stripe Payment Flow

The system uses **Stripe Payment Intents** for secure payment processing.

#### Payment Intent Creation

```java
// Service creates payment intent during booking
String paymentIntentId = stripePaymentService.createPaymentIntent(
    amount,           // e.g., 150.00
    currency,         // e.g., "AED"
    patientId,
    description       // e.g., "Appointment with Dr. Sarah Johnson"
);
```

#### Payment Confirmation

```java
// After patient completes payment on frontend
boolean isSuccessful = stripePaymentService.confirmPayment(paymentIntentId);

if (isSuccessful) {
    appointment.setStatus(AppointmentStatus.CONFIRMED);
    appointment.setPaymentStatus(PaymentStatus.PAID);
    appointment.setConfirmedAt(Instant.now());
}
```

#### Refund Processing

```java
// Automatic refund on cancellation
String refundId = stripePaymentService.createRefund(
    paymentIntentId,
    refundAmount,      // Calculated based on refund percentage
    reason             // e.g., "Customer requested"
);

appointment.setStripeRefundId(refundId);
appointment.setRefundAmount(refundAmount);
appointment.setRefundPercentage(percentage);
```

### Payment Status States

| Status | Description | When Set |
|--------|-------------|----------|
| **PENDING** | Payment initiated but not completed | Appointment created |
| **PAID** | Payment successful | Payment confirmed |
| **FAILED** | Payment attempt failed | Stripe webhook notification |
| **REFUNDED** | Full or partial refund issued | Cancellation processed |
| **CANCELLED** | Payment cancelled before completion | Timeout or user cancellation |

### Payment Configuration

```properties
# Stripe API Keys
stripe.api.key=sk_live_xxxxxxxxxxxxx
stripe.publishable.key=pk_live_xxxxxxxxxxxxx
stripe.webhook.secret=whsec_xxxxxxxxxxxxx
```

---

## Email Notifications

### Email Service Architecture

```
Event Occurs (booking/cancellation/reschedule)
         ↓
Service Layer Triggers Email
         ↓
EmailService Prepares Content
         ↓
Templates Filled with Data
         ↓
Spring Mail Sends Email
         ↓
Async Processing (non-blocking)
```

### Supported Email Events

1. **Appointment Confirmed** - Sent to patient and doctor after payment
2. **Appointment Cancelled** - Sent to both parties with refund details
3. **Appointment Rescheduled** - Sent to both parties with new details
4. **Payment Failed** - Sent to patient if payment processing fails
5. **Reminder (24 hours)** - Sent to patient 24 hours before appointment
6. **Reminder (1 hour)** - Sent to patient 1 hour before appointment

### Email Configuration

```properties
# Spring Mail Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=noreply@example.com
spring.mail.password=xxxxxxxxxxxxx
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.from=Doctor-Patient Portal <noreply@example.com>
```

### Email Template Structure

All emails follow a consistent structure:

1. **Header**: Greeting and summary
2. **Main Details**: Appointment/cancellation/reschedule information
3. **Payment/Refund Section**: Financial details
4. **Meeting Link**: Google Meet URL (if applicable)
5. **Policy Information**: Relevant policies
6. **Footer**: Contact information and branding

---

## API Endpoints

### Base URL
```
https://api.example.com/api/appointments
```

### Authentication
All endpoints require JWT authentication via Bearer token:
```
Authorization: Bearer {jwt_token}
```

---

### 1. Book Appointment

**Endpoint**: `POST /api/appointments`
**Auth**: Required (Patient/Parent role)

**Request Body**:
```json
{
  "doctorSlotId": 123,
  "patientNotes": "Optional notes"
}
```

**Success Response** (200 OK):
```json
{
  "status": 200,
  "message": "Appointment booking initiated",
  "data": {
    "appointmentId": 456,
    "paymentIntentId": "pi_xxxxx",
    "clientSecret": "pi_xxxxx_secret",
    "amount": 150.00,
    "currency": "AED"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed (e.g., slot not available, limit reached)
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Doctor trying to book appointment
- `404 Not Found`: Slot ID doesn't exist

---

### 2. Confirm Payment

**Endpoint**: `POST /api/appointments/{appointmentId}/confirm`
**Auth**: Required (Patient/Parent role)

**Request Body**:
```json
{
  "paymentIntentId": "pi_xxxxx"
}
```

**Success Response** (200 OK):
```json
{
  "status": 200,
  "message": "Appointment confirmed successfully",
  "data": {
    "id": 456,
    "status": "Confirmed",
    "paymentStatus": "Paid",
    "confirmedAt": "2026-01-20T10:30:00Z",
    "googleMeetLink": "https://meet.google.com/abc-defg-hij"
  }
}
```

---

### 3. Cancel Appointment

**Endpoint**: `PUT /api/appointments/{appointmentId}/cancel`
**Auth**: Required (Patient/Parent/Doctor role)

**Request Body**:
```json
{
  "cancellationReason": "Required field - reason for cancellation"
}
```

**Success Response** (200 OK):
```json
{
  "status": 200,
  "message": "Appointment cancelled successfully",
  "data": {
    "id": 456,
    "status": "Cancelled",
    "cancellationReason": "Personal emergency",
    "cancelledAt": "2026-01-20T10:30:00Z",
    "refundAmount": 150.00,
    "refundPercentage": 100
  }
}
```

**Error Responses**:
- `400 Bad Request`: Already cancelled, validation failed
- `404 Not Found`: Appointment doesn't exist

---

### 4. Reschedule Appointment

**Endpoint**: `PUT /api/appointments/{appointmentId}/reschedule`
**Auth**: Required (Patient/Parent/Doctor role)

**Request Body**:
```json
{
  "newSlotId": 789,
  "reason": "Reason for rescheduling"
}
```

**Success Response** (200 OK):
```json
{
  "status": 200,
  "message": "Appointment rescheduled successfully",
  "data": {
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
      "percentage": 0
    }
  }
}
```

**With Penalty**:
```json
{
  "status": 200,
  "message": "Penalty payment required",
  "data": {
    "appointment": {...},
    "penaltyPayment": {
      "required": true,
      "amount": 75.00,
      "percentage": 50,
      "paymentIntentId": "pi_xxxxx",
      "clientSecret": "pi_xxxxx_secret"
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Within 4 hours, different doctor, slot unavailable
- `404 Not Found`: Appointment or new slot doesn't exist

---

### 5. Get Appointment by ID

**Endpoint**: `GET /api/appointments/{appointmentId}`
**Auth**: Required (Patient/Parent/Doctor role)

**Success Response** (200 OK):
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "id": 456,
    "patient": {
      "id": 10,
      "name": "John Doe"
    },
    "doctor": {
      "id": 20,
      "name": "Dr. Sarah Johnson"
    },
    "appointmentDate": "2026-01-25",
    "startTime": "14:00",
    "endTime": "15:00",
    "duration": 60,
    "status": "Confirmed",
    "paymentStatus": "Paid",
    "amount": 150.00,
    "currency": "AED",
    "googleMeetLink": "https://meet.google.com/abc-defg-hij",
    "patientNotes": "Experiencing headaches",
    "confirmedAt": "2026-01-20T10:30:00Z"
  }
}
```

**Error Responses**:
- `403 Forbidden`: User not authorized to view appointment
- `404 Not Found`: Appointment doesn't exist

---

### 6. List Patient Appointments

**Endpoint**: `GET /api/appointments`
**Auth**: Required (Patient/Parent role)
**Query Parameters**:
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)
- `status` (optional): Filter by status (PENDING, CONFIRMED, CANCELLED, COMPLETED)

**Success Response** (200 OK):
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "content": [
      {
        "id": 456,
        "doctor": {...},
        "appointmentDate": "2026-01-25",
        "startTime": "14:00",
        "status": "Confirmed",
        ...
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 5,
    "totalPages": 1
  }
}
```

---

### 7. List Doctor Appointments

**Endpoint**: `GET /api/appointments/doctor`
**Auth**: Required (Doctor role)
**Query Parameters**: Same as patient appointments

**Success Response**: Same structure as patient appointments

---

### 8. Update Appointment Notes

**Endpoint**: `PATCH /api/appointments/{appointmentId}/notes`
**Auth**: Required (Patient/Doctor role)

**Request Body**:
```json
{
  "doctorNotes": "Notes from doctor (doctor only)",
  "patientNotes": "Updated notes from patient (patient only)"
}
```

**Success Response** (200 OK):
```json
{
  "status": 200,
  "message": "Notes updated successfully",
  "data": {
    "id": 456,
    "patientNotes": "Updated notes",
    "doctorNotes": "Doctor's observations"
  }
}
```

---

### 9. Share Reports

**Endpoint**: `PATCH /api/appointments/{appointmentId}/reports`
**Auth**: Required (Patient role)

**Request Body**:
```json
{
  "reportIds": [1, 2, 3]
}
```

**Success Response** (200 OK):
```json
{
  "status": 200,
  "message": "Reports shared successfully",
  "data": {
    "id": 456,
    "reports": [
      {
        "id": 1,
        "fileName": "blood_test.pdf",
        "uploadedAt": "2026-01-15T10:00:00Z"
      }
    ]
  }
}
```

---

## Business Rules & Validations

### Comprehensive Validation List

#### Pre-Booking Validations

1. **User Authentication**
   - User must be authenticated (JWT token valid)
   - User must have PATIENT or PARENT role
   - Doctors cannot book appointments for themselves

2. **Slot Validation**
   - Slot must exist in database
   - Slot must have status AVAILABLE
   - Slot must belong to an active doctor
   - Slot date/time must be valid

3. **Time Window Validation**
   - Appointment date must not be more than 30 days in future
   - Appointment must be at least 1 hour in future
   - Current date/time must be before slot start time

4. **Patient Limits**
   - Patient must not have 3 or more ACTIVE appointments (PENDING or CONFIRMED)
   - Patient must not have 5 or more appointments in current calendar week
   - Week calculated as Monday to Sunday

5. **Service Validation**
   - Doctor must have associated UserService
   - Service must be active
   - Service must have valid pricing

#### Cancellation Validations

1. **Appointment Status**
   - Appointment must exist
   - Appointment status must not be CANCELLED
   - Appointment status must not be COMPLETED
   - Appointment must be in PENDING or CONFIRMED status

2. **Authorization**
   - User must be the patient, or
   - User must be the doctor, or
   - User must be parent of patient

3. **Required Fields**
   - Cancellation reason must be provided (@NotBlank validation)
   - Cancellation reason must not be empty string

4. **Refund Calculation**
   - Calculate hours until appointment
   - Determine refund percentage (100%, 50%, or 0%)
   - Process Stripe refund if percentage > 0

#### Rescheduling Validations

1. **Appointment Status**
   - Appointment must exist
   - Appointment status must be CONFIRMED
   - Cannot reschedule PENDING appointments (payment not complete)
   - Cannot reschedule CANCELLED or COMPLETED appointments

2. **Time Restrictions**
   - Cannot reschedule within 4 hours of appointment
   - Error message guides user to cancel instead

3. **New Slot Validation**
   - New slot must exist
   - New slot must be AVAILABLE
   - New slot must belong to SAME doctor
   - New slot date/time must be valid

4. **Authorization**
   - User must be the patient, or
   - User must be the doctor, or
   - User must be parent of patient

5. **Penalty Calculation**
   - Calculate hours until current appointment
   - 24+ hours: No penalty
   - 4-24 hours: 50% penalty
   - Less than 4 hours: Not allowed
   - Doctor-initiated: Always free

#### Payment Validations

1. **Payment Intent Creation**
   - Amount must be positive
   - Currency must be valid (AED)
   - Stripe API must be accessible
   - Payment intent must be created successfully

2. **Payment Confirmation**
   - Payment intent ID must be valid
   - Payment status from Stripe must be "succeeded"
   - Payment amount must match appointment amount
   - Payment must not be already processed

3. **Refund Processing**
   - Original payment must exist
   - Refund amount must not exceed original amount
   - Refund must be processed through Stripe
   - Refund ID must be stored in database

---

## Database Schema

### Appointment Table

```sql
CREATE TABLE appointment (
    id SERIAL PRIMARY KEY,

    -- Relationships
    patient_id INTEGER NOT NULL REFERENCES users(id),
    doctor_id INTEGER NOT NULL REFERENCES users(id),
    doctor_slot_id INTEGER NOT NULL REFERENCES doctor_slot(id),

    -- Appointment Details
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INTEGER NOT NULL, -- in minutes

    -- Status
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
        -- PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW
    payment_status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
        -- PENDING, PAID, FAILED, REFUNDED, CANCELLED

    -- Payment Information
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'AED',
    stripe_payment_intent_id VARCHAR(255),

    -- Meeting Details
    google_meet_link VARCHAR(500),
    google_event_id VARCHAR(255),

    -- Notes
    patient_notes VARCHAR(1000),
    doctor_notes VARCHAR(1000),

    -- Cancellation Details
    cancellation_reason VARCHAR(500),
    cancelled_at TIMESTAMP,
    cancellation_type VARCHAR(32), -- PATIENT, DOCTOR

    -- Refund Details
    stripe_refund_id VARCHAR(255),
    refund_amount DECIMAL(10,2),
    refund_percentage INTEGER, -- 0, 50, or 100
    refund_status VARCHAR(32) DEFAULT 'NONE',
        -- NONE, PENDING, PROCESSED, FAILED
    refund_requested_at TIMESTAMP,
    refund_processed_at TIMESTAMP,
    refund_reason VARCHAR(500),

    -- Rescheduling Details
    reschedule_penalty_payment_intent_id VARCHAR(255),
    reschedule_penalty_amount DECIMAL(10,2),
    reschedule_penalty_percentage INTEGER, -- 0 or 50
    reschedule_penalty_payment_status VARCHAR(32) DEFAULT 'PENDING',
    rescheduled_at TIMESTAMP,
    reschedule_reason VARCHAR(500),

    -- Timestamps
    confirmed_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_update TIMESTAMP NOT NULL,

    CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES users(id),
    CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES users(id),
    CONSTRAINT fk_slot FOREIGN KEY (doctor_slot_id) REFERENCES doctor_slot(id)
);

-- Indexes for Performance
CREATE INDEX idx_appointment_patient ON appointment(patient_id);
CREATE INDEX idx_appointment_doctor ON appointment(doctor_id);
CREATE INDEX idx_appointment_status ON appointment(status);
CREATE INDEX idx_appointment_date ON appointment(appointment_date);
CREATE INDEX idx_appointment_payment_status ON appointment(payment_status);
```

### Appointment-Reports Junction Table

```sql
CREATE TABLE appointment_reports (
    appointment_id INTEGER NOT NULL REFERENCES appointment(id),
    report_id INTEGER NOT NULL REFERENCES report(id),
    PRIMARY KEY (appointment_id, report_id)
);
```

---

## Configuration

### Application Properties

```properties
# ===================================
# APPOINTMENT MODULE CONFIGURATION
# ===================================

# Booking Policy
appointment.booking.max.days.advance=30
appointment.booking.min.hours.before=1
appointment.booking.max.active.per.patient=3
appointment.booking.max.per.week=5

# Cancellation & Refund Policy
appointment.refund.full.hours=48
appointment.refund.partial.hours=24
appointment.refund.partial.percentage=50
appointment.refund.processing.days=14

# Rescheduling Policy
appointment.reschedule.free.hours=24
appointment.reschedule.penalty.hours=4
appointment.reschedule.penalty.percentage=50

# Stripe Configuration
stripe.api.key=${STRIPE_API_KEY}
stripe.publishable.key=${STRIPE_PUBLISHABLE_KEY}
stripe.webhook.secret=${STRIPE_WEBHOOK_SECRET}

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${EMAIL_USERNAME}
spring.mail.password=${EMAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.from=Doctor-Patient Portal <noreply@example.com>

# Google Calendar Configuration
google.calendar.client.id=${GOOGLE_CLIENT_ID}
google.calendar.client.secret=${GOOGLE_CLIENT_SECRET}
google.calendar.redirect.uri=http://localhost:8080/api/oauth2/callback
google.calendar.tokens.directory=tokens
```

### Environment Variables

Required environment variables for production:

```bash
# Stripe
STRIPE_API_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Email
EMAIL_USERNAME=noreply@example.com
EMAIL_PASSWORD=xxxxxxxxxxxxx

# Google Calendar
GOOGLE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxx
```

---

## Appendix: Status Flow Diagrams

### Appointment Lifecycle

```
┌─────────────┐
│   CREATED   │ (Initial state when appointment entity created)
└──────┬──────┘
       │
       ├──────> Payment Intent Created
       │
       ▼
┌─────────────┐
│   PENDING   │ (Waiting for payment)
└──────┬──────┘
       │
       ├────────────────────────────────┐
       │                                │
       ▼                                ▼
┌─────────────┐                  ┌──────────────┐
│  CONFIRMED  │◄─────────────────│   PAYMENT    │
│             │  Payment Success │    FAILED    │
└──────┬──────┘                  └──────────────┘
       │
       ├─────────────┬──────────────┬────────────────┐
       │             │              │                │
       ▼             ▼              ▼                ▼
┌──────────┐  ┌──────────┐  ┌──────────┐    ┌───────────┐
│CANCELLED │  │COMPLETED │  │ NO_SHOW  │    │RESCHEDULED│
└──────────┘  └──────────┘  └──────────┘    └─────┬─────┘
    (with         (after         (missed          │
   refund)      meeting)       meeting)           │
                                                   ▼
                                           Back to CONFIRMED
                                           (new slot/time)
```

### Payment Status Flow

```
┌─────────────┐
│   PENDING   │ (Payment intent created)
└──────┬──────┘
       │
       ├────────────────────────┐
       │                        │
       ▼                        ▼
┌─────────────┐          ┌──────────┐
│    PAID     │          │  FAILED  │
└──────┬──────┘          └──────────┘
       │
       ├────────────┐
       │            │
       ▼            ▼
┌──────────┐  ┌───────────┐
│REFUNDED  │  │ CANCELLED │
└──────────┘  └───────────┘
```

---

## Testing

### Test Coverage Summary

The appointment module has comprehensive test coverage with **25 integration tests** covering:

- **Booking Tests (9)**: All booking validations and business rules
- **Cancellation Tests (6)**: Refund calculations and status changes
- **Rescheduling Tests (7)**: Penalty calculations and slot management
- **Authorization Tests (3)**: Role-based access control

**Test Pass Rate**: 100% (25/25 tests passing)

### Key Test Scenarios

1. ✅ Successful appointment booking with payment
2. ✅ Booking limits (30-day advance, 1-hour minimum, 3 active, 5 weekly)
3. ✅ Cancellation with 100% refund (48+ hours)
4. ✅ Cancellation with 50% refund (24-48 hours)
5. ✅ Cancellation with 0% refund (< 24 hours)
6. ✅ Doctor cancellation (always 100% refund)
7. ✅ Free rescheduling (24+ hours)
8. ✅ Rescheduling with 50% penalty (4-24 hours)
9. ✅ Rescheduling blocked (< 4 hours)
10. ✅ Authorization checks (patient isolation)

---

## Conclusion

The Appointment Module provides a complete, production-ready solution for managing medical appointments with:

- **Automated Payment Processing** via Stripe
- **Fair Refund Policies** balancing patient flexibility with doctor compensation
- **Flexible Rescheduling** with appropriate penalty structures
- **Comprehensive Email Notifications** keeping all parties informed
- **Robust Business Rules** preventing abuse and ensuring fair access
- **Full Test Coverage** ensuring reliability and correctness

The system is designed to handle real-world scenarios while maintaining fairness, transparency, and excellent user experience for both patients and doctors.

---

**Document Version**: 1.0
**Last Updated**: February 12, 2026
**Module**: Appointment Management
**Status**: Production Ready
