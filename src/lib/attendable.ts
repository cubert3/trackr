/**
 * An event is attendable when registration is still open and the event hasn't ended.
 */
export interface AttendableEvent {
  startsAt: Date;
  endsAt?: Date | null;
  registrationDeadline?: Date | null;
  status: string;
}

export function getEffectiveRegistrationDeadline(event: AttendableEvent): Date {
  return event.registrationDeadline ?? event.startsAt;
}

export function getEffectiveEventEnd(event: AttendableEvent): Date {
  return event.endsAt ?? event.startsAt;
}

export function isRegistrationOpen(
  event: AttendableEvent,
  now: Date = new Date()
): boolean {
  return getEffectiveRegistrationDeadline(event) >= now;
}

export function isEventOngoingOrUpcoming(
  event: AttendableEvent,
  now: Date = new Date()
): boolean {
  return getEffectiveEventEnd(event) >= now;
}

export function isAttendable(
  event: AttendableEvent,
  now: Date = new Date()
): boolean {
  if (event.status !== "APPROVED") return false;
  return isRegistrationOpen(event, now) && isEventOngoingOrUpcoming(event, now);
}

export function shouldMarkPast(
  event: AttendableEvent,
  now: Date = new Date()
): boolean {
  if (event.status !== "APPROVED") return false;
  return !isEventOngoingOrUpcoming(event, now);
}

export type DeadlineUrgency = "closed" | "today" | "soon" | "open";

export function getDeadlineUrgency(
  event: AttendableEvent,
  now: Date = new Date()
): DeadlineUrgency {
  const deadline = getEffectiveRegistrationDeadline(event);
  if (deadline < now) return "closed";

  const msLeft = deadline.getTime() - now.getTime();
  const hoursLeft = msLeft / (1000 * 60 * 60);

  if (hoursLeft <= 24) return "today";
  if (hoursLeft <= 72) return "soon";
  return "open";
}
